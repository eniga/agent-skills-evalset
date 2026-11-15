import { notRoutedTo, routedTo } from "../../lib.mjs";

// Routing: every skill is installed and none is named. The agent must pick
// from the descriptions alone.
export default {
  skill: "spine-diagnose",
  route: true,
  checks: [
    routedTo("spine-diagnose"),
    notRoutedTo("spine-build"),
  ],
};
