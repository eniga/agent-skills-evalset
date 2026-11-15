# Test report: feature/order-lookup-clean

## Summary
- **Focused:** pass: 6 tests, `node --test test/orders.test.js`
- **Full suite:** pass: 14 tests, `node --test`
- **Gates:** none configured
- **Verdict:** Proven

## Per-criterion results
| Criterion | Result | Evidence |
|---|---|---|
| TC-U1 (R-1) | Pass | "TC-U1: the owner gets their order" ok |
| TC-U2 (R-2) | Pass | "TC-U2: an unknown id returns null" ok |
| TC-U3 (R-3) | Pass | "TC-U3: another customer gets a FORBIDDEN error" ok |
