import { changedNothing, check } from "../../lib.mjs";

// A correct change. The skill must not invent problems to look thorough.
const blockerRows = (c) => c.text.split("\n").filter((l) => /^\|[^|]*\|\s*\**\s*blocker\b/i.test(l));

export default {
  skill: "spine-review",
  overlay: "order-lookup-clean",
  checks: [
    changedNothing,
    check("verdict is Approve (with or without notes)", (c) => /^approve/i.test(c.field("Verdict"))),
    check("raises no Blocker", (c) => blockerRows(c).length === 0),
    check("checked the authorization path", (c) => c.has(/canViewOrder/)),
    check("checked the proof for R-3", (c) => c.has(/TC-U3/)),
  ],
};
