import { partitionFor } from "./murmur2";
import type { HotKey, KeyChoice } from "./state";

/* Ordering simulation: twelve order-status events, three partitions read at different speeds. */

export interface OrderEvent {
  i: number;
  customer: string;
  order: string;
  status: "placed" | "paid" | "shipped";
}

const RAW: [string, string, OrderEvent["status"]][] = [
  ["asha", "101", "placed"],
  ["ravi", "102", "placed"],
  ["asha", "101", "paid"],
  ["meera", "104", "placed"],
  ["asha", "103", "placed"],
  ["ravi", "102", "paid"],
  ["asha", "101", "shipped"],
  ["meera", "104", "paid"],
  ["asha", "103", "paid"],
  ["ravi", "102", "shipped"],
  ["meera", "104", "shipped"],
  ["asha", "103", "shipped"],
];

export const ORDER_EVENTS: OrderEvent[] = RAW.map(([customer, order, status], i) => ({
  i,
  customer,
  order,
  status,
}));
export const ORDERS = ["101", "102", "103", "104"];
export const PARTS = 3;
/** How far behind each partition's consumer runs, in event slots. */
export const LAG = [0, 1, 6];

export function partitionOf(e: OrderEvent, k: KeyChoice): number {
  if (k === "none") return e.i % PARTS; // spread evenly, no key
  const key = k === "customer" ? e.customer : k === "order" ? e.order : e.status;
  return partitionFor(key, PARTS);
}

/** Events in the order the downstream system receives them. */
export function arrivals(k: KeyChoice) {
  return ORDER_EVENTS.map((e) => ({ e, p: partitionOf(e, k), t: e.i + LAG[partitionOf(e, k)] }))
    .sort((a, b) => a.t - b.t || a.p - b.p)
    .map((x) => x);
}

const RANK = { placed: 0, paid: 1, shipped: 2 };

/** For each order, the statuses in arrival order and whether they came in the right sequence. */
export function perOrder(k: KeyChoice) {
  const arr = arrivals(k);
  return ORDERS.map((o) => {
    const seq = arr.filter((x) => x.e.order === o).map((x) => x.e.status);
    const ok = seq.every((s, j) => j === 0 || RANK[s] > RANK[seq[j - 1]]);
    return { order: o, customer: ORDER_EVENTS.find((e) => e.order === o)!.customer, seq, ok };
  });
}

/* Hot partition simulation: payments to merchants, one merchant takes 40%. */

export const MERCHANTS = ["megamart", ...Array.from({ length: 12 }, (_, i) => `shop-${i + 1}`)];
const PAYERS = Array.from({ length: 600 }, (_, i) => `payer-${i + 1}`);

export function load(k: HotKey, n: number): number[] {
  const bars = Array(n).fill(0);
  if (k === "payer") {
    for (const p of PAYERS) bars[partitionFor(p, n)] += 100 / PAYERS.length;
    return bars;
  }
  for (const m of MERCHANTS) {
    const share = m === "megamart" ? 40 : 60 / 12;
    if (k === "salted" && m === "megamart") {
      for (let s = 0; s < 4; s++) bars[partitionFor(`${m}#${s}`, n)] += share / 4;
    } else bars[partitionFor(m, n)] += share;
  }
  return bars;
}
