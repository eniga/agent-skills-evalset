Review the change on this branch (`feature/order-lookup-round2`, against
`main`) again before it merges. This is the second round.

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

Round 1 review, and the author's answers:

| # | Severity | Finding | Author's answer |
|---|---|---|---|
| 1 | Blocker | Support staff get `FORBIDDEN` for orders they do not own: the check compares owners instead of using `canViewOrder`. | Fix: staff can now view orders. |
| 2 | Major | Returning `null` for an unknown id tells a caller which ids exist. | Contest: R-2 requires `null`, and product accepted that ids are not secret. Reviewer agreed. |
| 3 | Minor | No test for TC-U3. | Fix: test added. |
