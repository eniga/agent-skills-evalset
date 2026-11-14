import { test } from "node:test";
import assert from "node:assert/strict";
import { summarizeOrders } from "../src/report.js";

const empty = { count: 0, revenueCents: 0, byStatus: {}, largestOrderId: null };

test("no orders gives an empty summary", () => {
  assert.deepEqual(summarizeOrders(null), empty);
  assert.deepEqual(summarizeOrders(undefined), empty);
  assert.deepEqual(summarizeOrders([]), empty);
});

test("missing entries are skipped", () => {
  assert.deepEqual(summarizeOrders([null, { id: "a", status: "created", totalCents: 5 }, undefined]), {
    count: 1,
    revenueCents: 5,
    byStatus: { created: 1 },
    largestOrderId: "a",
  });
});

test("cancelled orders are counted by status only", () => {
  assert.deepEqual(
    summarizeOrders([
      { id: "a", status: "cancelled", totalCents: 9000 },
      { id: "b", status: "cancelled", totalCents: 1 },
      { id: "c", status: "created", totalCents: 100 },
    ]),
    { count: 1, revenueCents: 100, byStatus: { cancelled: 2, created: 1 }, largestOrderId: "c" },
  );
});

test("an order without a numeric total is counted but adds no revenue", () => {
  assert.deepEqual(
    summarizeOrders([
      { id: "a", status: "created", totalCents: "100" },
      { id: "b", status: "created" },
    ]),
    { count: 2, revenueCents: 0, byStatus: { created: 2 }, largestOrderId: null },
  );
});

test("the first of equal totals is the largest, and zero can be largest", () => {
  assert.equal(
    summarizeOrders([
      { id: "a", status: "created", totalCents: 700 },
      { id: "b", status: "shipped", totalCents: 700 },
    ]).largestOrderId,
    "a",
  );
  assert.equal(summarizeOrders([{ id: "z", status: "created", totalCents: 0 }]).largestOrderId, "z");
});
