import { test } from "node:test";
import assert from "node:assert/strict";
import { cartSubtotal } from "../src/cart.js";

test("subtotal multiplies price by quantity", () => {
  assert.equal(cartSubtotal([{ sku: "A-100", qty: 3 }]), 3000);
});

test("subtotal adds different products", () => {
  assert.equal(
    cartSubtotal([
      { sku: "A-100", qty: 1 },
      { sku: "B-200", qty: 2 },
    ]),
    6000,
  );
});

test("unknown product is rejected", () => {
  assert.throws(() => cartSubtotal([{ sku: "Z-999", qty: 1 }]), /Unknown SKU/);
});
