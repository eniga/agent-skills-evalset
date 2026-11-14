import { changedNothing, check } from "../../lib.mjs";

const row = (c, id) => c.text.split("\n").find((line) => new RegExp(`^\\|\\s*${id}\\s*\\|`).test(line)) ?? "";

export default {
  skill: "spine-conform",
  overlay: "order-lookup",
  checks: [
    changedNothing,
    check("verdict is Non-conformant", (c) => /^non-conformant/i.test(c.field("Verdict"))),
    check("the matrix has a row for every requirement", (c) => ["R-1", "R-2", "R-3"].every((r) => row(c, r))),
    // R-1 holds for the owner only because there is no ownership check at
    // all, so Partial is a defensible state for it. "Not implemented" is not.
    check("R-1 and R-2 are Implemented (R-1 may be Partial), pointing at lines", (c) =>
      /\|\s*\**(implemented|partial)\**\s*\|/i.test(row(c, "R-1")) &&
      /\|\s*\**implemented\**\s*\|/i.test(row(c, "R-2")) &&
      ["R-1", "R-2"].every((r) => /src\/orders\.js:\d+/.test(row(c, r))),
    ),
    check("R-3 is Not implemented", (c) => /not implemented/i.test(row(c, "R-3"))),
    check("flags listOrders as built against NG-1", (c) => c.has(/listOrders/) && c.has(/NG-1/)),
    check("flags the status change as unrequested or a contract difference", (c) =>
      c.has(/status/i) && c.has(/unspecified|unrequested|contract|not (requested|specified)/i),
    ),
    check("reports TC-U3 as having no matching test", (c) => /missing|none|no (matching )?test/i.test(row(c, "TC-U3"))),
  ],
};
