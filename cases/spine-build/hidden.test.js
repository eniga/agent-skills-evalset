import { test } from "node:test";
import assert from "node:assert/strict";
import { createOrder } from "../src/orders.js";
import { confirmationFor } from "../src/notify.js";

const user = { id: "u_eval", email: "eval@example.com", role: "customer" };

test("below the threshold shipping is charged", () => {
  const order = createOrder(user, [{ sku: "A-100", qty: 2 }]);
  assert.equal(order.shippingCents, 499);
  assert.equal(order.grandTotalCents, 2499);
});

test("at the threshold shipping is free", () => {
  const order = createOrder(user, [{ sku: "C-300", qty: 1 }]);
  assert.equal(order.shippingCents, 0);
  assert.equal(order.grandTotalCents, 5000);
});

test("just below the threshold shipping is charged", () => {
  const order = createOrder(user, [
    { sku: "A-100", qty: 2 },
    { sku: "B-200", qty: 1 },
  ]);
  assert.equal(order.totalCents, 4500);
  assert.equal(order.grandTotalCents, 4999);
});

test("the existing contract is unchanged", () => {
  const items = [{ sku: "B-200", qty: 1 }];
  const order = createOrder(user, items);
  assert.match(order.id, /^ord_\d+$/);
  assert.equal(order.userId, "u_eval");
  assert.equal(order.items, items);
  assert.equal(order.totalCents, 2500);
  assert.equal(order.status, "created");
  assert.equal(confirmationFor(order), `Order ${order.id} received: $25.00`);
});
