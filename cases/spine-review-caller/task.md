Review the change on this branch (`feature/shipping-intl`, against `main`)
before it merges.

Requirements, confirmed by the product owner on 2026-11-12:

- R-1: International orders (any country other than `US`) pay a flat
  1500-cent shipping fee.
- R-2: Domestic shipping is unchanged: free at or above 5000 cents, 499
  cents below it.

Test criteria:

- TC-U1 (proves R-1): a `DE` order pays 1500 at any subtotal.
- TC-U2 (proves R-2): domestic 4999 pays 499; domestic 5000 pays 0.
