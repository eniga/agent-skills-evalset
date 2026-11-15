import { formatCents } from "./money.js";
import { shippingFor } from "./shipping.js";

// Confirmation text is only sent for freshly created orders. It shows what
// the customer pays: the items subtotal plus shipping.
export function confirmationFor(order) {
  if (order.status !== "created") return null;
  const paysCents = order.totalCents + shippingFor(order.totalCents);
  return `Order ${order.id} received: ${formatCents(paysCents)}`;
}
