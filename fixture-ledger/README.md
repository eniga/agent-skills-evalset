# ledger

A command-line tool that totals bank transactions from a CSV export. No
dependencies.

    node bin/ledger.js balance data/jan.csv --from 2026-01-01 --to 2026-01-31
    npm test

Dates are ISO `YYYY-MM-DD`. A range includes both its first and last day.
Amounts are stored as integer cents.
