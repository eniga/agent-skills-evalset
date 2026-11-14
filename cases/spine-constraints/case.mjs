import { check } from "../../lib.mjs";

const FILE = "CONSTRAINTS.md";
// Rule rows: | C-1 | rule | threshold | command | gate | block/warn | reason |
const rules = (c) =>
  c
    .read(FILE)
    .split("\n")
    .filter((line) => /^\|\s*C-\d+\s*\|/.test(line))
    .map((line) => line.split(/(?<!\\)\|/).slice(1, -1).map((cell) => cell.trim()));

export default {
  skill: "spine-constraints",
  checks: [
    check("writes CONSTRAINTS.md at the repository root", (c) => c.exists(FILE)),
    check("changes nothing else without approval", (c) => c.onlyChanged(/^CONSTRAINTS\.md$/)),
    check("stays Draft: does not approve its own bar", (c) => /^draft/i.test(c.field("Status", c.read(FILE)))),
    check("has at least four rules", (c) => rules(c).length >= 4),
    check("every rule has a command or a named manual checker", (c) =>
      rules(c).length > 0 && rules(c).every((row) => /`[^`]+`|manual/i.test(row[3] ?? "")),
    ),
    check("every rule says block or warn", (c) =>
      rules(c).length > 0 && rules(c).every((row) => /block|warn/i.test(row[5] ?? "")),
    ),
    check("uses the test command the repository really has", (c) => /node --test|npm (run )?test/.test(c.read(FILE))),
    check("has a secrets rule and a dependency rule", (c) =>
      rules(c).some((row) => /secret/i.test(row[1])) && rules(c).some((row) => /dependenc/i.test(row[1])),
    ),
    check("marks checks that are not wired yet", (c) => /not yet wired/i.test(c.read(FILE))),
  ],
};
