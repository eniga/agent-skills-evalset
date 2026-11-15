const { test } = require("node:test");
const assert = require("node:assert/strict");
const { balances } = require("../src/balance");

const tx = [
  { date: "2026-01-05", account: "checking", amountCents: 10000 },
  { date: "2026-01-20", account: "checking", amountCents: -2500 },
  { date: "2026-01-20", account: "savings", amountCents: 4000 },
  { date: "2026-02-03", account: "checking", amountCents: -999 },
];

test("totals each account", () => {
  assert.deepEqual(balances(tx), { checking: 6501, savings: 4000 });
});

test("ignores transactions before the range", () => {
  assert.deepEqual(balances(tx, { from: "2026-01-10" }), { checking: -3499, savings: 4000 });
});

test("ignores transactions after the range", () => {
  assert.deepEqual(balances(tx, { from: "2026-01-01", to: "2026-01-31" }), { checking: 7500, savings: 4000 });
});
