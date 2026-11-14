import { changedNothing, check } from "../../lib.mjs";

// Rows of the task table: | T-1 | task | maps to | points | rationale | depends on |
const taskRows = (c) =>
  c.text
    .split("\n")
    .filter((line) => /^\|\s*T-\d+\s*\|/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));

const everyTask = (c, ok) => taskRows(c).length > 0 && taskRows(c).every(ok);

export default {
  skill: "spine-refine",
  checks: [
    changedNothing,
    check("breaks the story into at least two tasks", (c) => taskRows(c).length >= 2),
    check("every task has points on the 1, 2, 3, 5, 8 scale", (c) =>
      everyTask(c, (row) => ["1", "2", "3", "5", "8"].includes(row[3])),
    ),
    check("every task has a rationale and names its dependencies", (c) =>
      everyTask(c, (row) => row.length >= 6 && row[4] && row[5]),
    ),
    check("every task maps to a criterion or requirement", (c) =>
      everyTask(c, (row) => /\b(AC|R)-\d+\b/.test(row[2])),
    ),
    check("no task is an unsplit 8", (c) => everyTask(c, (row) => row[3] !== "8" || /spike/i.test(row[1]))),
    check("sketch requirements are marked confirmed or assumed", (c) =>
      c.has(/R-\d+\s*\((confirmed|assumed)\)/i),
    ),
    check("the sketch is not presented as a spec", (c) => c.has(/not a spec|head start/i)),
    check("names the existing code the work lands in", (c) => c.has(/src\/orders\.js|createOrder/)),
  ],
};
