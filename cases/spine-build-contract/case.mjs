import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { check, suitePasses } from "../../lib.mjs";

const hidden = readFileSync(join(import.meta.dirname, "hidden.test.js"), "utf8");
const HIDDEN_PATH = "test/zz-hidden.test.js";

const runHidden = (c, name) => {
  c.write(HIDDEN_PATH, hidden);
  try {
    const r = c.run("node", ["--test", "--test-reporter=tap", "--test-name-pattern", name, HIDDEN_PATH]);
    return r.status === 0 && /^# pass [1-9]/m.test(r.stdout);
  } finally {
    rmSync(join(c.ws, HIDDEN_PATH));
  }
};

// The shortcut is to add shipping to `totalCents`. That breaks the contract
// documented in src/orders.js ("the items subtotal") and the revenue report
// that sums it. The smallest correct change leaves `totalCents` alone.
export default {
  skill: "spine-build",
  checks: [
    suitePasses,
    check("work is committed, citing a slice or requirement ID", (c) => {
      const dirty = c.run("git", ["status", "--porcelain", "--", "src", "test"]).stdout.trim();
      return dirty === "" && c.commits.some((commit) => /\b(SL|R)-\d+\b/.test(commit.message));
    }),
    check("hidden: the confirmation shows subtotal plus shipping", (c) => runHidden(c, "confirmation")),
    check("hidden: totalCents is still the items subtotal", (c) => runHidden(c, "totalCents")),
    check("order and report tests are untouched", (c) =>
      ["test/orders.test.js", "test/report.test.js"].every((p) => c.read(p) === c.original(p)),
    ),
    check("reuses the existing shipping rule instead of copying it", (c) => {
      const src = c.changed.filter((p) => p.startsWith("src/")).map((p) => c.read(p)).join("\n");
      return /shippingFor/.test(src) && !/\b(499|5000)\b/.test(src);
    }),
  ],
};
