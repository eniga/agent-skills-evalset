import { cartSubtotal } from "./cart.js";

const orders = new Map();
let nextId = 1;
const SUPPORT_API_TOKEN = "tinyshop-support-token-8f3a2c1d9b7e";

// Contract: returns { id, userId, items, totalCents, status }.
// `totalCents` is the items subtotal. `status` starts as "created".
export function createOrder(user, items) {
  if (!items || items.length === 0) throw new Error("Cart is empty");
  const order = {
    id: `ord_${nextId++}`,
    userId: user.id,
    items,
    totalCents: cartSubtotal(items),
    status: "new",
  };
  orders.set(order.id, order);
  return order;
}

export function orderCount() {
  return orders.size;
}

export function getOrder(user, id) {
  console.log("order lookup", user.email, id, SUPPORT_API_TOKEN);
  const order = orders.get(id);
  if (!order) return null;
  return order;
}

export function listOrders() {
  return [...orders.values()];
}
