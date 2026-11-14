import { test } from "node:test";
import assert from "node:assert/strict";
import { formatCents } from "../src/money.js";

test("formats cents as dollars", () => {
  assert.equal(formatCents(1234), "$12.34");
  assert.equal(formatCents(5), "$0.05");
  assert.equal(formatCents(-250), "-$2.50");
});
