# Plan: order lookup and history

> **Slug:** order-lookup | **Date:** 2026-11-12
> **Requirements:** confirmed in conversation 2026-11-10

## Impact
| Requirement | Lands in | Reused | Modified | New | Contract change? |
|---|---|---|---|---|---|
| R-1, R-2, R-3 | `src/orders.js` | `canViewOrder` (`src/auth.js`) | `src/orders.js` | none | no: `getOrder` is added |
| R-4 | `src/orders.js` | the `orders` Map | `src/orders.js` | none | no: `orderHistory` is added |

## Slices

### SL-1: look up one order
- **Delivers:** R-1, R-2, R-3
- **Touches:** `src/orders.js`, `test/orders.test.js`
- **After:** none | **Parallel with:** none
- **Checkpoint:**
  - Tests: TC-U1, TC-U2, TC-U3 with `node --test test/orders.test.js`
  - Regression: `npm test`
  - Gates: none configured
  - Manual: none

### SL-2: order history
- **Delivers:** R-4
- **Touches:** `src/orders.js`, `test/orders.test.js`
- **After:** SL-1 (same files) | **Parallel with:** none
- **Checkpoint:**
  - Tests: TC-U4 with `node --test test/orders.test.js`
  - Regression: `npm test`
  - Gates: none configured
  - Manual: none

## Risk and rollback
| Slice | Risk introduced | Rollback at this point |
|---|---|---|
| SL-1 | exposes order data; authorization must hold | revert the commit; no data written |
| SL-2 | returns several orders; must filter by owner | revert the commit; no data written |

## Start
Start with **SL-1**: it adds `getOrder` beside `createOrder` and changes no existing behavior.
