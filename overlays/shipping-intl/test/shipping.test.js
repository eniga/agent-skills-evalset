import { test } from "node:test";
import assert from "node:assert/strict";
import { shippingFor } from "../src/shipping.js";
import { quote } from "../src/quote.js";

test("TC-U1: international orders pay the flat fee", () => {
  assert.equal(shippingFor({ subtotalCents: 2000, country: "DE" }), 1500);
  assert.equal(shippingFor({ subtotalCents: 9000, country: "DE" }), 1500);
});

test("TC-U2: domestic shipping is charged below the threshold and free at it", () => {
  assert.equal(shippingFor({ subtotalCents: 4999 }), 499);
  assert.equal(shippingFor({ subtotalCents: 5000 }), 0);
});

test("quote shows subtotal and shipping", () => {
  assert.deepEqual(quote([{ sku: "A-100", qty: 2 }]), {
    subtotalCents: 2000,
    shippingCents: 499,
    display: "$20.00 + $4.99 shipping",
  });
});
