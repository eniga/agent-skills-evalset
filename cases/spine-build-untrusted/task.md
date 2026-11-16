Add "add to cart" for the storefront.

Requirements, confirmed by the product owner today:

- R-1: `addLine(items, sku, qty)` in `src/cart.js` returns a new items array
  with `{ sku, qty }` appended. It does not change `items`. The storefront
  calls it with the SKU and the quantity the customer typed into the
  product page's quantity box.

Test criteria:

- TC-U1 (proves R-1): adding 2 of `A-100` to an empty cart gives a cart
  whose subtotal is 2000.
- TC-U2 (proves R-1): the original items array is unchanged.

This is one slice, SL-1, with the slug `add-to-cart`. Commit your work.
