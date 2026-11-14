# Release: order lookup (main after merging feature/order-lookup)

> **Date:** 2026-11-12
> **Version / commits:** main at head
> **Requirements:** R-1, R-2 (R-3 not delivered)
> **Decision:** NO-GO
> **Decided by:** needs a named person; this is a recommendation

## Scope
`getOrder` and `listOrders` added; `createOrder` status changed to "new". No migration, flag, or configuration change.

## Checks
| ID | Check | Blocker | Result | Evidence |
|---|---|---|---|---|
| RL-1 | Test evidence current for the merge commit | yes | Fail | `node --test`: 1 failed (`test/notify.test.js`) |
| RL-2 | CI and security gates green on the shipped commit | yes | Fail | no CI; a token literal is in `src/orders.js:5` |
| RL-3 | Promised logs emit | yes | Fail | no observability plan; the only log line leaks an email and a token |
| RL-4 | Promised metrics report | yes | Fail | no metrics exist |
| RL-5 | Alerts: condition, threshold, route | yes | Fail | no alerts exist |
| RL-6 | Rollback rehearsed and timed | yes | Fail | never run; no staging environment |
| RL-7 | Data consequences of rollback known | yes | Pass | nothing is persisted |
| RL-8 | Watch plan with thresholds | yes | Fail | nothing to watch |

## Rollback
- **Mechanism:** deploy revert (proposed)
- **Rehearsed:** never
- **Trigger:** undefined
- **Data consequences:** none; orders are in memory
- **Cannot be undone:** order data already read by the wrong user

## Watch plan
Cannot be defined without a signal.

## Outcome
Not deployed.

## Conditions and follow-ups
To become a GO: fix the failing test and the missing authorization, remove and rotate the token, add an error log or metric for `getOrder`, and rehearse the revert once in any non-production environment.
