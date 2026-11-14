// Workspace setup and the context object that case checks run against.
import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const ROOT = import.meta.dirname;

export function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts });
  return {
    status: r.status ?? 1,
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
    timedOut: r.error?.code === "ETIMEDOUT",
    error: r.error?.message,
  };
}

const git = (ws, ...args) => sh("git", args, { cwd: ws });

function commitAll(ws, message) {
  git(ws, "add", "-A");
  const r = git(ws, "commit", "-q", "--no-verify", "-m", message);
  if (r.status !== 0) throw new Error(`git commit failed: ${r.stderr}`);
}

// A fresh git repository holding the fixture, optionally with an overlay
// committed on a feature branch, and the skill under test installed.
export function createWorkspace({ overlay, skill, skillsDir }) {
  const ws = mkdtempSync(join(tmpdir(), "spine-eval-"));
  cpSync(join(ROOT, "fixture"), ws, { recursive: true });
  git(ws, "init", "-q", "-b", "main");
  git(ws, "config", "user.name", "spine-eval");
  git(ws, "config", "user.email", "eval@example.com");
  git(ws, "config", "commit.gpgsign", "false");
  commitAll(ws, "chore: fixture baseline");

  if (overlay) {
    const dir = join(ROOT, "overlays", overlay);
    git(ws, "checkout", "-q", "-b", `feature/${overlay}`);
    cpSync(dir, ws, { recursive: true, filter: (src) => !src.endsWith("COMMIT_MSG") });
    commitAll(ws, readFileSync(join(dir, "COMMIT_MSG"), "utf8"));
  }

  // The skill is tooling, not part of the change, so git never sees it.
  appendFileSync(join(ws, ".git", "info", "exclude"), ".agents/\n.claude/\n.github/skills/\n");
  if (skill) {
    const src = join(skillsDir, skill);
    if (!existsSync(join(src, "SKILL.md"))) throw new Error(`no skill at ${src}`);
    for (const home of [".agents/skills", ".claude/skills"]) {
      cpSync(src, join(ws, home, skill), { recursive: true });
    }
  }

  const startSha = git(ws, "rev-parse", "HEAD").stdout.trim();
  return { ws, startSha };
}

// Everything a check may ask about one finished run.
export function createContext({ ws, startSha, output }) {
  const lines = (s) => s.split("\n").filter(Boolean);
  const changed = [
    ...new Set([
      ...lines(git(ws, "diff", "--name-only", startSha).stdout),
      ...lines(git(ws, "ls-files", "--others", "--exclude-standard").stdout),
    ]),
  ].sort();

  const read = (path) => {
    try {
      return readFileSync(join(ws, path), "utf8");
    } catch {
      return "";
    }
  };

  const commits = git(ws, "log", "--format=%H%x00%B%x01", `${startSha}..HEAD`)
    .stdout.split("\x01")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [sha, message] = entry.split("\x00");
      return { sha, message: message.trim() };
    });

  // What the agent said, plus every markdown file it wrote or changed.
  const text = [output, ...changed.filter((p) => p.endsWith(".md")).map(read)].join("\n\n");

  const c = {
    ws,
    startSha,
    output,
    text,
    changed,
    commits,
    read,
    exists: (path) => existsSync(join(ws, path)),
    original: (path) => git(ws, "show", `${startSha}:${path}`).stdout,
    write: (path, content) => writeFileSync(join(ws, path), content),
    run: (cmd, args, opts = {}) => sh(cmd, args, { cwd: ws, timeout: 120_000, ...opts }),
    tests: (...args) => c.run("node", ["--test", "--test-reporter=tap", ...args]),
    has: (re) => re.test(text),
    count: (re) => (text.match(re) ?? []).length,
    // Distinct IDs of one kind, e.g. ids("R") -> Set { "R-1", "R-2" }.
    ids: (prefix) => new Set(text.match(new RegExp(`\\b${prefix}-\\d+\\b`, "g")) ?? []),
    // The value of a labelled field: "> **Verdict:** Not ready", or the
    // first line under a "## Verdict" heading. Pass `source` (e.g. a file the
    // agent wrote) when its chat output may quote the label in passing.
    field: (label, source = text) => {
      const inline = new RegExp(`${label}\\*{0,2}[ \\t]*:[ \\t]*\\*{0,2}[ \\t]*([^\\n]+)`, "i");
      const heading = new RegExp(`^#{1,4}[^\\n]*${label}[ \\t]*\\n+[ \\t>]*([^\\n]+)`, "im");
      const clean = (s) => s.replace(/[*`_]/g, "").trim();
      // Whichever form appears first wins, so a later passing mention such
      // as "not verdict: ..." cannot shadow a "## Verdict" heading.
      const match = inline.exec(source);
      const head = heading.exec(source);
      if (head && (!match || head.index < match.index)) return clean(head[1]);
      if (match && clean(match[1])) return clean(match[1]);
      // "**What we give up:**" followed by a bullet list on the next lines.
      if (match) {
        const after = source.slice(match.index + match[0].length).split("\n").slice(1);
        const bullets = [];
        for (const line of after) {
          if (/^\s*[-*]\s+/.test(line)) bullets.push(clean(line.replace(/^\s*[-*]\s+/, "")));
          else if (bullets.length || line.trim()) break;
        }
        if (bullets.length) return bullets.join("; ");
      }
      return head ? clean(head[1]) : "";
    },
    // Text from a heading matching `re` up to the next heading of the same
    // or a higher level.
    section: (re) => {
      const all = text.split("\n");
      const start = all.findIndex((line) => /^#{1,6}\s/.test(line) && re.test(line));
      if (start === -1) return "";
      const level = /^#+/.exec(all[start])[0].length;
      const rest = all.slice(start + 1);
      const end = rest.findIndex((line) => new RegExp(`^#{1,${level}}\\s`).test(line));
      return rest.slice(0, end === -1 ? undefined : end).join("\n");
    },
    // True when every changed path matches one of the patterns.
    onlyChanged: (...patterns) => changed.every((p) => patterns.some((re) => re.test(p))),
  };
  return c;
}

export const check = (name, test) => ({ name, test });

// Shared checks.
export const changedNothing = check("changed no file", (c) => c.changed.length === 0);
export const suitePasses = check("test suite passes", (c) => c.tests().status === 0);
