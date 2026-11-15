# Review: feature/order-lookup-round2

> **Date:** 2026-11-15
> **Change:** main..feature/order-lookup-round2 at head
> **Requirements:** agreed in conversation
> **Reviewer:** fresh context
> **Round:** 2, after the round 1 review in the task

## Verdict
**Request changes**
Finding 1 is still open: the fix lets `admin` through, but `canViewOrder` grants `support` (`src/auth.js:3`).

## What the diff does
Adds `getOrder`, returning `null` for unknown ids and throwing `FORBIDDEN` unless the user owns the order or is an admin. It does not match R-3, which names `canViewOrder`.

## Earlier findings
| # | Was | Now | Evidence |
|---|---|---|---|
| 1 | Blocker: support staff denied | reopened | `src/orders.js:29` checks `role !== "admin"`; `canViewOrder` is not used |
| 2 | Major: null reveals ids | settled | contested with R-2, accepted |
| 3 | Minor: no TC-U3 test | fixed | `test/orders.test.js:34` |

## Findings
| # | Severity | ID | Location | Finding | Evidence | Suggested fix |
|---|---|---|---|---|---|---|
| 1 | Blocker | R-3 | `src/orders.js:29` | Support staff still get FORBIDDEN; admins get access `canViewOrder` does not grant | `src/auth.js:3` | Call `canViewOrder(user, order)` |

## Unnecessary change
- none

## Proof
- Changed behavior and failure paths tested: no test for staff access
- Assertions weakened or skipped: none
- Evidence covers latest commit: yes
- Still Fail or Unverified: none
