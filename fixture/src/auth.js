// Who may see an order: its owner, and support staff.
export function canViewOrder(user, order) {
  return user.id === order.userId || user.role === "support";
}
