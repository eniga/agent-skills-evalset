import { cartSubtotal } from "./cart.js";
import { shippingFor } from "./shipping.js";

const orders = new Map();
let nextId = 1;

// Contract: returns { id, userId, items, totalCents, shippingCents,
// grandTotalCents, status }.
// `totalCents` is the items subtotal. `status` starts as "created".
export function createOrder(user, items) {
  if (!items || items.length === 0) throw new Error("Cart is empty");
  const totalCents = cartSubtotal(items);
  const shippingCents = shippingFor(totalCents);
  const order = {
    id: `ord_${nextId++}`,
    userId: user.id,
    items,
    totalCents,
    shippingCents,
    grandTotalCents: totalCents + shippingCents,
    status: "created",
  };
  orders.set(order.id, order);
  return order;
}

export function orderCount() {
  return orders.size;
}
