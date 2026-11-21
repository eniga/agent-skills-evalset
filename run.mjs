#!/usr/bin/env node
// Runs eval cases against an agent and grades the result with code.
//
//   node run.mjs --selftest
//   node run.mjs --agent copilot [--model <id>] [--case spine-build,spine-review]
//                [--baseline] [--repeat 3] [--skills ../agent-skills/skills]
//                [--timeout 900] [--keep]
//   --case accepts a trailing *, e.g. --case 'route-*'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, createContext, createWorkspace, sh } from "./lib.mjs";

const UNATTENDED = `
This is an unattended evaluation run. Nobody can answer questions or give
approval. Where you would ask, write the question with your recommended
answer, and continue only as far as your instructions allow without approval.
Do not push, open pull requests, or deploy. Put your complete result in your
final message.`;

function parseArgs(argv) {
  const opts = { repeat: 1, timeout: 900, skills: join(ROOT, "..", "agent-skills", "skills") };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (["--selftest", "--baseline", "--keep"].includes(flag)) opts[flag.slice(2)] = true;
    else if (["--agent", "--model", "--case", "--repeat", "--skills", "--timeout"].includes(flag)) {
      opts[flag.slice(2)] = argv[++i];
    } else throw new Error(`unknown argument: ${flag}`);
  }
  opts.repeat = Number(opts.repeat);
  opts.timeout = Number(opts.timeout);
  opts.skills = resolve(opts.skills);
  return opts;
}

async function loadCases(filter) {
  const wanted = filter ? filter.split(",") : null;
  const matches = (w, n) => (w.endsWith("*") ? n.startsWith(w.slice(0, -1)) : w === n);
  const all = readdirSync(join(ROOT, "cases"));
  const names = all.filter((n) => !wanted || wanted.some((w) => matches(w, n))).sort();
  if (wanted) for (const w of wanted) if (!all.some((n) => matches(w, n))) throw new Error(`no case named ${w}`);
  return Promise.all(
    names.map(async (name) => {
      const dir = join(ROOT, "cases", name);
      const mod = await import(pathToFileURL(join(dir, "case.mjs")).href);
      return { name, dir, task: readFileSync(join(dir, "task.md"), "utf8").trim(), ...mod.default };
    }),
  );
}

// The two built-in agents exist to test the graders, not a model:
// `reference` replays a known-good answer, `null` does nothing.
function runBuiltin(agent, kase, ws, markers) {
  if (agent === "null") return { output: "", status: 0 };
  const ref = join(kase.dir, "reference");
  if (existsSync(join(ref, "files"))) cpSync(join(ref, "files"), ws, { recursive: true });
  if (existsSync(join(ref, "commit.txt"))) {
    sh("git", ["add", "-A"], { cwd: ws });
    sh("git", ["commit", "-q", "--no-verify", "-F", join(ref, "commit.txt")], { cwd: ws });
  }
  const output = readFileSync(join(ref, "output.md"), "utf8").replace(
    /\{\{marker:([\w-]+)\}\}/g,
    (_, name) => markers[name] ?? "",
  );
  return { output, status: 0 };
}

function runExternal(def, prompt, ws, opts) {
  const promptFile = join(ws, ".git", "spine-eval-prompt.md");
  writeFileSync(promptFile, prompt);
  const fill = (arg) =>
    arg.replaceAll("{prompt}", prompt).replaceAll("{prompt_file}", promptFile).replaceAll("{model}", opts.model ?? "");
  const [cmd, ...args] = [...def.cmd, ...(opts.model ? def.modelArgs ?? [] : [])].map(fill);
  const started = Date.now();
  const r = sh(cmd, args, {
    cwd: ws,
    timeout: opts.timeout * 1000,
    input: def.stdin ? prompt : undefined,
    env: { ...process.env, ...def.env },
  });
  const traced = def.trace === "claude-stream-json" ? parseClaudeStream(r.stdout) : null;
  return {
    output: traced ? traced.output : r.stdout,
    toolCalls: traced?.toolCalls,
    status: r.status,
    stderr: r.stderr.slice(-4000),
    timedOut: r.timedOut,
    error: r.error,
    seconds: Math.round((Date.now() - started) / 1000),
  };
}

// Claude Code's stream-json output: one JSON event per line. The final
// answer is the "result" event; the tool calls show which skills were loaded,
// which a marker cannot show reliably (a careful model may decline to echo
// an instruction it found inside a skill).
function parseClaudeStream(stdout) {
  const events = stdout
    .split("\n")
    .filter((line) => line.startsWith("{"))
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const result = events.findLast((e) => e.type === "result");
  if (!result) return null;
  const toolCalls = events
    .filter((e) => e.type === "assistant")
    .flatMap((e) => e.message?.content ?? [])
    .filter((b) => b.type === "tool_use")
    .map((b) => ({ name: b.name, input: b.input }));
  return { output: result.result ?? "", toolCalls };
}

// Skills an agent loaded, from its tool calls: the Skill tool, or reading a
// SKILL.md directly.
function skillsFromTrace(toolCalls, installed) {
  const used = new Set();
  for (const { name, input } of toolCalls ?? []) {
    if (name === "Skill" && installed.includes(input?.skill)) used.add(input.skill);
    const text = JSON.stringify(input ?? {});
    for (const skill of installed) if (text.includes(`skills/${skill}/SKILL.md`)) used.add(skill);
  }
  return used;
}

async function runCase(kase, agentName, agentDef, opts) {
  const skill = opts.baseline ? null : kase.skill;
  const { ws, startSha, markers } = createWorkspace({
    fixture: kase.fixture,
    base: kase.base,
    overlay: kase.overlay,
    skill,
    skillsDir: opts.skills,
    route: Boolean(kase.route),
  });
  try {
    // A routing case names no skill: the agent must pick one from the
    // descriptions alone, as it would for a real request.
    const prompt =
      (skill && !kase.route ? `Read .agents/skills/${skill}/SKILL.md and follow it exactly for this task.\n\n` : "") +
      kase.task +
      "\n" +
      UNATTENDED;
    const run = agentDef ? runExternal(agentDef, prompt, ws, opts) : runBuiltin(agentName, kase, ws, markers);
    const traced = run.toolCalls ? skillsFromTrace(run.toolCalls, Object.keys(markers)) : undefined;
    const ctx = createContext({ ws, startSha, output: run.output, markers, traced });
    const checks = [];
    for (const { name, test } of kase.checks) {
      let pass = false;
      let error;
      try {
        pass = Boolean(await test(ctx));
      } catch (err) {
        error = err.message;
      }
      checks.push({ name, pass, ...(error && { error }) });
    }
    // Intent-to-add so new, untracked files show up in the saved patch.
    sh("git", ["add", "-A", "-N"], { cwd: ws });
    const patch = sh("git", ["diff", startSha], { cwd: ws }).stdout;
    const passed = checks.filter((c) => c.pass).length;
    // The agent never ran: it exited non-zero within seconds, or reported a
    // usage or rate limit. That is not a model result, so it is not scored.
    const infraError =
      Boolean(agentDef) &&
      !run.timedOut &&
      (/session limit|usage limit|rate limit|quota exceeded/i.test(run.output.slice(0, 500)) ||
        (run.status !== 0 && run.output.trim().length < 200));
    return {
      case: kase.name,
      skill: kase.skill,
      ...(kase.route && { skillsUsed: [...ctx.skillsUsed], detectedBy: traced ? "trace" : "marker" }),
      ...(run.toolCalls && { tools: run.toolCalls.map((t) => t.name) }),
      ...(infraError && { infraError: true }),
      pass: passed === checks.length,
      score: passed / checks.length,
      checks,
      changed: ctx.changed,
      run: { status: run.status, timedOut: run.timedOut, seconds: run.seconds, error: run.error, stderr: run.stderr },
      output: run.output,
      patch,
      workspace: opts.keep ? ws : undefined,
    };
  } finally {
    if (!opts.keep) rmSync(ws, { recursive: true, force: true });
  }
}

function writeResults(dir, label, results) {
  mkdirSync(dir, { recursive: true });
  for (const [i, r] of results.entries()) {
    const sub = join(dir, `${r.case}${results.filter((x) => x.case === r.case).length > 1 ? `-${i}` : ""}`);
    mkdirSync(sub, { recursive: true });
    writeFileSync(join(sub, "output.md"), r.output);
    writeFileSync(join(sub, "changes.patch"), r.patch);
    const { output, patch, ...rest } = r;
    writeFileSync(join(sub, "result.json"), JSON.stringify(rest, null, 2));
  }
  const rows = results.map((r) => {
    if (r.infraError) return `| ${r.case} | ERROR | - | agent did not run: ${r.output.trim().slice(0, 80)} |`;
    const failed = r.checks.filter((c) => !c.pass).map((c) => c.name);
    return `| ${r.case} | ${r.pass ? "pass" : "FAIL"} | ${Math.round(r.score * 100)}% | ${failed.join("; ") || "none"} |`;
  });
  const scored = results.filter((r) => !r.infraError);
  const errors = results.length - scored.length;
  const passed = scored.filter((r) => r.pass).length;
  const mean = scored.length ? scored.reduce((sum, r) => sum + r.score, 0) / scored.length : 0;
  const summary = [
    `# ${label}`,
    "",
    `Cases passed: **${passed}/${scored.length}**. Mean check score: **${Math.round(mean * 100)}%**.` +
      (errors ? ` **${errors} run(s) not scored:** the agent did not run (limit or crash); re-run them.` : ""),
    "",
    "| Case | Result | Checks passed | Failed checks |",
    "|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
  writeFileSync(join(dir, "summary.md"), summary);
  writeFileSync(
    join(dir, "summary.json"),
    JSON.stringify({ label, passed, total: scored.length, errors, mean, results: results.map(({ output, patch, ...r }) => r) }, null, 2),
  );
  return summary;
}

async function selftest(opts) {
  const cases = await loadCases(opts.case);
  let bad = 0;
  for (const kase of cases) {
    const ref = await runCase(kase, "reference", null, opts);
    const nul = await runCase(kase, "null", null, opts);
    const refFailed = ref.checks.filter((c) => !c.pass).map((c) => c.error ? `${c.name} (${c.error})` : c.name);
    const ok = ref.pass && !nul.pass;
    if (!ok) bad++;
    console.log(
      `${ok ? "✓" : "✗"} ${kase.name}: reference ${ref.checks.length - refFailed.length}/${ref.checks.length}` +
        `, null ${nul.checks.filter((c) => c.pass).length}/${nul.checks.length}` +
        (refFailed.length ? `\n    reference failed: ${refFailed.join("; ")}` : "") +
        (nul.pass ? "\n    the do-nothing agent passed: the checks are too weak" : ""),
    );
  }
  console.log(bad ? `\n${bad} case(s) have broken graders.` : `\nAll ${cases.length} cases grade correctly.`);
  process.exit(bad ? 1 : 0);
}

// A copy of a skill under test installed for the user (outside the
// workspace) can be loaded instead of the workspace copy. It hides routing
// markers, tests the installed version instead of this checkout, and gives
// baseline runs the skill. The agent entry must isolate from it.
function warnGlobalInstalls(cases) {
  const names = new Set(cases.map((k) => k.skill).filter(Boolean));
  const homes = [".claude/skills", ".agents/skills", ".copilot/skills"].map((h) => join(homedir(), h));
  const found = homes.flatMap((h) => [...names].filter((n) => existsSync(join(h, n))).map((n) => join(h, n)));
  if (found.length)
    console.warn(
      `warning: ${found.length} skill(s) under test are also installed for your user, e.g. ${found[0]}.\n` +
        "  Unless the agent entry isolates from user skills (claude: --setting-sources project,local),\n" +
        "  results may reflect the installed copy, not this checkout.\n",
    );
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selftest) return selftest(opts);
  if (!opts.agent) throw new Error("pass --agent <name> (see agents.json) or --selftest");

  const agents = JSON.parse(readFileSync(join(ROOT, "agents.json"), "utf8"));
  const builtin = ["reference", "null"].includes(opts.agent);
  const def = agents[opts.agent];
  if (!builtin && !def) throw new Error(`no agent "${opts.agent}" in agents.json`);

  // Routing has no baseline: with no skills installed there is nothing to route to.
  const cases = (await loadCases(opts.case)).filter((k) => !(opts.baseline && k.route));
  warnGlobalInstalls(cases);
  const label = [opts.agent, opts.model, opts.baseline ? "baseline (no skill)" : "with skill"].filter(Boolean).join(" / ");
  const results = [];
  for (const kase of cases) {
    for (let i = 0; i < opts.repeat; i++) {
      process.stdout.write(`${kase.name}${opts.repeat > 1 ? ` #${i + 1}` : ""} ... `);
      const r = await runCase(kase, opts.agent, builtin ? null : def, opts);
      results.push(r);
      if (r.infraError) console.log(`ERROR, not scored: ${r.output.trim().slice(0, 80)}`);
      else console.log(`${r.pass ? "pass" : "FAIL"} ${Math.round(r.score * 100)}%${r.run.timedOut ? " (timed out)" : ""}`);
    }
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const slug = [opts.agent, opts.model, opts.baseline ? "baseline" : "skill"].filter(Boolean).join("_").replace(/[^\w.-]/g, "-");
  const dir = join(ROOT, "results", `${stamp}_${slug}`);
  console.log(`\n${writeResults(dir, label, results)}\nResults: ${dir}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(2);
});
