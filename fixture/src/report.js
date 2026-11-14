export function summarizeOrders(orders) {
  let result = { count: 0, revenueCents: 0, byStatus: {}, largestOrderId: null };
  let largest = -1;
  if (orders) {
    if (orders.length > 0) {
      for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        if (o) {
          if (o.status !== "cancelled") {
            result.count = result.count + 1;
            if (typeof o.totalCents === "number") {
              result.revenueCents = result.revenueCents + o.totalCents;
              if (o.totalCents > largest) {
                largest = o.totalCents;
                result.largestOrderId = o.id;
              }
            }
            if (result.byStatus[o.status]) {
              result.byStatus[o.status] = result.byStatus[o.status] + 1;
            } else {
              result.byStatus[o.status] = 1;
            }
          } else {
            if (result.byStatus["cancelled"]) {
              result.byStatus["cancelled"] = result.byStatus["cancelled"] + 1;
            } else {
              result.byStatus["cancelled"] = 1;
            }
          }
        }
      }
    }
  }
  return result;
}
