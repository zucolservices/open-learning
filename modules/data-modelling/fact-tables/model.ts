/** Three orders moving through fulfilment, seen as three kinds of fact table. Made-up data. */

export const MILESTONES = ["placed", "packed", "shipped", "delivered"] as const;
export type Milestone = (typeof MILESTONES)[number];

export const ORDERS: { id: string; value: number; days: Partial<Record<Milestone, number>> }[] = [
  { id: "A", value: 500, days: { placed: 1, packed: 2, shipped: 3, delivered: 5 } },
  { id: "B", value: 1200, days: { placed: 2, packed: 4, shipped: 6 } },
  { id: "C", value: 300, days: { placed: 4, packed: 4, shipped: 5, delivered: 7 } },
];

export const DAYS = 7;

export function transactions(day: number) {
  const rows: { day: number; order: string; event: Milestone; amount: number }[] = [];
  for (let d = 1; d <= day; d++)
    for (const o of ORDERS)
      for (const m of MILESTONES)
        if (o.days[m] === d)
          rows.push({ day: d, order: o.id, event: m, amount: m === "placed" ? o.value : 0 });
  return rows;
}

export function snapshots(day: number) {
  return Array.from({ length: day }, (_, i) => {
    const d = i + 1;
    const open = ORDERS.filter((o) => (o.days.placed ?? 99) <= d && (o.days.delivered ?? 99) > d);
    return { day: d, open: open.length, value: open.reduce((a, o) => a + o.value, 0) };
  });
}

export function accumulating(day: number) {
  return ORDERS.filter((o) => (o.days.placed ?? 99) <= day).map((o) => {
    const seen = (m: Milestone) =>
      o.days[m] !== undefined && o.days[m]! <= day ? o.days[m]! : null;
    const placed = seen("placed");
    const shipped = seen("shipped");
    return {
      order: o.id,
      placed,
      packed: seen("packed"),
      shipped,
      delivered: seen("delivered"),
      lag: placed && shipped ? shipped - placed : null,
      changedToday: MILESTONES.some((m) => o.days[m] === day),
    };
  });
}

export const BALANCES: [string, number][] = [
  ["Jan", 10000],
  ["Feb", 12000],
  ["Mar", 11000],
];

export const MARGINS: { store: string; sales: number; profit: number }[] = [
  { store: "Pune", sales: 1000, profit: 300 },
  { store: "Mumbai", sales: 9000, profit: 900 },
];

export const STUDENTS = ["Asha", "Ben", "Chitra", "Dev"];
export const ATTENDED: Record<string, string[]> = {
  Mon: ["Asha", "Ben", "Chitra", "Dev"],
  Wed: ["Asha", "Chitra"],
  Fri: ["Ben", "Chitra", "Dev"],
};
