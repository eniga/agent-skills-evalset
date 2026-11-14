import { changedNothing, check } from "../../lib.mjs";

const row = (c, id) => c.text.split("\n").find((line) => new RegExp(`^\\|\\s*${id}\\s*\\|`).test(line)) ?? "";

export default {
  skill: "spine-amend",
  checks: [
    changedNothing, // no spec files in this project: the record lives in the conversation
    check("writes an amendment record with an ID", (c) => c.ids("AM").size >= 1),
    check("classifies it as a scope or contract change", (c) => /scope change|contract change/i.test(c.field("Type"))),
    check("cites the trigger", (c) => c.has(/LEGAL-88/)),
    check("records R-2 and R-3 as changed, keeping their IDs", (c) =>
      /changed/i.test(row(c, "R-2")) && /changed/i.test(row(c, "R-3")),
    ),
    check("shows before and after for a changed requirement", (c) => row(c, "R-3").split("|").filter((cell) => cell.trim()).length >= 4),
    check("revisits the test criteria", (c) => /\|\s*TC-U[23]\s*\|/.test(c.text)),
    check("names the built slice and its tests as invalidated", (c) =>
      /SL-1/.test(c.section(/invalidated/i) || c.text.split(/invalidated/i)[1] || ""),
    ),
    check("names the affected contract and its consumers", (c) => c.has(/canViewOrder|auth\.js/)),
    check("does not approve its own amendment", (c) => /pending/i.test(c.field("Approved by"))),
  ],
};
