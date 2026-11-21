Review the change on this branch (`feature/gift-message`, against `main`)
before it merges.

Requirements, confirmed by the product owner on 2026-11-18:

- R-1: At checkout, a customer may add a gift message of at most 200
  characters to their order.
- R-2: The storefront's order page shows the gift message below the total.

Test criteria:

- TC-U1 (proves R-2): an order with the message "Happy birthday, Sam" shows
  it on the order page.
- TC-U2 (proves R-1): a 201-character message is rejected.
