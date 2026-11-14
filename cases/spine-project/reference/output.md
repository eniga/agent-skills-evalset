# tinyshop: summary

tinyshop is a small order service the storefront uses as a library. It prices
a cart, applies the shipping rule, and creates orders.

- For: the storefront
- Does: cart subtotal, shipping quote, order creation, confirmations, order summary
- Built with: JavaScript ES modules, no dependencies (`package.json`)
- Run: library, nothing to start | Test: `npm test`
- State / next: working library; orders are in memory only

A cart is merged and priced in `src/cart.js`, shipping comes from
`src/shipping.js`, and `src/orders.js` stores the order in a Map.

Sources: none; derived from code. No documentation set exists beyond `README.md`.
Disagreements: none found.
