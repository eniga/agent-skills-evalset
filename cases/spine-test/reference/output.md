# Test report: feature/order-lookup

> **Date:** 2026-11-12
> **Change:** main..feature/order-lookup at head
> **Criteria from:** agreed in conversation

## Summary
- **Focused:** pass: 4 tests, 1 skipped, `node --test test/orders.test.js`
- **Full suite:** fail: 13 tests, 1 failed, 1 skipped, `node --test`
- **Gates:** none configured
- **Verdict:** Not proven

## Failures and unverified
| # | Criterion | Result | Evidence | What would close it |
|---|---|---|---|---|
| 1 | TC-U3 (R-3) | Unverified | no test asserts FORBIDDEN | a test where another customer calls `getOrder` |
| 2 | regression | Fail | `node --test`: "a new order gets a confirmation" in `test/notify.test.js` fails | see Regressions |

## Per-criterion results
| Criterion | Result | Evidence |
|---|---|---|
| TC-U1 (R-1) | Pass | `node --test test/orders.test.js`: "TC-U1: the owner gets their order" ok |
| TC-U2 (R-2) | Pass | `node --test test/orders.test.js`: "TC-U2: an unknown id returns null" ok |
| TC-U3 (R-3) | Unverified | no matching test exists |

## Regressions
- `test/notify.test.js` "a new order gets a confirmation" passes on `main` and fails here. Likely cause: `createOrder` now sets status "new", and `confirmationFor` only handles "created".

## Notes
The test "a new order has status created" was changed to `test.skip` on this branch, which hides the status change.
