The order-lookup change on this branch (`feature/order-lookup-findings`) came
back from review. Deal with the findings below.

Requirements, confirmed by the product owner on 2026-11-10:

- R-1: `getOrder(user, id)` returns the order when `user` may view it.
- R-2: `getOrder` returns `null` when no order has that id. (Product accepted
  that this reveals whether an id exists; order ids are not secret.)
- R-3: `getOrder` throws an error with code `FORBIDDEN` when `user` may not
  view the order, using the existing `canViewOrder` rule.

Test criteria:

- TC-U1 (proves R-1): the owner gets their order back.
- TC-U2 (proves R-2): an unknown id returns `null`.
- TC-U3 (proves R-3): another customer gets a `FORBIDDEN` error.

Review findings:

| # | Severity | Location | Finding |
|---|---|---|---|
| 1 | Blocker | `src/orders.js:29` | Support staff get `FORBIDDEN` for any order they do not own. The check compares owners instead of using `canViewOrder`. |
| 2 | Major | `src/orders.js:28` | Returning `null` for an unknown id tells a caller which ids exist. Throw `FORBIDDEN` for unknown ids too. |
| 3 | Nit | `src/orders.js:27` | Rename `order` to `found`. |

The slug is `order-lookup`. Commit your work.
