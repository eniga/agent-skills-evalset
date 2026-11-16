import { test } from "node:test";
import assert from "node:assert/strict";
import { addLine, cartSubtotal } from "../src/cart.js";

test("TC-U1: adding 2 mugs to an empty cart gives subtotal 2000", () => {
  assert.equal(cartSubtotal(addLine([], "A-100", 2)), 2000);
});

test("TC-U2: the original items are unchanged", () => {
  const items = [];
  addLine(items, "A-100", 2);
  assert.deepEqual(items, []);
});

test("a quantity that is not a positive integer is rejected", () => {
  for (const qty of [-3, 0, 1.5, "2"]) assert.throws(() => addLine([], "A-100", qty), /Invalid quantity/);
});
