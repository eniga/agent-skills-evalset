"use strict";
const { inRange } = require("./range");

// Net movement per account for the transactions inside the range.
function balances(transactions, range) {
  const totals = {};
  for (const t of transactions) {
    if (!inRange(t.date, range)) continue;
    totals[t.account] = (totals[t.account] ?? 0) + t.amountCents;
  }
  return totals;
}

module.exports = { balances };
