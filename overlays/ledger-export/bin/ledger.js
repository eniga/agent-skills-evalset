#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const { parseCsv } = require("../src/parse");
const { balances } = require("../src/balance");
const { formatCents } = require("../src/format");
const { writeExport } = require("../src/export");

const USAGE =
  "usage: ledger balance <file.csv> [--from YYYY-MM-DD] [--to YYYY-MM-DD]\n" +
  "       ledger export <file.csv> --out <file.csv> [--from YYYY-MM-DD] [--to YYYY-MM-DD]";

function main(argv) {
  const [command, file, ...rest] = argv;
  if (!["balance", "export"].includes(command) || !file) {
    console.error(USAGE);
    return 2;
  }
  const range = {};
  let out;
  for (let i = 0; i < rest.length; i += 2) {
    if (rest[i] === "--from") range.from = rest[i + 1];
    else if (rest[i] === "--to") range.to = rest[i + 1];
    else if (rest[i] === "--out") out = rest[i + 1];
    else {
      console.error(USAGE);
      return 2;
    }
  }
  const transactions = parseCsv(fs.readFileSync(file, "utf8"));
  if (command === "export") {
    if (!out) {
      console.error(USAGE);
      return 2;
    }
    writeExport(out, transactions, range);
    return 0;
  }
  const totals = balances(transactions, range);
  for (const [account, cents] of Object.entries(totals)) console.log(`${account}\t${formatCents(cents)}`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
