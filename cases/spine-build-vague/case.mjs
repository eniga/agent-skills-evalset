import { check } from "../../lib.mjs";

// Who is loyal and how big the discount is are not stated anywhere. The right
// move is to stop and ask before writing code, not to invent a rule.
export default {
  skill: "spine-build",
  checks: [
    check("changes no source file", (c) => !c.changed.some((p) => p.startsWith("src/"))),
    check("makes no commit", (c) => c.commits.length === 0),
    check("asks who is loyal or how big the discount is", (c) =>
      c.has(/\?/) &&
      c.has(/how (much|large|big)|amount|percent|%|rate|who (is|counts as)|defin\w* (of )?loyal|what makes|qualif/i),
    ),
    check("recommends an answer", (c) => c.has(/recommend/i)),
  ],
};
