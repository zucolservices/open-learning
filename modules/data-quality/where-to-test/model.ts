/** Checks placed along a pipeline, and five ways a night can go wrong. Made-up scenario. */

export type Stage = "edge" | "middle" | "gate";
export const STAGES: { id: Stage; label: string; where: string }[] = [
  { id: "edge", label: "At the edge", where: "as data arrives" },
  { id: "middle", label: "In the middle", where: "after each transformation" },
  { id: "gate", label: "At the gate", where: "before publishing" },
];

export type CheckId = "fresh" | "schema" | "volume" | "stgtests" | "grain" | "wap";
export const CHECKS: { id: CheckId; stage: Stage; label: string }[] = [
  { id: "fresh", stage: "edge", label: "freshness: file arrived on time" },
  { id: "schema", stage: "edge", label: "schema: expected columns and types" },
  { id: "volume", stage: "edge", label: "volume: row count near normal" },
  { id: "stgtests", stage: "middle", label: "staging tests: not null, valid ranges" },
  { id: "grain", stage: "middle", label: "mart tests: one row per order" },
  { id: "wap", stage: "gate", label: "audit before publish (WAP)" },
];

export const SCENARIOS: { id: string; label: string; caughtBy: CheckId[]; note: string }[] = [
  {
    id: "late",
    label: "The supplier file is six hours late",
    caughtBy: ["fresh"],
    note: "Only a freshness check notices data that hasn't arrived; every other check passes on yesterday's data.",
  },
  {
    id: "rename",
    label: "The supplier renamed 'cust_id' to 'customer_ref'",
    caughtBy: ["schema", "stgtests"],
    note: "A schema check catches it on arrival; otherwise staging finds a column full of nulls.",
  },
  {
    id: "half",
    label: "Only half the usual rows arrive",
    caughtBy: ["volume", "wap"],
    note: "A volume check at the edge, or the audit comparing with yesterday.",
  },
  {
    id: "x100",
    label: "A currency bug multiplies amounts by 100 in staging",
    caughtBy: ["stgtests", "wap"],
    note: "Introduced mid-pipeline, so edge checks can't see it.",
  },
  {
    id: "fanout",
    label: "A join duplicates every order in the mart",
    caughtBy: ["grain", "wap"],
    note: "Only checks after the join can see duplicates the join created.",
  },
];

const ORDER: Stage[] = ["edge", "middle", "gate"];

export function outcome(scn: (typeof SCENARIOS)[number], enabled: CheckId[]) {
  const hits = CHECKS.filter((c) => enabled.includes(c.id) && scn.caughtBy.includes(c.id)).sort(
    (a, b) => ORDER.indexOf(a.stage) - ORDER.indexOf(b.stage),
  );
  return hits[0];
}

export const WAP_STEPS = [
  {
    title: "Write",
    sql: "ALTER TABLE orders SET TBLPROPERTIES ('write.wap.enabled'='true');\nALTER TABLE orders CREATE BRANCH audit_0412;\nSET spark.wap.branch = audit_0412;\nINSERT INTO orders SELECT * FROM staged_orders;",
    note: "New data goes to a branch. Dashboards still read main, so they see yesterday's data.",
  },
  {
    title: "Audit",
    sql: "SELECT count(*), count(DISTINCT order_id), min(amount)\nFROM orders VERSION AS OF 'audit_0412';",
    note: "Run every check against the branch: keys, volumes, ranges.",
  },
  {
    title: "Publish",
    sql: "CALL catalog.system.fast_forward('orders', 'main', 'audit_0412');",
    note: "Checks passed: main jumps to the audited data in one step. If they had failed, the branch is simply dropped.",
  },
];
