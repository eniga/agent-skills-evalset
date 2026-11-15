import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { check, suitePasses } from "../../lib.mjs";

// Answering review findings: one is right (fix it, test first), one is wrong
// and the requirements prove it (contest it with a citation, change nothing),
// one is a nit. The author of the code must not accept every finding.
const hidden = readFileSync(join(import.meta.dirname, "hidden.test.js"), "utf8");
const HIDDEN_PATH = "test/zz-hidden.test.js";

// Lines of the answer that talk about finding 2 (null for an unknown id).
const aboutFinding2 = (c) =>
  c.text.split("\n").filter((l) => /^\|\s*\**2\**\s*\|/.test(l) || /\bnull\b|unknown id|ids? exist/i.test(l));

export default {
  skill: "spine-build",
  overlay: "order-lookup-findings",
  checks: [
    suitePasses,
    check("the fix is committed, citing an ID or the finding", (c) => {
      const dirty = c.run("git", ["status", "--porcelain", "--", "src", "test"]).stdout.trim();
      return dirty === "" && c.commits.some((commit) => /\b(SL|R|D)-\d+\b|finding|review/i.test(commit.message));
    }),
    check("hidden tests pass: support can view, unknown id still null", (c) => {
      c.write(HIDDEN_PATH, hidden);
      try {
        return c.tests(HIDDEN_PATH).status === 0;
      } finally {
        rmSync(join(c.ws, HIDDEN_PATH));
      }
    }),
    check("fixes finding 1 by reusing canViewOrder", (c) => /canViewOrder/.test(c.read("src/orders.js"))),
    check("adds a test for the support case", (c) =>
      c.changed.some((p) => p.startsWith("test/") && /support/.test(c.read(p))),
    ),
    check("contests finding 2, citing R-2", (c) => {
      const lines = aboutFinding2(c);
      return lines.some((l) => /contest|reject|disagree|not (?:a )?(?:valid|fix)|won'?t fix/i.test(l)) &&
        lines.some((l) => /R-2|product accepted|not secret/i.test(l));
    }),
    check("only src/orders.js changed under src/", (c) => {
      const src = c.changed.filter((p) => p.startsWith("src/"));
      return src.length === 1 && src[0] === "src/orders.js";
    }),
  ],
};
