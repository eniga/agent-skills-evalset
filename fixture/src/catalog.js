const PRODUCTS = {
  "A-100": { name: "Mug", priceCents: 1000 },
  "B-200": { name: "Poster", priceCents: 2500 },
  "C-300": { name: "Lamp", priceCents: 5000 },
};

export function priceOf(sku) {
  const product = PRODUCTS[sku];
  if (!product) throw new Error(`Unknown SKU: ${sku}`);
  return product.priceCents;
}
