# Context map: tinyshop

> **Date:** 2026-11-12
> **Purpose:** add order lookup by id
> **Verified by running:** `node --test`: 12 passed, under 1 s

## Shape
- **Language / framework:** JavaScript ES modules, no dependencies (`package.json:5`)
- **Entry points:** none; it is a library. Orders start at `src/orders.js:8`
- **Build / test / run:** `npm test` runs `node --test` (`package.json:7`)
- **CI:** none found

## Facts
| ID | Fact | Evidence |
|---|---|---|
| CX-1 | Orders are held in an in-memory Map, keyed by id | `src/orders.js:3` |
| CX-2 | `createOrder` returns id, userId, items, totalCents, status | `src/orders.js:8` |
| CX-3 | A new order has status "created" | `src/orders.js:15` |
| CX-4 | Owner and support staff may view an order | `src/auth.js:2` |
| CX-5 | Confirmations depend on status "created" | `src/notify.js:5` |
| CX-6 | Nothing reads an order back by id today | `src/orders.js:21` |

## Traced path: create an order
1. `src/orders.js:8`: validates the cart
2. `src/cart.js:13`: computes the subtotal
3. `src/catalog.js:7`: looks up each price
4. `src/orders.js:17`: stores the order in the Map

## Data
| Store | Holds | Written by | Also read by |
|---|---|---|---|
| `orders` Map | every order | `src/orders.js:17` | `orderCount` only |

## Seams and trust boundaries
| Boundary | Set up in | Used in | Untrusted input? |
|---|---|---|---|
| Authorization | `src/auth.js:2` | not used anywhere yet | yes: user and order id |

## Conventions and reusable code
| Convention or helper | Example |
|---|---|
| `canViewOrder` should guard any order read | `src/auth.js:2` |
| Tests use node:test with strict assert | `test/orders.test.js:1` |

## Hazards
| # | Hazard | Consequence for work here | Evidence |
|---|---|---|---|
| 1 | `canViewOrder` has no test | a lookup built on it is unproven | no file under `test/` imports it |
| 2 | Orders are lost on restart | lookups fail after a restart | `src/orders.js:3` |

## Inferences (not verified)
| # | Inference | Why it seems true | What would confirm it |
|---|---|---|---|
| 1 | The storefront calls this as a library | README says so | reading the storefront repository |

## Not surveyed
`src/report.js` and `src/money.js`: not on the lookup path.
