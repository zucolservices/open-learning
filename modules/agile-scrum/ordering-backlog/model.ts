/**
 * Order one backlog several ways and compare the value lost to delay. One team does one item at a
 * time. An item's cost of delay is the value per week it would bring once live; the delay cost of
 * an ordering is the sum over items of cost of delay × the week it goes live (the method in Black
 * Swan Farming's CD3 example). Illustrative, made-up numbers.
 */

export type Moscow = "Must" | "Should" | "Could" | "Won't";

export interface Item {
  id: string;
  label: string;
  /** Value per week once live (₹ thousand, illustrative). */
  cod: number;
  weeks: number;
  moscow: Moscow;
  note?: string;
}

/** In the order the requests arrived. */
export const ITEMS: Item[] = [
  {
    id: "income",
    label: "Apply for an income certificate online",
    cod: 8,
    weeks: 6,
    moscow: "Must",
  },
  { id: "analytics", label: "Analytics dashboard for officers", cod: 2, weeks: 4, moscow: "Could" },
  { id: "kannada", label: "Kannada interface", cod: 5, weeks: 3, moscow: "Must" },
  { id: "upi", label: "Pay the fee by UPI", cod: 7, weeks: 2, moscow: "Must" },
  {
    id: "sms",
    label: "SMS when the status changes",
    cod: 6,
    weeks: 1,
    moscow: "Should",
    note: "short and valuable, but only a “Should”",
  },
  {
    id: "prefill",
    label: "Prefill details from DigiLocker",
    cod: 4,
    weeks: 3,
    moscow: "Should",
    note: "risky: depends on another system",
  },
  { id: "receipt", label: "Printable receipt", cod: 1, weeks: 1, moscow: "Could" },
  { id: "dark", label: "Dark mode", cod: 0.5, weeks: 1, moscow: "Won't" },
];

export const HORIZON = 26;
const MOSCOW_RANK: Record<Moscow, number> = { Must: 0, Should: 1, Could: 2, "Won't": 3 };

export type OrderingId = "arrival" | "moscow" | "value" | "cd3" | "yours";

export function order(id: Exclude<OrderingId, "yours">): string[] {
  const list = [...ITEMS];
  if (id === "moscow") list.sort((a, b) => MOSCOW_RANK[a.moscow] - MOSCOW_RANK[b.moscow]);
  if (id === "value") list.sort((a, b) => b.cod - a.cod);
  if (id === "cd3") list.sort((a, b) => b.cod / b.weeks - a.cod / a.weeks);
  return list.map((i) => i.id);
}

export interface Plan {
  live: Record<string, number>;
  delayCost: number;
  /** Cumulative value delivered by the end of each week, 0..HORIZON. */
  curve: number[];
}

export function evaluate(ids: string[]): Plan {
  const live: Record<string, number> = {};
  let t = 0;
  let delayCost = 0;
  for (const id of ids) {
    const it = ITEMS.find((i) => i.id === id)!;
    t += it.weeks;
    live[id] = t;
    delayCost += it.cod * t;
  }
  const curve = Array.from({ length: HORIZON + 1 }, (_, w) =>
    ITEMS.reduce((a, it) => a + it.cod * Math.max(0, w - live[it.id]), 0),
  );
  return { live, delayCost, curve };
}

/** Check against Black Swan Farming's worked example: FIFO $69k, CD3 $27k. */
export function selfCheck() {
  const ex = [
    { cod: 1, weeks: 5 },
    { cod: 4, weeks: 1 },
    { cod: 5, weeks: 2 },
  ];
  const cost = (seq: number[]) => {
    let t = 0;
    return seq.reduce((a, i) => ((t += ex[i].weeks), a + ex[i].cod * t), 0);
  };
  return [cost([0, 1, 2]), cost([1, 2, 0])];
}
