import { test } from "node:test";
import assert from "node:assert/strict";
import { createOrder, getOrder } from "../src/orders.js";

const alice = { id: "u_alice", role: "customer" };
const bob = { id: "u_bob", role: "customer" };
const sam = { id: "u_sam", role: "support" };

test("hidden: support staff can view any order (finding 1)", () => {
  const order = createOrder(alice, [{ sku: "A-100", qty: 1 }]);
  assert.equal(getOrder(sam, order.id), order);
});

test("hidden: an unknown id still returns null (finding 2 is wrong, R-2)", () => {
  assert.equal(getOrder(bob, "ord_missing"), null);
});

test("hidden: another customer still gets FORBIDDEN", () => {
  const order = createOrder(alice, [{ sku: "A-100", qty: 1 }]);
  assert.throws(() => getOrder(bob, order.id), (error) => error.code === "FORBIDDEN");
});
