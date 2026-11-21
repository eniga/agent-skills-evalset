import { test } from "node:test";
import assert from "node:assert/strict";
import { orderPageHtml } from "../src/page.js";

test("the order page shows the id, status, and total", () => {
  const html = orderPageHtml({ id: "ord_7", status: "created", totalCents: 2500 });
  assert.match(html, /<h1>Order ord_7<\/h1>/);
  assert.match(html, /created/);
  assert.match(html, /\$25\.00/);
});
