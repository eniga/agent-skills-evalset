import { formatCents } from "./money.js";

// HTML for the storefront's order page.
export function orderPageHtml(order) {
  return [
    `<h1>Order ${order.id}</h1>`,
    `<p class="status">${order.status}</p>`,
    `<p class="total">Total: ${formatCents(order.totalCents)}</p>`,
  ].join("\n");
}
