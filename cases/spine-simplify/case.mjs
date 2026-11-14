import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { check, suitePasses } from "../../lib.mjs";

const hidden = readFileSync(join(import.meta.dirname, "hidden.test.js"), "utf8");
const HIDDEN_PATH = "test/zz-hidden.test.js";
const TARGET = "src/report.js";

const maxIndent = (code) => Math.max(...code.split("\n").map((line) => /^ */.exec(line)[0].length));
const lineCount = (code) => code.split("\n").filter((line) => line.trim()).length;

export default {
  skill: "spine-simplify",
  checks: [
    suitePasses,
    check("hidden characterization tests pass (behavior unchanged)", (c) => {
      c.write(HIDDEN_PATH, hidden);
      try {
        return c.tests(HIDDEN_PATH).status === 0;
      } finally {
        rmSync(join(c.ws, HIDDEN_PATH));
      }
    }),
    check("only the named target changed under src/", (c) => {
      const src = c.changed.filter((p) => p.startsWith("src/"));
      return src.length === 1 && src[0] === TARGET;
    }),
    check("no existing test line was edited or removed", (c) => {
      const now = c.read("test/report.test.js");
      return c
        .original("test/report.test.js")
        .split("\n")
        .filter((line) => line.trim())
        .every((line) => now.includes(line));
    }),
    check("nesting is shallower than before", (c) => maxIndent(c.read(TARGET)) < maxIndent(c.original(TARGET))),
    check("the code is not longer than before", (c) => lineCount(c.read(TARGET)) <= lineCount(c.original(TARGET))),
    check("the public signature is unchanged", (c) =>
      /export function summarizeOrders\(orders\)/.test(c.read(TARGET)),
    ),
    check("reports the test command run before and after", (c) =>
      c.has(/node --test|npm (run )?test/) && c.has(/baseline|before/i) && c.has(/after/i),
    ),
  ],
};
