import { check, routedNowhere } from "../../lib.mjs";

// Routing: every skill is installed and none is named. The agent must pick
// from the descriptions alone.
export default {
  skill: null,
  route: true,
  checks: [
    routedNowhere,
    check("answers $0.05", (c) => c.has(/\$0\.05/)),
  ],
};
