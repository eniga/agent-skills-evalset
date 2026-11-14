import { changedNothing, check } from "../../lib.mjs";

// Every `path:line` the map cites, e.g. src/orders.js:8.
const citations = (c) =>
  [...c.text.matchAll(/\b((?:src|test)\/[\w./-]+\.js|package\.json|README\.md):(\d+)/g)].map((m) => ({
    path: m[1],
    line: Number(m[2]),
  }));

export default {
  skill: "spine-context",
  checks: [
    changedNothing,
    check("records at least five numbered facts", (c) => c.ids("CX").size >= 5),
    check("cites at least five file locations", (c) => citations(c).length >= 5),
    check("every cited file and line exists", (c) =>
      citations(c).length > 0 &&
      citations(c).every(({ path, line }) => c.exists(path) && line >= 1 && line <= c.read(path).split("\n").length),
    ),
    check("ran the tests and recorded the command", (c) => c.has(/node --test|npm (run )?test/)),
    check("found the authorization seam the work needs", (c) => c.has(/canViewOrder|auth\.js/)),
    check("found where orders are stored", (c) => c.has(/src\/orders\.js/) && c.has(/in[- ]memory|Map\b/i)),
    check("separates inferences from facts", (c) => c.section(/inference/i).trim().length > 0),
    check("says what was not surveyed", (c) => c.section(/not surveyed/i).trim().length > 0),
  ],
};
