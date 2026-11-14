import { cartSubtotal } from "./cart.js";
import { shippingFor } from "./shipping.js";
import { formatCents } from "./money.js";

// What the storefront shows before checkout.
export function quote(items) {
  const subtotalCents = cartSubtotal(items);
  const shippingCents = shippingFor(subtotalCents);
  return {
    subtotalCents,
    shippingCents,
    display: `${formatCents(subtotalCents)} + ${formatCents(shippingCents)} shipping`,
  };
}
