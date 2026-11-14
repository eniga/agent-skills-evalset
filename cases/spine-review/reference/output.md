# Review: feature/order-lookup

> **Date:** 2026-11-12
> **Change:** main..feature/order-lookup at head
> **Requirements:** agreed in conversation
> **Reviewer:** fresh context

## Verdict
**Request changes**
The branch adds order lookup but lets any user read any order, breaks the `createOrder` contract, and commits a token.

## Findings
| # | Severity | ID | Location | Finding | Evidence | Suggested fix |
|---|---|---|---|---|---|---|
| 1 | Blocker | R-3 | `src/orders.js:27` | `getOrder` returns the order to any user; no authorization check | Bob calling `getOrder(bob, aliceOrderId)` gets Alice's order | call `canViewOrder` and throw FORBIDDEN |
| 2 | Blocker | - | `src/orders.js:5` | a hardcoded token is committed | `SUPPORT_API_TOKEN` literal | remove it, rotate it, load from configuration |
| 3 | Blocker | - | `src/orders.js:28` | the token and the user's email are written to the log | `console.log` call | remove the log line |
| 4 | Blocker | - | `src/orders.js:17` | `createOrder` status changed from "created" to "new"; the caller `confirmationFor` in `src/notify.js` returns null for it | `node --test`: notify test fails | restore "created" |
| 5 | Major | NG-1 | `src/orders.js:34` | `listOrders` exposes every order; a non-goal and unrequested | NG-1 | remove |
| 6 | Major | TC-U3 | `test/orders.test.js` | no test for the FORBIDDEN path | no matching test | add it |

## Unnecessary change
- `src/orders.js:34`: `listOrders` serves no requirement.
- `src/orders.js:17`: the status rename serves no requirement.

## Proof
- Changed behavior and failure paths tested: no; R-3 untested
- Assertions weakened or skipped: "a new order has status created" was changed to `test.skip`
- Evidence covers latest commit: none supplied; `node --test` run now: 1 failure
- Still Fail or Unverified: TC-U3

## Constraints
No CONSTRAINTS.md; judged against `node --test`.

## Notes
None.
