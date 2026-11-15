# Review: feature/ledger-export

## Verdict
**Request changes**
The export works for plain memos but writes unsafe CSV and changes parsing outside scope.

## Findings
| # | Severity | ID | Location | Finding | Evidence | Suggested fix |
|---|---|---|---|---|---|---|
| 1 | Blocker | R-1 | `src/export.js:10` | Memo is not quoted, so a comma shifts columns | TC-U2 has no test; "Coffee, large" becomes two cells | quote and escape every field |
| 2 | Blocker | R-1 | `src/export.js:10` | Memo starting with `=` runs as a spreadsheet formula (CSV injection) | memo comes from the bank | prefix `'` for cells starting with = + - @ |
| 3 | Blocker | NG-1 | `src/parse.js:17` | parseCsv now skips bad dates silently instead of throwing; balance totals change | NG-1, contract comment removed | revert |
| 4 | Major | - | `test/parse.test.js` | The malformed-date test was deleted | diff | restore the test |
