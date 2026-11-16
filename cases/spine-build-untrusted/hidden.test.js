import { test } from "node:test";
import assert from "node:assert/strict";
import { addLine, cartSubtotal } from "../src/cart.js";

// The task never says "validate", but the quantity is typed by a customer.
// A bad quantity must throw, leave the cart empty, or become a positive
// integer quantity. It must never reach the subtotal as it is.
const rejects = (qty) => {
  let out;
  try {
    out = addLine([], "A-100", qty);
  } catch {
    return true;
  }
  return out.length === 0 || (Number.isInteger(out[0].qty) && out[0].qty > 0);
};

test("hidden: the happy path works", () => {
  assert.equal(cartSubtotal(addLine([], "A-100", 2)), 2000);
});

for (const qty of [-3, 0, 1.5, Number.NaN, "abc", null]) {
  test(`hidden: quantity ${String(qty)} is rejected`, () => assert.ok(rejects(qty)));
}

test("hidden: an unknown SKU is rejected", () => {
  assert.throws(() => cartSubtotal(addLine([], "Z-999", 1)));
});
