# Conformance: feature/order-lookup

> **Date:** 2026-11-12
> **Diff:** main..feature/order-lookup at head
> **Measured against:** agreed in conversation 2026-11-10
> **Scope:** all requirements
> **Reviewer:** fresh context

## Verdict
**Non-conformant**
R-3 is not implemented, non-goal NG-1 was built, and an existing contract was changed without a requirement.

## Matrix
| Req | State | Location | Notes |
|---|---|---|---|
| R-1 | Implemented | `src/orders.js:27-32` | returns the stored order |
| R-2 | Implemented | `src/orders.js:30` | returns null for an unknown id |
| R-3 | Not implemented | n/a | no call to `canViewOrder`, no FORBIDDEN error |

## Contracts
- Interfaces: mismatch: `createOrder` now returns status "new"; the agreed contract is unchanged "created"
- Data: match

## Test criteria
| TC | Matching test | Notes |
|---|---|---|
| TC-U1 | `test/orders.test.js:27` | matches |
| TC-U2 | `test/orders.test.js:32` | matches |
| TC-U3 | missing | no test for FORBIDDEN |

## Unrequested behavior
- `src/orders.js:34-36`: unspecified: `listOrders` lists every order, which NG-1 excludes
- `src/orders.js:17`: unspecified: status renamed to "new"
- `src/orders.js:5,28`: unspecified: a token constant and a log line

## Comments
| # | Maps to | Location | Comment | Conformance requires |
|---|---|---|---|---|
| 1 | R-3 | `src/orders.js:27` | any user gets any order | check `canViewOrder`, throw FORBIDDEN |
| 2 | NG-1 | `src/orders.js:34` | listing was excluded | remove `listOrders` |
| 3 | TC-U3 | `test/orders.test.js` | no test | add the test as worded |

## Notes
Quality: a hardcoded token and a skipped test, for the quality review.
