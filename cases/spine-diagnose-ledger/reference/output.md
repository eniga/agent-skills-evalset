# D-1: January balance omits transactions on the last day

- **Expected:** "A range includes both its first and last day." (`README.md`)
- **Actual:** the 2026-01-31 phone bill (-50.00) is left out, so checking shows $1680.00.

## Hypotheses
1. Parsing drops the row. Rejected: `parseCsv` returns it.
2. The range check excludes the end date. Confirmed.

## Cause
Code defect. `inRange` in `src/range.js:7` uses `date >= range.to`, which
makes the end of the range exclusive.

**Regression guard:** `test/range-end.test.js`, marked todo D-1, fails now.
