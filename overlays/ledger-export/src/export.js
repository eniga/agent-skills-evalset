"use strict";
const fs = require("node:fs");
const { inRange } = require("./range");

// One CSV line per transaction in the range, for the finance team's spreadsheet.
function toCsv(transactions, range) {
  const lines = ["date,account,amount,memo"];
  for (const t of transactions) {
    if (!inRange(t.date, range)) continue;
    lines.push([t.date, t.account, (t.amountCents / 100).toFixed(2), t.memo].join(","));
  }
  return lines.join("\n") + "\n";
}

function writeExport(path, transactions, range) {
  fs.writeFileSync(path, toCsv(transactions, range));
}

module.exports = { toCsv, writeExport };
