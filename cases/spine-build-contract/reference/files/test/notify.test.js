import { test } from "node:test";
import assert from "node:assert/strict";
import { createOrder } from "../src/orders.js";
import { confirmationFor } from "../src/notify.js";

test("TC-U1: the confirmation shows subtotal plus shipping", () => {
  const order = createOrder({ id: "u_bob" }, [{ sku: "A-100", qty: 2 }]);
  assert.equal(confirmationFor(order), `Order ${order.id} received: $24.99`);
});

test("a shipped order gets no confirmation", () => {
  assert.equal(confirmationFor({ id: "ord_x", status: "shipped", totalCents: 100 }), null);
});
