export function summarizeOrders(orders) {
  const summary = { count: 0, revenueCents: 0, byStatus: {}, largestOrderId: null };
  if (!orders) return summary;

  let largest = -1;
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    if (!order) continue;
    summary.byStatus[order.status] = (summary.byStatus[order.status] || 0) + 1;
    if (order.status === "cancelled") continue;

    summary.count += 1;
    if (typeof order.totalCents !== "number") continue;
    summary.revenueCents += order.totalCents;
    if (order.totalCents > largest) {
      largest = order.totalCents;
      summary.largestOrderId = order.id;
    }
  }
  return summary;
}
