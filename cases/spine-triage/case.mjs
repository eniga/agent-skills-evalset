import { changedNothing, check } from "../../lib.mjs";

export default {
  skill: "spine-triage",
  checks: [
    changedNothing,
    check("verdict is Not ready", (c) => /^not ready/i.test(c.field("Verdict"))),
    check("ranks at least three gaps", (c) => c.count(/^\|\s*\d+\s*\|/gm) >= 3),
    check("finds the two outcomes in one story", (c) => c.has(/two (outcomes|stories|features)|split/i)),
    check("finds the untestable criteria", (c) => c.has(/testable|given\/when\/then|concrete|works correctly/i)),
    check("finds the missing non-goals", (c) => c.has(/non-goal/i)),
    check("finds the implementation detail in the story", (c) => c.has(/implementation|table/i)),
    check("every gap row names a fix", (c) => {
      const rows = c.text.split("\n").filter((line) => /^\|\s*\d+\s*\|/.test(line));
      return rows.length > 0 && rows.every((row) => row.split("|").slice(1, -1).every((cell) => cell.trim()));
    }),
  ],
};
