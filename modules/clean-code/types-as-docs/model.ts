/**
 * An order's state as three booleans (eight combinations, three impossible) versus a union of
 * the five real states. Business rules are made up for a café.
 */

export interface Flags {
  paid: boolean;
  delivered: boolean;
  cancelled: boolean;
}

export function meaning(f: Flags): { valid: boolean; label: string } {
  const key = `${+f.paid}${+f.delivered}${+f.cancelled}`;
  const map: Record<string, { valid: boolean; label: string }> = {
    "000": { valid: true, label: "Placed, not yet paid" },
    "100": { valid: true, label: "Paid, being prepared" },
    "110": { valid: true, label: "Delivered" },
    "001": { valid: true, label: "Cancelled before payment" },
    "101": { valid: true, label: "Refunded" },
    "010": { valid: false, label: "Delivered but never paid?" },
    "011": { valid: false, label: "Delivered and cancelled, never paid?" },
    "111": { valid: false, label: "Delivered and cancelled at once?" },
  };
  return map[key];
}

export const BOOLEAN_TYPE = [
  "type Order = {",
  "  paid: boolean;",
  "  delivered: boolean;",
  "  cancelled: boolean;",
  "  paidAt?: Date;",
  "  refundAmount?: number;",
  "};",
];

export const UNION_TYPE = [
  "type Order =",
  '  | { status: "placed" }',
  '  | { status: "paid"; paidAt: Date }',
  '  | { status: "delivered"; paidAt: Date; deliveredAt: Date }',
  '  | { status: "cancelled" }',
  '  | { status: "refunded"; paidAt: Date; refundAmount: number };',
];

export const UNION_STATES = ["placed", "paid", "delivered", "cancelled", "refunded"];
