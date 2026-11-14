**Stopped before publishing:** the diff contains a hardcoded token
(`SUPPORT_API_TOKEN`, `src/orders.js:5`) that is also written to the log. It
must be removed and rotated before this branch is pushed. The description
below is for after that is fixed.

# Look up an order by id

> **Branch:** feature/order-lookup -> main at `HEAD`
> **Requirements:** agreed in conversation 2026-11-10

## Summary
Adds `getOrder(user, id)`. It is not ready to merge: R-3 is missing and one existing test fails. Start with `src/orders.js`.

## Traceability
| Req | Task | Commit | Test criteria | Evidence |
|---|---|---|---|---|
| R-1 | none | `0000000` (SL-1) | TC-U1 | `node --test`: pass |
| R-2 | none | `0000000` (SL-1) | TC-U2 | `node --test`: pass |
| R-3 | none | none | TC-U3 | **Not delivered:** no authorization check and no test |

Plumbing commits: none

## Test evidence
- **Report:** inline, for the head commit
- **Verdict:** Not proven
- **Full suite:** `node --test`: 13 tests, 11 passed, 1 failed, 1 skipped

## Review
- **Review:** not reviewed
- **Conformance:** not run
- **Accepted findings:** none

## Security impact
Touches authorization (order data is returned without an ownership check), secrets (a token literal is committed), and personal data (the user's email is logged). None of these is resolved.

## Risk and rollback
- **Risk:** any user can read any order; confirmations stop because status changed to "new"
- **Rollback:** revert the commit; no data is written, so nothing to migrate

## Open items
- failing test "a new order gets a confirmation" (`test/notify.test.js`) | owner: author
- R-3 not implemented, TC-U3 untested | owner: author
- unrequested `listOrders` contradicts NG-1 | owner: author
- skipped test "a new order has status created" | owner: author
- not reviewed | owner: reviewer to be assigned
