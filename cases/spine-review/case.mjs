import { changedNothing, check } from "../../lib.mjs";

export default {
  skill: "spine-review",
  overlay: "order-lookup",
  checks: [
    changedNothing, // a review reports; it does not edit
    check("verdict is Request changes", (c) => /^request changes/i.test(c.field("Verdict"))),
    check("has a Blocker", (c) => c.has(/blocker/i)),
    check("finds the missing authorization check (R-3)", (c) =>
      c.has(/canViewOrder|authori[sz]|FORBIDDEN|any (user|customer)|other (users'|customers')/i) && c.has(/R-3/),
    ),
    check("finds the broken createOrder contract (status)", (c) =>
      c.has(/status/i) && c.has(/"?created"?/) && c.has(/notify|confirmation|contract|caller/i),
    ),
    check("finds the hardcoded token", (c) => c.has(/token|secret|credential/i)),
    check("finds the personal data and token written to the log", (c) => c.has(/console\.log|logs?\b|logged/i) && c.has(/email|personal|PII|token/i)),
    check("finds the skipped test", (c) => c.has(/skip/i)),
    check("finds the unrequested listOrders (NG-1)", (c) => c.has(/listOrders/) && c.has(/NG-1|non-goal|unrequested|not requested|scope/i)),
    check("cites file locations", (c) => c.count(/src\/orders\.js(:\d+)?/g) >= 2),
  ],
};
