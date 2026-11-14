import { test } from "node:test";
import assert from "node:assert/strict";
import { summarizeOrders } from "../src/report.js";

test("summarizes open orders", () => {
  const summary = summarizeOrders([
    { id: "ord_1", status: "created", totalCents: 1000 },
    { id: "ord_2", status: "shipped", totalCents: 2500 },
  ]);
  assert.deepEqual(summary, {
    count: 2,
    revenueCents: 3500,
    byStatus: { created: 1, shipped: 1 },
    largestOrderId: "ord_2",
  });
});
