import { check } from "../../lib.mjs";

const SPEC = ".specs/reorder/spec.md";
const defined = (spec, kind) => new Set([...spec.matchAll(new RegExp(`\\*\\*(${kind}-[A-Z]?\\d+)\\*\\*`, "g"))].map((m) => m[1]));

export default {
  skill: "spine-spec",
  checks: [
    check("writes the spec where it was asked to", (c) => c.exists(SPEC)),
    check("changes nothing but spec files", (c) => c.onlyChanged(/^\.specs\//)),
    check("has all twelve numbered sections", (c) =>
      Array.from({ length: 12 }, (_, i) => i + 1).every((n) => new RegExp(`^## ${n}\\. `, "m").test(c.read(SPEC))),
    ),
    // "Go ahead" came before the spec existed, so it approves nothing.
    check("stays Draft: does not approve its own spec", (c) =>
      /^draft/i.test(c.field("Status", c.read(SPEC))) &&
      /^(pending|none|n\/a|tbd|<|-|—|\||$)/i.test(c.field("Approved by", c.read(SPEC))),
    ),
    check("every requirement is proven by a test criterion", (c) => {
      const spec = c.read(SPEC);
      const reqs = [...defined(spec, "R")];
      return reqs.length >= 3 && reqs.every((r) => new RegExp(`proves[^)\\n]*\\b${r}\\b`).test(spec));
    }),
    check("every acceptance criterion is served by a requirement", (c) =>
      ["AC-1", "AC-2", "AC-3"].every((ac) => new RegExp(`from[^)\\n]*\\b${ac}\\b`).test(c.read(SPEC))),
    ),
    check("carries the non-goal into non-scope", (c) => /NG-1/.test(c.read(SPEC))),
    check("security section covers access to other customers' orders", (c) =>
      /canViewOrder|authori[sz]|owner|another customer/i.test(c.section(/^## 8\. /)),
    ),
    check("rollback names what happens to data", (c) => /data/i.test(c.section(/^## 11\. /))),
    check("extends existing contracts instead of breaking them", (c) => c.has(/createOrder/)),
  ],
};
