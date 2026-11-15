Show customers what they will pay.

Requirements, confirmed by the product owner today:

- R-1: The order confirmation shows the amount the customer pays: the items
  subtotal plus shipping, using the shop's existing shipping rule.

Test criteria:

- TC-U1 (proves R-1): the confirmation for an order of two Mugs (`A-100` × 2,
  a 2000-cent subtotal) reads `Order <id> received: $24.99`.

This is one slice, SL-1, with the slug `confirmation-total`. Commit your work.
