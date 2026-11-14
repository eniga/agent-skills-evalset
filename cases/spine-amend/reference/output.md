### AM-1: Only the owner may view an order; unknown ids are an error

> **Date:** 2026-11-12
> **Type:** Contract change
> **Trigger:** Legal decision LEGAL-88: support staff must not see customer orders; customers must be told when an id does not exist
> **Approved by:** PENDING

**Requirements**
| ID | Change | Before | After |
|---|---|---|---|
| R-2 | Changed | `getOrder` returns `null` when no order has that id | `getOrder` throws an error with code `NOT_FOUND` when no order has that id |
| R-3 | Changed | throws `FORBIDDEN` when the user may not view the order, using `canViewOrder` | throws `FORBIDDEN` unless the user owns the order; support staff are refused |

**Test criteria**
| ID | Change | Note |
|---|---|---|
| TC-U2 | Changed | now expects a `NOT_FOUND` error instead of `null` |
| TC-U3 | Changed | now also expects `FORBIDDEN` for a support user |

**Contracts affected:** `getOrder` return type no longer includes `null`; every caller that checks for `null` breaks. `canViewOrder` in `src/auth.js` allows support staff and can no longer be the rule for R-3; other users of it must be reviewed.

**Invalidated**
| Artifact | What is now wrong | Action |
|---|---|---|
| SL-1 (`a1b2c3d`) | implements old R-2 and R-3 | rebuild |
| test for TC-U2 | asserts `null`; passes and is wrong | rewrite from new TC-U2 |
| test for TC-U3 | does not cover support staff | extend from new TC-U3 |
| earlier test evidence | gathered on old criteria | re-verify |
| T-2 | estimate too low by ~1 point | re-point |

**Not checked:** callers outside this repository.

Current requirements after AM-1, pending approval: R-1 unchanged; R-2 and R-3 as above; NG-1 unchanged.
