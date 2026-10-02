import type { Op } from "./state";

/** Made-up payment events for the topology builder. */
export interface Pay {
  id: string;
  merchant: string;
  channel: "UPI" | "CARD";
  amount: number;
  status: "success" | "failed";
  phone: string;
}

export const INPUT: Pay[] = [
  {
    id: "p1",
    merchant: "megamart",
    channel: "UPI",
    amount: 450,
    status: "success",
    phone: "98200 41234",
  },
  {
    id: "p2",
    merchant: "jewellers",
    channel: "CARD",
    amount: 82000,
    status: "success",
    phone: "98111 90876",
  },
  {
    id: "p3",
    merchant: "chai-point",
    channel: "UPI",
    amount: 60,
    status: "success",
    phone: "99877 12001",
  },
  {
    id: "p4",
    merchant: "electronics",
    channel: "UPI",
    amount: 34999,
    status: "failed",
    phone: "90044 55120",
  },
  {
    id: "p5",
    merchant: "electronics",
    channel: "UPI",
    amount: 15499,
    status: "success",
    phone: "90044 55120",
  },
  {
    id: "p6",
    merchant: "megamart",
    channel: "CARD",
    amount: 2310,
    status: "success",
    phone: "98760 33421",
  },
  {
    id: "p7",
    merchant: "travel-co",
    channel: "CARD",
    amount: 18700,
    status: "success",
    phone: "97300 11876",
  },
  {
    id: "p8",
    merchant: "jewellers",
    channel: "UPI",
    amount: 51000,
    status: "failed",
    phone: "98111 90876",
  },
];

export const OPS: { id: Op; label: string; code: string; note: string }[] = [
  {
    id: "success",
    label: "filter: status is success",
    code: "filter",
    note: "Drops failed payments.",
  },
  {
    id: "large",
    label: "filter: amount ≥ ₹10,000",
    code: "filter",
    note: "Keeps only large payments.",
  },
  {
    id: "mask",
    label: "mapValues: mask the phone number",
    code: "mapValues",
    note: "Changes the value, keeps the key: no repartitioning.",
  },
  {
    id: "rekey",
    label: "selectKey: key by merchant",
    code: "selectKey",
    note: "Changes the key, so the stream is marked for repartitioning if a grouping or join follows.",
  },
  {
    id: "route",
    label: "split: UPI and card to separate topics",
    code: "split",
    note: "Sends each event to one of several branches.",
  },
];

export const mask = (p: string) => p.slice(0, 2) + "••• ••" + p.slice(-3);

export interface Stage {
  label: string;
  out: Pay[];
}

export function runPipeline(ops: Op[]): { stages: Stage[]; sinks: Record<string, Pay[]> } {
  let cur = INPUT.map((p) => ({ ...p }));
  const stages: Stage[] = [{ label: "payments (input)", out: cur }];
  for (const o of OPS) {
    if (!ops.includes(o.id) || o.id === "route") continue;
    if (o.id === "success") cur = cur.filter((p) => p.status === "success");
    if (o.id === "large") cur = cur.filter((p) => p.amount >= 10000);
    if (o.id === "mask") cur = cur.map((p) => ({ ...p, phone: mask(p.phone) }));
    stages.push({ label: o.label, out: cur });
  }
  const sinks: Record<string, Pay[]> = ops.includes("route")
    ? {
        "upi-review": cur.filter((p) => p.channel === "UPI"),
        "card-review": cur.filter((p) => p.channel === "CARD"),
      }
    : { "fraud-review": cur };
  return { stages, sinks };
}
