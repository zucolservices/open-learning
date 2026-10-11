/**
 * A made-up checkout that swallows a payment error, three fixes, and three failure scenarios.
 * Outcomes are scripted from which fixes are applied.
 */

export type Fix = "propagate" | "result" | "validate";

export const FIXES: { id: Fix; label: string; code: string[] }[] = [
  {
    id: "propagate",
    label: "Let the exception travel, handle it where you can act",
    code: [
      "try {",
      "  await payments.charge(order);",
      "} catch (e) {",
      "  throw new PaymentFailed(`Order ${order.id}: charge failed`, { cause: e });",
      "}",
      "// the web handler catches PaymentFailed and shows the customer a message",
    ],
  },
  {
    id: "result",
    label: "Return a result the caller must check",
    code: [
      "const result = await payments.charge(order); // { ok: true } | { ok: false, reason }",
      "if (!result.ok) return showPaymentError(result.reason);",
      "markPaid(order);",
    ],
  },
  {
    id: "validate",
    label: "Fail fast: validate at the edge",
    code: [
      "function checkout(order) {",
      '  if (order.total <= 0) throw new InvalidOrder("Total must be positive");',
      '  if (!order.cardToken) throw new InvalidOrder("No card on the order");',
      "  …",
      "}",
    ],
  },
];

export const SWALLOWED = [
  "async function checkout(order) {",
  "  try {",
  "    await payments.charge(order);",
  "  } catch (e) {",
  "    // TODO",
  "  }",
  "  markPaid(order);",
  "  sendToKitchen(order);",
  "}",
];

export const SCENARIOS: { id: string; label: string }[] = [
  { id: "declined", label: "The card is declined" },
  { id: "negative", label: "A bug sends a total of −₹50" },
  { id: "timeout", label: "The bank doesn't answer in time" },
];

export function outcome(id: string, fixes: Fix[]): { ok: boolean; text: string } {
  const handled = fixes.includes("propagate") || fixes.includes("result");
  if (id === "negative" && fixes.includes("validate"))
    return {
      ok: true,
      text: "Rejected at once: “Total must be positive”. The bug is found in seconds, before any money moves.",
    };
  if (!handled)
    return {
      ok: false,
      text: "Error swallowed. The order is marked paid and sent to the kitchen. The café loses the money and nobody knows why.",
    };
  if (id === "declined")
    return {
      ok: true,
      text: "The customer sees “Card declined, try another card”. The order stays unpaid.",
    };
  if (id === "timeout")
    return {
      ok: true,
      text: "The customer sees “Couldn't reach the bank, please try again”. The log records the order and the cause.",
    };
  return {
    ok: false,
    text: "The bank rejects it with a cryptic code; the customer sees “payment failed”. Caught, but far from the bug that caused it.",
  };
}
