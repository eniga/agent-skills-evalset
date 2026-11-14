import { test } from "node:test";
import assert from "node:assert/strict";
import { cartSubtotal } from "../src/cart.js";

test(
  "two lines of the same product are added together",
  { todo: "D-1: mergeLines overwrites the quantity" },
  () => {
    assert.equal(
      cartSubtotal([
        { sku: "A-100", qty: 1 },
        { sku: "A-100", qty: 2 },
      ]),
      3000,
    );
  },
);
