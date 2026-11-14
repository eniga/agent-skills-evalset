import { changedNothing, check } from "../../lib.mjs";

export default {
  skill: "spine-story",
  checks: [
    changedNothing, // this project keeps no spec files, so none may be created
    check("has at least two acceptance criteria", (c) => c.ids("AC").size >= 2),
    check("criteria are Given/When/Then", (c) =>
      [/\bGiven\b/g, /\bWhen\b/g, /\bThen\b/g].every((re) => c.count(re) >= 2),
    ),
    check("covers a failure or misuse path", (c) =>
      c.has(/unavailable|no longer|discontinued|out of stock|not (the )?owner|another (customer|user)|someone else|denied|forbidden|not found|cannot|is not (allowed|permitted)/i),
    ),
    check("has at least one non-goal", (c) => c.ids("NG").size >= 1),
    check("status is Draft", (c) => /^draft/i.test(c.field("Status"))),
    check("lists open questions", (c) => c.section(/open questions/i).trim().length > 0),
    check("keeps implementation out of the story", (c) =>
      // Only the story body: from "## User story" up to Open questions or
      // Context. Questions asked before the story may cite code.
      !/src\/|\.js\b|endpoint|database|table/i.test(
        c.text.split(/^## User story/im).slice(1).join("\n").split(/^## (Open questions|Context)/im)[0],
      ),
    ),
  ],
};
