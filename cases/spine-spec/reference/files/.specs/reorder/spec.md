# Spec: Reorder a previous order

> **Status:** Draft
> **Approved by:** pending | **Date:** 2026-11-12
> **Story:** S-1: Reorder a previous order in one step | **Slug:** reorder

## 1. Context
Customers rebuild carts by hand. Orders live in memory in `src/orders.js`. No CONSTRAINTS.md exists; the repository's `node --test` suite is the bar.

## 2. Scope
- Reorder an owned past order (R-1)
- Refuse when a product is no longer sold (R-2)
- Refuse another customer's order (R-3)

## 3. Non-scope
- **NG-1:** Editing quantities during reorder.

## 4. Interface contracts
### reorder(user, orderId)
- **Change:** new. `createOrder` is reused and its contract is unchanged.
- **Request:** `user: { id: string, role: string }`, `orderId: string`
- **Response:** an order, same shape `createOrder` returns
- **Errors:** `{ code: "FORBIDDEN" }`, `{ code: "NOT_FOUND" }`, `{ code: "UNAVAILABLE", sku: string }`
- **Authorization:** only the order's owner
- **Example:** `reorder(alice, "ord_1")` returns `{ id: "ord_9", userId: "u_alice", totalCents: 2000, status: "created" }`

## 5. Data contracts
None added. Orders stay in the existing in-memory Map. Order data is personal data: classification internal.

## 6. Behaviour
- **R-1** (from AC-1): reordering an owned order creates a new order with the same items at current prices.

## 7. Error and edge cases
- **R-2** (from AC-2): if any item is no longer sold, no order is created and the error names the SKU.
- **R-3** (from AC-3): if the user does not own the order, the call fails with FORBIDDEN and no order is created.
- **R-4** (derived): an unknown order id fails with NOT_FOUND.

## 8. Security and privacy
- **Trust boundaries:** `orderId` is untrusted; it is only used as a Map key.
- **Access:** ownership is checked before any order data is read back; support staff cannot reorder.
- **Data:** order contents are never logged.
- **Abuse cases:** guessing another customer's order id is prevented by R-3.

## 9. Test criteria
### Unit (TC-U)
- **TC-U1** (proves R-1): Alice orders 2 Mugs; reorder returns a new id with the same items and total 2000.
- **TC-U2** (proves R-2): a past order holds an unsold SKU; reorder throws UNAVAILABLE and the order count is unchanged.
- **TC-U3** (proves R-3): Bob reorders Alice's order; FORBIDDEN, order count unchanged.
- **TC-U4** (proves R-4): unknown id; NOT_FOUND.
### Integration (TC-I)
- none: the feature is one module.
### End to end (TC-E)
- none: no user interface in this repository.

## 10. Observability
- **Logs:** `order.reordered` at info with order ids only
- **Metrics:** none: the library has no metrics client
- **Alerts:** none

## 11. Rollback plan
- **Mechanism:** revert the release
- **Trigger:** reorder errors reported by the storefront
- **Data consequences:** orders created by reorder are ordinary orders and remain valid data after a revert
- **Steps:** 1. revert the commit 2. release

## 12. Open questions
- May support staff reorder for a customer? | owner: product | recommended: no
