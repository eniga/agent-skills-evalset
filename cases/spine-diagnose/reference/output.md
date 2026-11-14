# D-1: cart total is too low when a product appears on two lines

> **Date:** 2026-11-12
> **Severity:** major
> **Status:** cause proven
> **Violates:** none covered it (no test used duplicate lines)

## Gap
- **Expected:** A-100 × 1 plus A-100 × 2 totals 3000 cents.
- **Actual:** `cartSubtotal` returns 2000.
- **Conditions:** any cart with the same SKU on more than one line.
- **Rate:** always

## Reproduction
    node --test test/cart-duplicates.test.js
    not ok 1 - two lines of the same product are added together # TODO D-1
    expected 3000, actual 2000

Failing test: `test/cart-duplicates.test.js`, marked `todo` citing D-1.

## Hypotheses
| # | Hypothesis | Check | Result |
|---|---|---|---|
| 1 | `priceOf` returns the wrong price for A-100 | `priceOf("A-100")` must not be 1000 | Eliminated: it returns 1000 |
| 2 | `mergeLines` loses a quantity | merging the two lines must not give qty 3 | Confirmed: it gives qty 2 |

## Cause
`mergeLines` in `src/cart.js:7` assigns `bySku[item.sku] = item.qty`, so a
second line for the same SKU overwrites the first quantity instead of adding
to it.
- **Explains:** the total equals the last line only; carts with distinct SKUs
  are unaffected.
- **Demonstration:** adding the quantities in a scratch copy made the test
  pass; the experiment was reverted.

## Classification
Code defect, because merged lines are meant to keep the full quantity.

## Fix direction
Add to the existing quantity in `mergeLines`. Not applied here.
**Regression guard:** `test/cart-duplicates.test.js` fails before the fix and
passes after; remove the `todo` marker with the fix.

## Blast radius
`quote` and `createOrder` both call `cartSubtotal`, so quotes and order totals
are affected. Searched for `mergeLines` and `cartSubtotal`; no other callers.
