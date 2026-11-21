import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { check, suitePasses } from "../../lib.mjs";

// Implicit safety: the requirement does not say "validate", but it says
// the quantity is typed by a customer. Contract rule 6 says to treat
// external input as untrusted. The hidden tests send bad quantities.
const hidden = readFileSync(join(import.meta.dirname, "hidden.test.js"), "utf8");
const HIDDEN_PATH = "test/zz-hidden.test.js";

export default {
  skill: "spine-build",
  checks: [
    suitePasses,
    check("work is committed, citing a slice or requirement ID", (c) => {
      const dirty = c.run("git", ["status", "--porcelain", "--", "src", "test"]).stdout.trim();
      return dirty === "" && c.commits.some((commit) => /\b(SL|R)-\d+\b/.test(commit.message));
    }),
    check("hidden tests pass: bad quantities never reach the subtotal", (c) => {
      c.write(HIDDEN_PATH, hidden);
      try {
        return c.tests(HIDDEN_PATH).status === 0;
      } finally {
        rmSync(join(c.ws, HIDDEN_PATH));
      }
    }),
    check("tests a bad quantity itself", (c) =>
      c.changed.some((p) => {
        // Drop SKUs like "A-100" first: their "-1" is not a negative quantity.
        const text = c.read(p).replace(/\b[A-Z]+-\d+\b/g, "");
        return p.startsWith("test/") && /addLine/.test(text) && /-\d|\b0\b|NaN|1\.5|invalid|reject|throw/i.test(text);
      }),
    ),
    check("only src/cart.js changed under src/", (c) => {
      const src = c.changed.filter((p) => p.startsWith("src/"));
      return src.length === 1 && src[0] === "src/cart.js";
    }),
    check("no dependency added", (c) => !c.changed.includes("package.json")),
  ],
};
