import { changedNothing, check } from "../../lib.mjs";

export default {
  skill: "spine-project",
  checks: [
    changedNothing,
    check("gives the run or test command", (c) => c.has(/node --test|npm (run )?test/)),
    check("describes the real modules", (c) =>
      ["order", "cart", "shipping"].filter((word) => c.has(new RegExp(word, "i"))).length === 3,
    ),
    check("says no documentation set exists", (c) =>
      c.has(/no (documentation|docs)( set)?|derived from (the )?code|docs\/?`? (is|are|directory is) (absent|missing)|without a docs/i),
    ),
    check("states its sources", (c) => c.has(/\*\*sources?[:.]?\*\*|sources?\s*:/i)),
    check("reports disagreements between docs and code, or none", (c) => c.has(/disagree/i)),
  ],
};
