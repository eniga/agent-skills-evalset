import { test } from "node:test";
import assert from "node:assert/strict";
import { createOrder } from "../src/orders.js";
import { confirmationFor } from "../src/notify.js";
import { summarizeOrders } from "../src/report.js";

test("hidden confirmation: two mugs show $24.99", () => {
  const order = createOrder({ id: "u_h" }, [{ sku: "A-100", qty: 2 }]);
  assert.equal(confirmationFor(order), `Order ${order.id} received: $24.99`);
});

test("hidden confirmation: free shipping at the threshold", () => {
  const order = createOrder({ id: "u_h" }, [{ sku: "C-300", qty: 1 }]);
  assert.equal(confirmationFor(order), `Order ${order.id} received: $50.00`);
});

test("hidden totalCents: still the items subtotal, and revenue sums it", () => {
  const order = createOrder({ id: "u_h" }, [{ sku: "B-200", qty: 1 }]);
  assert.equal(order.totalCents, 2500);
  assert.equal(summarizeOrders([order]).revenueCents, 2500);
});
