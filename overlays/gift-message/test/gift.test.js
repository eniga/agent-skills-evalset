import { test } from "node:test";
import assert from "node:assert/strict";
import { withGiftMessage } from "../src/gift.js";
import { orderPageHtml } from "../src/page.js";

const order = { id: "ord_7", status: "created", totalCents: 2500 };

test("TC-U1: the gift message appears on the order page", () => {
  const html = orderPageHtml(withGiftMessage(order, "Happy birthday, Sam"));
  assert.match(html, /<p class="gift">Happy birthday, Sam<\/p>/);
});

test("TC-U2: a message over 200 characters is rejected", () => {
  assert.throws(() => withGiftMessage(order, "x".repeat(201)), /at most 200/);
});
