import { priceOf } from "./catalog.js";

// Collapse cart lines so each SKU appears once.
export function mergeLines(items) {
  const bySku = {};
  for (const item of items) {
    bySku[item.sku] = item.qty;
  }
  return Object.entries(bySku).map(([sku, qty]) => ({ sku, qty }));
}

export function cartSubtotal(items) {
  let subtotal = 0;
  for (const line of mergeLines(items)) {
    subtotal += priceOf(line.sku) * line.qty;
  }
  return subtotal;
}
