import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { check, suitePasses } from "../../lib.mjs";

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
    check("hidden acceptance tests pass", (c) => {
      c.write(HIDDEN_PATH, hidden);
      try {
        return c.tests(HIDDEN_PATH).status === 0;
      } finally {
        rmSync(join(c.ws, HIDDEN_PATH));
      }
    }),
    check("tests for the new behavior were added", (c) =>
      c.changed.some((p) => p.startsWith("test/") && /shippingCents/.test(c.read(p))),
    ),
    check("only src/orders.js changed under src/", (c) => {
      const src = c.changed.filter((p) => p.startsWith("src/"));
      return src.length === 1 && src[0] === "src/orders.js";
    }),
    check("reuses the existing shipping rule instead of copying it", (c) => {
      const code = c.read("src/orders.js");
      return /shippingFor/.test(code) && !/\b(499|5000)\b/.test(code);
    }),
    check("source diff is 20 lines or fewer", (c) => {
      const numstat = c.run("git", ["diff", "--numstat", c.startSha, "--", "src"]).stdout;
      const total = numstat
        .split("\n")
        .filter(Boolean)
        .reduce((sum, line) => sum + Number(line.split("\t")[0]) + Number(line.split("\t")[1]), 0);
      return total > 0 && total <= 20;
    }),
    check("no dependency or config change", (c) => !c.changed.includes("package.json")),
  ],
};
