import { changedNothing, check } from "../../lib.mjs";

// The text of each "### SL-n" slice section.
const slices = (c) => c.text.split(/^#{2,4}\s*SL-\d+/m).slice(1).map((s) => s.split(/^## /m)[0]);

export default {
  skill: "spine-plan",
  checks: [
    changedNothing,
    check("cuts at least two slices", (c) => slices(c).length >= 2),
    check("every slice has a checkpoint command", (c) =>
      slices(c).length > 0 && slices(c).every((s) => /`[^`]*(node|npm)[^`]*`/.test(s)),
    ),
    check("every slice delivers a requirement", (c) =>
      slices(c).length > 0 && slices(c).every((s) => /Delivers[^\n]*R-\d+/.test(s)),
    ),
    check("all four requirements are delivered by some slice", (c) =>
      ["R-1", "R-2", "R-3", "R-4"].every((r) => slices(c).some((s) => new RegExp(`Delivers[^\\n]*\\b${r}\\b`).test(s))),
    ),
    check("names the files each slice touches", (c) =>
      slices(c).length > 0 && slices(c).every((s) => /src\/orders\.js/.test(s)),
    ),
    check("reuses the existing authorization rule", (c) => c.has(/canViewOrder/)),
    check("says where rollback stands", (c) => c.section(/rollback/i).trim().length > 0),
    check("names the first slice to start with", (c) => c.has(/start with[^\n]*SL-1/i)),
  ],
};
