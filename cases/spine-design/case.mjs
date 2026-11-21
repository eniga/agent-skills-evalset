import { changedNothing, check } from "../../lib.mjs";

export default {
  skill: "spine-design",
  checks: [
    changedNothing,
    check("compares at least two options", (c) => c.count(/^#{3,4}\s+\S/gm) >= 2 && c.section(/^#+\s*Options/i).trim().length > 0),
    check("includes the do-nothing or keep-current option", (c) =>
      c.has(/do nothing|keep (the )?(current|existing|in-memory)|status quo/i),
    ),
    check("writes decision criteria before the options", (c) => {
      const criteria = c.text.search(/^#+\s*Decision criteria/im);
      const options = c.text.search(/^#+\s*Options/im);
      return criteria !== -1 && options !== -1 && criteria < options;
    }),
    check("says what the decision gives up", (c) => {
      const cost = c.field("What we give up");
      return cost.length > 15 && !/^(none|nothing|minimal|n\/a)/i.test(cost);
    }),
    check("status is Proposed, not self-accepted", (c) =>
      // The Status field, or "Status is Proposed" when the design is returned in prose.
      /^proposed/i.test(c.field("Status")) || (/\bstatus (is|stays) \**proposed/i.test(c.text) && !/^accepted/i.test(c.field("Status")))),
    check("uses the stated numbers", (c) => c.has(/1,?000/)),
    check("states what would reverse the decision and its cost", (c) =>
      c.has(/wrong if/i) && c.has(/cost to reverse/i),
    ),
    check("marks assumptions as assumptions", (c) => c.has(/assum/i)),
  ],
};
