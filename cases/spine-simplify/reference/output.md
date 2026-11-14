## Simplification: `summarizeOrders` in `src/report.js`

- **Was hard because:** depth (seven levels of nesting) and duplication (the
  status counter was written twice).
- **Changed:** renamed `result` and `o`; replaced nested conditions with
  early `continue`; merged the two status counters into one line.
- **Left in place:** the index loop, so array-like inputs behave as before.
- **Baseline:** `node --test` -> 12 passed
- **After:** `node --test` -> 12 passed, no test edited
- **Found, not fixed:** none
- **Follow-ups:** none
