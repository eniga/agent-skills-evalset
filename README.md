# Spine eval set

Measures whether the [Spine skills](https://github.com/eniga/agent-skills)
make an agent do the work correctly, on any model. 18 cases, one per skill.
Every case is graded by code, not by another model, so results are
repeatable and free to grade.

Needs Node 20 or later and git. No dependencies. Clone it next to the skills
(or pass `--skills <dir>`):

```bash
git clone https://github.com/eniga/agent-skills
git clone https://github.com/eniga/agent-skills-evalset
cd agent-skills-evalset
```

## Run it

```bash
node run.mjs --selftest                      # prove the graders work (no model, no cost)

node run.mjs --agent copilot                 # all 18 cases, skill installed
node run.mjs --agent copilot --baseline      # same tasks, no skill: the comparison
node run.mjs --agent copilot --model <id> --case spine-build,spine-review
node run.mjs --agent copilot --repeat 3      # repeat each case to see variance
```

| Flag | Meaning | Default |
|---|---|---|
| `--agent <name>` | An entry in `agents.json` | required |
| `--model <id>` | Passed to the agent through its `modelArgs` | the agent's own default |
| `--case a,b` | Only these cases | all |
| `--baseline` | Do not install the skill or mention it | off |
| `--repeat <n>` | Run each case n times | 1 |
| `--skills <dir>` | Where the skills are | `../agent-skills/skills` |
| `--timeout <s>` | Per-case limit in seconds | 900 |
| `--keep` | Keep each workspace for inspection | off |

Results go to `results/<time>_<agent>_<mode>/`: a `summary.md` table, a
`summary.json`, and per case the agent's `output.md`, its `changes.patch`,
and `result.json` with every check.

**The agent runs with permission to edit files and run commands.** Each case
runs in a fresh temporary git repository, but the agent is not sandboxed.
Run untrusted or local models inside a container or VM.

Long runs: keep the machine awake (`caffeinate -i node run.mjs …` on macOS).
A machine that sleeps mid-case records a false timeout. A run where the
agent never worked (a usage or rate limit message, or a non-zero exit with
almost no output) is shown as `ERROR`, left out of the scores, and should be
re-run.

`overlays/order-lookup/src/orders.js` holds a deliberately planted, fake
token that several cases expect the agent to flag. `.gitleaks.toml`
allowlists that one file.

## What to compare

- **Skill vs baseline** on the same model: the lift the skill gives.
- **Model vs model** with the skill: which models can be trusted with which
  stage. Expect small models to pass the document cases before the code and
  judgement cases.
- **Before vs after** a change to a skill: run the affected case with
  `--repeat 3` on both versions. One run is an anecdote.

Read the failed check names, not only the score. A failed
`stays Draft: does not approve its own spec` matters more than a missed
heading.

## Results so far

Claude Code, November 2026, every case graded by this repository's checks.
"Runs" counts each repeat.

| Model | No skill (18 cases) | With the skills (each case twice) |
|---|---|---|
| Claude Sonnet 5.5 | 5/18 passed, 76% of checks | 35/36 runs passed, over 99% of checks |
| Claude Haiku 5.5 | **0/18 passed, 43% of checks** | 37/39 runs passed, over 99% of checks |

- The skills close the gap between the models: without them Haiku passes no
  case and Sonnet a quarter; with them both pass nearly everything.
- Without a skill even the strong model skips the discipline: no non-goals in
  a story, no options in a design, no failing regression test before a fix,
  and untested work reported as proven.
- The three failures with the skills each traced to the skill text (a
  "Deferred" state usable without a plan, a PR verdict list missing
  "Not proven", a non-goal template that invited code citations). All three
  were fixed, and each fix was re-run and passed on both models.

## Agents

`agents.json` maps a name to a command. `{prompt}` is replaced with the task;
`{prompt_file}` with a path to a file holding it; `"stdin": true` pipes it
in. The agent's standard output is taken as its final answer.

| Entry | Status |
|---|---|
| `copilot` | Flags taken from `copilot --help` (v1.0.86). Not yet run end to end here. |
| `claude` | Run end to end with Claude Code (`--model claude-sonnet-5-5`, `claude-haiku-5-5`). |
| `opencode` | A starting point for local models (for example Qwen through Ollama). Check the flags against your version. |

To add a model served locally, add an entry whose command starts the agent
CLI you use with it, then run one cheap case first:

```bash
node run.mjs --agent <name> --case spine-triage --keep
```

## The cases

Every case starts from `fixture/`, a small dependency-free order service
with a passing test suite. Five cases add `overlays/order-lookup/`, a feature
branch with planted defects: a missing authorization check, a broken
contract that fails an existing test, a hardcoded token written to the log,
a skipped test, and an unrequested function.

| Case | Task | Graded on |
|---|---|---|
| `spine-context` | Map the repo for a named change | Every cited `path:line` exists; tests were run; facts split from inferences; nothing changed |
| `spine-project` | Summarize the project | Real commands and modules; says no docs set exists; writes nothing |
| `spine-story` | Vague intent to story | Given/When/Then, a failure or misuse path, a non-goal, no implementation, no `.specs/` created |
| `spine-triage` | Judge a bad story | Verdict Not ready; finds the four planted gaps; each gap has a fix |
| `spine-refine` | Size a ready story | Points on the scale with rationale; tasks map to criteria; reuses existing code |
| `spine-design` | Choose order persistence | Criteria before options; a do-nothing option; a real cost; stays Proposed |
| `spine-spec` | Write the spec | Twelve sections; every R has a TC; security and rollback; **stays Draft** despite "go ahead" |
| `spine-constraints` | Set the quality bar | Real commands; secret and dependency rules; unwired checks marked; stays Draft |
| `spine-amend` | Change agreed requirements | IDs kept; before and after; names invalidated slice and tests; approval left pending |
| `spine-plan` | Plan four requirements | Slices with checkpoint commands; all requirements covered; reuse; rollback |
| `spine-build` | Add shipping to orders | Hidden acceptance tests; reuses the existing rule; diff of 20 lines or fewer in one file; committed with IDs |
| `spine-simplify` | Simplify a nested function | Hidden behavior tests; shallower and no longer; no test edited; one file |
| `spine-diagnose` | Find a planted bug | No fix applied; a test that fails now and passes once the real cause is fixed; names the line |
| `spine-test` | Verify the defective branch | Verdict Not proven; names the regression; does not pass the untested criterion; fixes nothing |
| `spine-review` | Review the defective branch | Request changes; finds each planted defect; edits nothing |
| `spine-conform` | Conformance of the same branch | One row per requirement; R-3 Not implemented; non-goal flagged; Non-conformant |
| `spine-pr` | PR description for that branch | Traceability rows; evidence reported honestly; token flagged; open items |
| `spine-release` | Go or no-go with nothing rehearsed | NO-GO; failed checks named; does not deploy or decide alone |

## How grading is kept honest

Each case carries a `reference/` answer. `--selftest` replays it and requires
every check to pass, then runs an agent that does nothing and requires the
case to fail. Run `--selftest` after changing any case, the fixture,
`lib.mjs`, or `run.mjs`. A grader change also makes earlier results stale:
re-run the affected cases before comparing against them. The evalset is a
git repository so grader changes are reviewable; commit them separately
from results.

Checks look for behavior, not wording, wherever the behavior can be observed:
hidden tests, the diff, the commit log, the files that exist. Document cases
fall back to structure and to facts planted in the fixture. They cannot
judge prose quality; read a sample of `output.md` files for that.

## Adding a case

```
cases/<name>/
  task.md              what the user asks
  case.mjs             { skill, overlay?, checks: [check(name, (c) => boolean)] }
  reference/output.md  a known-good final answer
  reference/files/     optional: files the reference writes
  reference/commit.txt optional: commits them with this message
```

The context object `c` is defined in `lib.mjs`: `text`, `changed`, `commits`,
`read`, `original`, `tests`, `field`, `section`, `ids`, `onlyChanged`.
