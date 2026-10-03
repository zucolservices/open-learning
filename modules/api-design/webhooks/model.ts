/** A shop's webhook receiver facing a bad day of deliveries (illustrative). */

export type Defence = "verify" | "dedupe" | "fast" | "fetch";

export const DEFENCES: { id: Defence; label: string; note: string }[] = [
  {
    id: "verify",
    label: "Verify the signature",
    note: "Reject anything not signed with the shared secret.",
  },
  {
    id: "dedupe",
    label: "Skip event IDs already processed",
    note: "Store each event ID; ignore repeats.",
  },
  {
    id: "fast",
    label: "Reply 200 at once, process in the background",
    note: "So the sender doesn't time out and retry.",
  },
  {
    id: "fetch",
    label: "Fetch the payment's current state before acting",
    note: "Don't trust the order events arrive in.",
  },
];

export interface Row {
  label: string;
  outcome: string;
  bad: boolean;
}

export function day(on: Defence[]): {
  rows: Row[];
  shipped: number;
  finalStatus: string;
  problems: number;
} {
  const has = (d: Defence) => on.includes(d);
  const rows: Row[] = [];
  let shipped = 0;
  rows.push({
    label: "evt_1 payment.succeeded (order 41)",
    outcome: "Order 41 shipped",
    bad: false,
  });
  shipped++;
  // Slow handler: sender times out, retries evt_1.
  if (!has("fast")) {
    rows.push({
      label: "evt_1 again: your handler took 15 s, the sender gave up and retried",
      outcome: has("dedupe") ? "Seen evt_1 before: ignored" : "Order 41 shipped a second time",
      bad: !has("dedupe"),
    });
    if (!has("dedupe")) shipped++;
  }
  rows.push({
    label: "evt_2 payment.succeeded (order 42), delivered twice by the sender",
    outcome: has("dedupe") ? "Order 42 shipped once; the copy ignored" : "Order 42 shipped twice",
    bad: !has("dedupe"),
  });
  shipped += has("dedupe") ? 1 : 2;
  rows.push({
    label: "A forged POST: payment.succeeded for order 99, no valid signature",
    outcome: has("verify")
      ? "Rejected with 400: signature doesn't match"
      : "Order 99 shipped for free",
    bad: !has("verify"),
  });
  if (!has("verify")) shipped++;
  rows.push({
    label: "evt_5 payment 7 → refunded, arrives before evt_4 payment 7 → captured",
    outcome: has("fetch")
      ? "Fetched payment 7: it's refunded. Status correct."
      : "Applied in arrival order: payment 7 ends up 'captured', though it was refunded",
    bad: !has("fetch"),
  });
  const problems = rows.filter((r) => r.bad).length;
  return { rows, shipped, finalStatus: has("fetch") ? "refunded" : "captured", problems };
}
