import { test } from "node:test";
import assert from "node:assert/strict";
import { createOrder, orderCount } from "../src/orders.js";

const alice = { id: "u_alice", email: "alice@example.com", role: "customer" };

test("creates an order with the items subtotal", () => {
  const order = createOrder(alice, [{ sku: "B-200", qty: 1 }]);
  assert.equal(order.userId, "u_alice");
  assert.equal(order.totalCents, 2500);
  assert.match(order.id, /^ord_\d+$/);
});

test("a new order has status created", () => {
  const order = createOrder(alice, [{ sku: "A-100", qty: 1 }]);
  assert.equal(order.status, "created");
});

test("an empty cart is rejected", () => {
  const before = orderCount();
  assert.throws(() => createOrder(alice, []), /Cart is empty/);
  assert.equal(orderCount(), before);
});

test("TC-U1: shipping is charged below the threshold", () => {
  const order = createOrder(alice, [{ sku: "A-100", qty: 2 }]);
  assert.equal(order.shippingCents, 499);
  assert.equal(order.grandTotalCents, 2499);
});

test("TC-U2: shipping is free at the threshold", () => {
  const order = createOrder(alice, [{ sku: "C-300", qty: 1 }]);
  assert.equal(order.shippingCents, 0);
  assert.equal(order.grandTotalCents, 5000);
});

test("TC-U3: existing fields are unchanged", () => {
  const items = [{ sku: "B-200", qty: 1 }];
  const order = createOrder(alice, items);
  assert.equal(order.userId, "u_alice");
  assert.equal(order.items, items);
  assert.equal(order.totalCents, 2500);
  assert.equal(order.status, "created");
});
