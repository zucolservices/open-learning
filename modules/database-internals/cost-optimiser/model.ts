/** Stale statistics after a bulk load lead the planner astray (illustrative). */

export type Stage = 0 | 1 | 2; // 0 = before load, 1 = after load (stale stats), 2 = after ANALYZE

export interface Outcome {
  statsRows: string;
  estimate: string;
  actual: string;
  plan: string;
  time: string;
  good: boolean;
  note: string;
}

export function outcome(stage: Stage): Outcome {
  if (stage === 0)
    return {
      statsRows: "10,000",
      estimate: "rows=120",
      actual: "rows=118",
      plan: "Nested Loop\n  -> Index Scan on payments (merchant_id = 77)\n  -> Index Scan on merchants",
      time: "2 ms",
      good: true,
      note: "Statistics match reality. For about 120 payments, a nested loop with index lookups is the right choice.",
    };
  if (stage === 1)
    return {
      statsRows: "10,000 (stale)",
      estimate: "rows=120",
      actual: "rows=240,000",
      plan: "Nested Loop\n  -> Index Scan on payments (merchant_id = 77)\n  -> Index Scan on merchants   (run 240,000 times)",
      time: "41 s",
      good: false,
      note: "A million new rows arrived overnight, mostly for merchant 77, but statistics weren't refreshed. The planner still expects 120 rows, so it keeps the nested loop, now doing 240,000 lookups.",
    };
  return {
    statsRows: "1,010,000",
    estimate: "rows=238,900",
    actual: "rows=240,000",
    plan: "Hash Join\n  -> Seq Scan on payments (merchant_id = 77)\n  -> Hash\n       -> Seq Scan on merchants",
    time: "0.6 s",
    good: true,
    note: "ANALYZE resampled the table. With a realistic estimate, the planner switches to a hash join.",
  };
}

export const CORR = {
  city: 0.05, // 5% of customers live in Pune
  pin: 0.004, // 0.4% have pincode 411001
  rows: 1_000_000,
};
