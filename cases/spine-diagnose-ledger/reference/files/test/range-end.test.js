const { test } = require("node:test");
const assert = require("node:assert/strict");
const { balances } = require("../src/balance");

test("D-1: a range includes its last day", { todo: "D-1" }, () => {
  const tx = [{ date: "2026-01-31", account: "checking", amountCents: -5000 }];
  assert.deepEqual(balances(tx, { from: "2026-01-01", to: "2026-01-31" }), { checking: -5000 });
});
