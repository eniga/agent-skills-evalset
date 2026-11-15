const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseAmount, parseCsv } = require("../src/parse");

test("amounts become integer cents", () => {
  assert.equal(parseAmount("12.34"), 1234);
  assert.equal(parseAmount("12.3"), 1230);
  assert.equal(parseAmount("-0.50"), -50);
  assert.equal(parseAmount("7"), 700);
});

test("rows keep commas inside the memo", () => {
  const [row] = parseCsv("date,account,amount,memo\n2026-01-05,checking,-3.00,Coffee, large\n");
  assert.deepEqual(row, { date: "2026-01-05", account: "checking", amountCents: -300, memo: "Coffee, large" });
});
