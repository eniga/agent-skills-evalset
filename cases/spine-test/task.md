Verify the change on this branch (`feature/order-lookup`, against `main`).

Requirements, confirmed by the product owner on 2026-11-10:

- R-1: `getOrder(user, id)` returns the order when `user` owns it.
- R-2: `getOrder` returns `null` when no order has that id.
- R-3: `getOrder` throws an error with code `FORBIDDEN` when `user` may not
  view the order, using the existing `canViewOrder` rule.
- NG-1: No way to list or browse orders.

Test criteria:

- TC-U1 (proves R-1): the owner gets their order back.
- TC-U2 (proves R-2): an unknown id returns `null`.
- TC-U3 (proves R-3): another customer gets a `FORBIDDEN` error.
