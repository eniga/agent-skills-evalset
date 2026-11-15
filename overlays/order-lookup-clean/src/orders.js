import { cartSubtotal } from "./cart.js";
import { canViewOrder } from "./auth.js";

const orders = new Map();
let nextId = 1;

// Contract: returns { id, userId, items, totalCents, status }.
// `totalCents` is the items subtotal. `status` starts as "created".
export function createOrder(user, items) {
  if (!items || items.length === 0) throw new Error("Cart is empty");
  const order = {
    id: `ord_${nextId++}`,
    userId: user.id,
    items,
    totalCents: cartSubtotal(items),
    status: "created",
  };
  orders.set(order.id, order);
  return order;
}

export function orderCount() {
  return orders.size;
}

// Returns the order, null when no order has the id, or throws FORBIDDEN.
export function getOrder(user, id) {
  const order = orders.get(id);
  if (!order) return null;
  if (!canViewOrder(user, order)) {
    const error = new Error("Not allowed to view this order");
    error.code = "FORBIDDEN";
    throw error;
  }
  return order;
}
