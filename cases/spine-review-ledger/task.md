Review the change on this branch (`feature/ledger-export`, against `main`)
before it merges.

Requirements, confirmed by the finance lead on 2026-11-10:

- R-1: `ledger export <file.csv> --out <file.csv>` writes the transactions
  inside the date range, with the columns date, account, amount, memo. The
  finance team opens the file in a spreadsheet.
- R-2: Amounts are written as decimals with two places, for example `-50.00`.
- R-3: The export uses the same date range rule as `balance`.
- NG-1: No change to how `balance` reads or totals transactions.

Test criteria:

- TC-U1 (proves R-1, R-2, R-3): the transactions in the range are exported
  with two-decimal amounts.
- TC-U2 (proves R-1): a memo that contains a comma stays in the memo column.
