"use strict";

// "12.34" -> 1234, "-0.5" -> -50. Bank exports never use more than two decimals.
function parseAmount(text) {
  const [whole, frac = ""] = text.trim().split(".");
  const sign = whole.startsWith("-") ? -1 : 1;
  return sign * (Math.abs(Number(whole)) * 100 + Number(frac.padEnd(2, "0").slice(0, 2)));
}

// Parses a bank export with the header "date,account,amount,memo".
// Contract: throws on an unexpected header or a malformed date, naming the line.
function parseCsv(text) {
  const [header, ...rows] = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (header.trim() !== "date,account,amount,memo") throw new Error(`Unexpected header: ${header}`);
  return rows.map((line, i) => {
    const [date, account, amount, ...memo] = line.split(",");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Line ${i + 2}: bad date "${date}"`);
    return { date, account, amountCents: parseAmount(amount), memo: memo.join(",") };
  });
}

module.exports = { parseAmount, parseCsv };
