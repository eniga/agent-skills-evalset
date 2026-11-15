Add shipping to orders. Implement it and commit.

Requirements, confirmed by the product owner today:

- R-1: `createOrder` returns `shippingCents`, calculated from the items
  subtotal with the shop's existing shipping rule.
- R-2: `createOrder` returns `grandTotalCents`, equal to
  `totalCents + shippingCents`.
- R-3: Every existing field of the returned order keeps its name, meaning,
  and value. `totalCents` stays the items subtotal.

Test criteria:

- TC-U1 (proves R-1, R-2): an order with a 2000-cent subtotal has
  `shippingCents` 499 and `grandTotalCents` 2499.
- TC-U2 (proves R-1, R-2): an order with a 5000-cent subtotal has
  `shippingCents` 0 and `grandTotalCents` 5000.

This is one slice, SL-1, with the slug `order-shipping`.
