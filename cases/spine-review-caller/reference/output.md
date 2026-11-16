# Review: feature/shipping-intl

> **Date:** 2026-11-16
> **Change:** main..feature/shipping-intl at head
> **Requirements:** agreed in conversation
> **Reviewer:** fresh context
> **Round:** 1
> **Load assumed:** a library used by one storefront, from `README.md`

## Verdict
**Request changes**
`shippingFor` now takes an object, but `src/quote.js:8` still passes a number, so storefront quotes never show free shipping.

## What the diff does
Adds a flat international fee and changes `shippingFor` to take `{ subtotalCents, country }`. Matches the stated intent, but breaks an untouched caller.

## Findings
| # | Severity | ID | Location | Finding | Evidence | Suggested fix | If skipped |
|---|---|---|---|---|---|---|---|
| 1 | Blocker | R-2 | `src/quote.js:8` | The quote passes a number to `shippingFor`, so `subtotalCents` is undefined | a cart with subtotal 10000 is quoted 499 shipping instead of 0 | `shippingFor({ subtotalCents })` | customers over $50 see a shipping charge at checkout |

## Unnecessary change
- none

## Proof
- Changed behavior and failure paths tested: yes for `shippingFor`; no quote test above the threshold
- Assertions weakened or skipped: none
- Evidence covers latest commit: yes
- Still Fail or Unverified: none
