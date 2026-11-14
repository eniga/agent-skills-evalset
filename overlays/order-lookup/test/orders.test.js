import { test } from "node:test";
import assert from "node:assert/strict";
import { createOrder, getOrder, orderCount } from "../src/orders.js";

const alice = { id: "u_alice", email: "alice@example.com", role: "customer" };

test("creates an order with the items subtotal", () => {
  const order = createOrder(alice, [{ sku: "B-200", qty: 1 }]);
  assert.equal(order.userId, "u_alice");
  assert.equal(order.totalCents, 2500);
  assert.match(order.id, /^ord_\d+$/);
});

test.skip("a new order has status created", () => {
  const order = createOrder(alice, [{ sku: "A-100", qty: 1 }]);
  assert.equal(order.status, "created");
});

test("an empty cart is rejected", () => {
  const before = orderCount();
  assert.throws(() => createOrder(alice, []), /Cart is empty/);
  assert.equal(orderCount(), before);
});

test("TC-U1: the owner gets their order", () => {
  const order = createOrder(alice, [{ sku: "A-100", qty: 1 }]);
  assert.equal(getOrder(alice, order.id).id, order.id);
});

test("TC-U2: an unknown id returns null", () => {
  assert.equal(getOrder(alice, "ord_missing"), null);
});
