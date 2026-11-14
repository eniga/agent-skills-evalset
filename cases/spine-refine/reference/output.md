# Spec sketch: Reorder

> **Slug:** reorder | **Story:** S-1 | **Date:** 2026-11-12
> **Status:** Head start for the spec (not a spec)

## Lands in
- `src/orders.js`: reuse `createOrder`; add a reorder function beside it
- `src/auth.js`: reuse `canViewOrder` for AC-3
- `src/catalog.js`: reuse `priceOf`, which already rejects unknown products

## Proposed requirements
- **R-1 (confirmed):** reordering an owned order creates a new order with the same items at today's prices
- **R-2 (confirmed):** if any product is no longer sold, no order is created and the product is named
- **R-3 (confirmed):** reordering another customer's order is denied
- **R-4 (assumed):** support staff cannot reorder on a customer's behalf

## Proposed interfaces
- `reorder(user, orderId)` returning a new order; error shapes unknown

## Data questions
- Orders are in memory only; a past order must exist in the same process

## Risks
| # | Risk | Mitigation |
|---|---|---|
| 1 | Order ids can be guessed, exposing other customers' orders | deny through `canViewOrder` before reading |
| 2 | No way to read an order back today | build lookup first |
| 3 | Prices changed since the original order | state "today's prices" in the confirmation |

## Open questions
- Should support staff be able to reorder? | recommended: no

# Tasks: Reorder

> **Slug:** reorder | **Story:** S-1 | **Total points:** 5

| ID | Task | Maps to | Points | Rationale | Depends on |
|---|---|---|---|---|---|
| T-1 | A customer can reorder their own order | AC-1, R-1 | 2 | two files, needs a lookup that does not exist yet | None |
| T-2 | Reorder is refused when a product is no longer sold | AC-2, R-2 | 1 | `priceOf` already throws; map the error | T-1 |
| T-3 | Reordering another customer's order is denied | AC-3, R-3 | 2 | `canViewOrder` is untested; support role is an open question | T-1 |

## Notes
- No cut needed.
