const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const SHIPPING_FEE_CENTS = 499;
const INTERNATIONAL_FEE_CENTS = 1500;

// The shop's shipping rule. Domestic: free at or above the threshold.
// International: one flat fee.
export function shippingFor({ subtotalCents, country = "US" }) {
  if (country !== "US") return INTERNATIONAL_FEE_CENTS;
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS;
}
