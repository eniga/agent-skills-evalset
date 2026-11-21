import { changedNothing, check } from "../../lib.mjs";

// A second review round. Finding 1 was "fixed" with the wrong role ("admin"
// instead of canViewOrder's "support"), so it must be reopened. Finding 2 was
// contested with evidence and settled, so it must not come back as an open
// Blocker or Major. Finding 3 really is fixed.
const openRows = (c) =>
  c.text.split("\n").filter((l) => /^\|[^|]*\|\s*\**\s*(blocker|major)\b/i.test(l));

export default {
  skill: "spine-review",
  overlay: "order-lookup-round2",
  checks: [
    changedNothing,
    check("verdict is Request changes", (c) => /^request changes/i.test(c.field("Verdict"))),
    check("reopens finding 1: the fix used the wrong role", (c) =>
      c.has(/reopen|still open|not fixed|fix(?:\s+\w+)? fail|incomplete/i) && c.has(/admin/i) && c.has(/support|canViewOrder/),
    ),
    check("keeps finding 2 settled", (c) =>
      c.has(/settled/i) && !openRows(c).some((l) => /\bnull\b|ids? exist|enumerat|(id|existence)[^|]{0,20}leak/i.test(l) && !/settled/i.test(l)),
    ),
    check("marks finding 3 fixed", (c) => c.has(/\|\s*\**3\**\s*\|[^\n]*fixed/i) || c.has(/TC-U3[^\n]*(fixed|added|present)/i)),
    check("labels the round", (c) => c.has(/round[^\n]{0,20}\b2\b/i)),
  ],
};
