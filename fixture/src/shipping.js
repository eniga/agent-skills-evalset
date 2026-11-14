const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const SHIPPING_FEE_CENTS = 499;

// The shop's one shipping rule: free at or above the threshold.
export function shippingFor(subtotalCents) {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS;
}
