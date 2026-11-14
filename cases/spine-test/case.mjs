import { changedNothing, check } from "../../lib.mjs";

const row = (c, id) => c.text.split("\n").filter((line) => new RegExp(`^\\|[^|]*\\b${id}\\b`).test(line)).join("\n");

export default {
  skill: "spine-test",
  overlay: "order-lookup",
  checks: [
    changedNothing, // a report, not a fix
    check("verdict is Not proven", (c) => /^not proven/i.test(c.field("Verdict"))),
    check("records the command it ran", (c) => c.has(/node --test|npm (run )?test/)),
    check("reports the failing confirmation test", (c) => c.has(/notify|confirmation/i)),
    check("names it a regression caused by the change", (c) => c.has(/regression/i) && c.has(/status/i)),
    check("gives every criterion a result", (c) =>
      ["TC-U1", "TC-U2", "TC-U3"].every((tc) => /pass|fail|unverified/i.test(row(c, tc))),
    ),
    check("does not pass the criterion that has no test", (c) =>
      /fail|unverified/i.test(row(c, "TC-U3")) && !/\|\s*pass\s*\|/i.test(row(c, "TC-U3")),
    ),
    check("notices the skipped test", (c) => c.has(/skip/i)),
  ],
};
