import { formatCents } from "./money.js";

// Confirmation text is only sent for freshly created orders.
export function confirmationFor(order) {
  if (order.status !== "created") return null;
  return `Order ${order.id} received: ${formatCents(order.totalCents)}`;
}
