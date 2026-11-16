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

// qty comes from a form the customer types into: accept positive integers only.
export function addLine(items, sku, qty) {
  if (!Number.isInteger(qty) || qty < 1) throw new Error(`Invalid quantity: ${qty}`);
  priceOf(sku);
  return [...items, { sku, qty }];
}
