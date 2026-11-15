const { test } = require("node:test");
const assert = require("node:assert/strict");
const { toCsv } = require("../src/export");

test("TC-U1: exports the transactions in the range", () => {
  const csv = toCsv(
    [
      { date: "2026-01-05", account: "checking", amountCents: -5000, memo: "Phone bill" },
      { date: "2026-02-03", account: "checking", amountCents: 100, memo: "Refund" },
    ],
    { from: "2026-01-01", to: "2026-01-31" },
  );
  assert.equal(csv, "date,account,amount,memo\n2026-01-05,checking,-50.00,Phone bill\n");
});
