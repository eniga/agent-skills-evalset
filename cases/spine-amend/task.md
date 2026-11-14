The requirements below were agreed, and slice SL-1 (commit `a1b2c3d`) already
implements R-1, R-2, and R-3 with tests for TC-U1, TC-U2, and TC-U3. Task T-2
(2 points) covered R-3. That work is on a branch that is not in this
checkout; take this description as the record of it.

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

Legal has now decided, in ticket LEGAL-88, that support staff must no longer
see customer orders: only the owner may view an order. Customers must also be
told when an order id does not exist, instead of getting `null`. Amend the
requirements.
