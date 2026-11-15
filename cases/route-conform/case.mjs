import { notRoutedTo, routedTo } from "../../lib.mjs";

// Routing: every skill is installed and none is named. The agent must pick
// from the descriptions alone.
export default {
  skill: "spine-conform",
  route: true,
  overlay: "order-lookup",
  checks: [
    routedTo("spine-conform"),
    notRoutedTo("spine-test"),
  ],
};
