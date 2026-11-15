#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const { parseCsv } = require("../src/parse");
const { balances } = require("../src/balance");
const { formatCents } = require("../src/format");

const USAGE = "usage: ledger balance <file.csv> [--from YYYY-MM-DD] [--to YYYY-MM-DD]";

function main(argv) {
  const [command, file, ...rest] = argv;
  if (command !== "balance" || !file) {
    console.error(USAGE);
    return 2;
  }
  const range = {};
  for (let i = 0; i < rest.length; i += 2) {
    if (rest[i] === "--from") range.from = rest[i + 1];
    else if (rest[i] === "--to") range.to = rest[i + 1];
    else {
      console.error(USAGE);
      return 2;
    }
  }
  const totals = balances(parseCsv(fs.readFileSync(file, "utf8")), range);
  for (const [account, cents] of Object.entries(totals)) console.log(`${account}\t${formatCents(cents)}`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
