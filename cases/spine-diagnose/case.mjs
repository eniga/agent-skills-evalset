import { check } from "../../lib.mjs";

const BUG = "bySku[item.sku] = item.qty;";
const FIX = "bySku[item.sku] = (bySku[item.sku] ?? 0) + item.qty;";
const failing = (tap) => /^\s*not ok/m.test(tap);

export default {
  skill: "spine-diagnose",
  checks: [
    check("no source file changed (no fix applied)", (c) => !c.changed.some((p) => p.startsWith("src/"))),
    check("a regression test was added", (c) => c.changed.some((p) => p.startsWith("test/"))),
    check("the new test fails on the current code (not skipped)", (c) => failing(c.tests().stdout)),
    check("the failing test is marked expected, so the suite still exits 0", (c) =>
      c.changed.some((p) => p.startsWith("test/")) && c.tests().status === 0,
    ),
    // Behavioral: the new test must flip from failing to passing when only
    // the real cause is fixed. A suite that never failed proves nothing.
    check("the new test passes once the real cause is fixed", (c) => {
      const code = c.read("src/cart.js");
      if (!code.includes(BUG) || !failing(c.tests().stdout)) return false;
      c.write("src/cart.js", code.replace(BUG, FIX));
      try {
        const r = c.tests();
        return r.status === 0 && !failing(r.stdout);
      } finally {
        c.write("src/cart.js", code);
      }
    }),
    check("names the location of the cause", (c) => c.has(/mergeLines/) && c.has(/cart\.js/)),
    check("explains the mechanism", (c) =>
      c.has(/overwrit|replac|instead of add|last (line|quantity|one)|not (added|summed|accumulated)|assign/i),
    ),
    check("classifies the defect as a code defect", (c) => c.has(/code defect/i)),
    check("writes a defect record with an ID and hypotheses", (c) => c.ids("D").size >= 1 && c.has(/hypothes/i)),
  ],
};
