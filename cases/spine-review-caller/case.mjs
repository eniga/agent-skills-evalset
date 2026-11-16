import { changedNothing, check } from "../../lib.mjs";

// The diff is correct on its own and every test passes. It changes
// shippingFor to take an object, and src/quote.js, which the diff does not
// touch and no test exercises above the threshold, still passes a number:
// quotes never show free shipping again. Only a review that reads the
// callers of a changed function finds it.
const seriousRows = (c) =>
  c.text.split("\n").filter((l) => /^\|[^|]*\|\s*\**\s*(blocker|major)\b/i.test(l));

export default {
  skill: "spine-review",
  overlay: "shipping-intl",
  checks: [
    changedNothing,
    check("verdict is Request changes", (c) => /^request changes/i.test(c.field("Verdict"))),
    check("finds the broken untouched caller in quote.js", (c) =>
      seriousRows(c).some((l) => /quote/i.test(l)),
    ),
    check("explains the effect: free shipping lost in quotes", (c) =>
      c.has(/free shipping|threshold|5000|\$50|499/i) && c.has(/quote/i),
    ),
    check("names a concrete case", (c) => c.has(/(subtotal|cart|order)[^\n]{0,60}(5000|\$50|\$100|10000|over|above)/i)),
  ],
};
