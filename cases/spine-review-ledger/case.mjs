import { changedNothing, check } from "../../lib.mjs";

// Second fixture, with defects unlike the order-lookup ones: spreadsheet
// formula injection, unquoted CSV, an out-of-scope change to parsing, and a
// deleted test.
export default {
  skill: "spine-review",
  fixture: "fixture-ledger",
  overlay: "ledger-export",
  checks: [
    changedNothing,
    check("verdict is Request changes", (c) => /^request changes/i.test(c.field("Verdict"))),
    check("has a Blocker", (c) => c.has(/blocker/i)),
    check("finds the unquoted memo (TC-U2 / commas)", (c) => c.has(/quot|escap/i) && c.has(/comma/i)),
    check("finds spreadsheet formula injection", (c) => c.has(/formula|csv injection|spreadsheet injection/i)),
    check("finds the out-of-scope parseCsv change", (c) =>
      c.has(/parseCsv|parse\.js/) && c.has(/NG-1|silent|skip|drop|no longer throw|contract/i),
    ),
    check("finds the deleted test", (c) => c.has(/(remov|delet)[^\n]{0,80}test|test[^\n]{0,80}(remov|delet)/i)),
    check("cites file locations", (c) => c.count(/src\/(export|parse)\.js/g) >= 2),
  ],
};
