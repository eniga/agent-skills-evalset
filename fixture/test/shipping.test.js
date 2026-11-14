import { test } from "node:test";
import assert from "node:assert/strict";
import { shippingFor } from "../src/shipping.js";
import { quote } from "../src/quote.js";

test("shipping is charged below the threshold and free at it", () => {
  assert.equal(shippingFor(4999), 499);
  assert.equal(shippingFor(5000), 0);
});

test("quote shows subtotal and shipping", () => {
  assert.deepEqual(quote([{ sku: "A-100", qty: 2 }]), {
    subtotalCents: 2000,
    shippingCents: 499,
    display: "$20.00 + $4.99 shipping",
  });
});
