import { check, reallyFailing as failing } from "../../lib.mjs";

const BUG = "if (range.to && date >= range.to) return false;";
const FIX = "if (range.to && date > range.to) return false;";

// Second fixture: a CommonJS command-line tool, so the skill is not only
// ever tested on the order service.
export default {
  skill: "spine-diagnose",
  fixture: "fixture-ledger",
  checks: [
    check("no source file changed (no fix applied)", (c) =>
      !c.changed.some((p) => p.startsWith("src/") || p.startsWith("bin/")),
    ),
    check("a regression test was added", (c) => c.changed.some((p) => p.startsWith("test/"))),
    check("the new test fails on the current code (not skipped)", (c) => failing(c.tests().stdout)),
    check("the failing test is marked expected, so the suite still exits 0", (c) =>
      c.changed.some((p) => p.startsWith("test/")) && c.tests().status === 0,
    ),
    check("the new test passes once the real cause is fixed", (c) => {
      const code = c.read("src/range.js");
      if (!code.includes(BUG) || !failing(c.tests().stdout)) return false;
      c.write("src/range.js", code.replace(BUG, FIX));
      try {
        const r = c.tests();
        return !failing(r.stdout);
      } finally {
        c.write("src/range.js", code);
      }
    }),
    check("names the location of the cause", (c) => c.has(/inRange/) && c.has(/range\.js/)),
    check("explains the mechanism", (c) =>
      c.has(/>=|exclusive|inclusive|both ends|last day|end date|boundary|off[- ]by[- ]one/i),
    ),
    check("classifies the defect as a code defect", (c) => c.has(/code defect/i)),
    check("writes a defect record with an ID and hypotheses", (c) => c.ids("D").size >= 1 && c.has(/hypothes/i)),
  ],
};
