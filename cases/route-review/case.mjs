import { notRoutedTo, routedTo } from "../../lib.mjs";

// Routing: every skill is installed and none is named. The agent must pick
// from the descriptions alone.
export default {
  skill: "spine-review",
  route: true,
  overlay: "order-lookup",
  checks: [
    routedTo("spine-review"),
    notRoutedTo("spine-pr", "spine-release"),
  ],
};
