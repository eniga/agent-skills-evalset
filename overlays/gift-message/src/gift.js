const MAX_LENGTH = 200;

// The gift message is typed by the customer at checkout.
export function withGiftMessage(order, message) {
  if (typeof message !== "string" || message.length > MAX_LENGTH) {
    throw new Error(`Gift message must be at most ${MAX_LENGTH} characters`);
  }
  return { ...order, giftMessage: message };
}
