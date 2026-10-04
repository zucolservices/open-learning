/** An orders contract (ODCS-style, simplified) and upstream changes it does or doesn't catch. */

export type Clause = "schema" | "required" | "values" | "sla" | "team";

export const CLAUSES: Record<Clause, { label: string; yaml: string }> = {
  schema: {
    label: "schema: columns and types",
    yaml: `schema:
  - name: orders
    properties:
      - name: order_id
        logicalType: string
        primaryKey: true
      - name: customer_id
        logicalType: string
      - name: amount
        logicalType: number
      - name: status
        logicalType: string`,
  },
  required: {
    label: "customer_id is required",
    yaml: `        # on customer_id:
        required: true
        quality:
          - metric: nullValues
            mustBe: 0`,
  },
  values: {
    label: "status: allowed values",
    yaml: `        # on status:
        quality:
          - metric: invalidValues
            arguments:
              validValues: [placed, shipped, returned]
            mustBe: 0`,
  },
  sla: {
    label: "freshness promise",
    yaml: `slaProperties:
  - property: latency
    value: 1
    unit: d`,
  },
  team: {
    label: "owner and support channel",
    yaml: `team:
  name: checkout-team
support:
  - channel: '#orders-data'
    tool: slack`,
  },
};

export const HEADER = `apiVersion: v3.2.0
kind: DataContract
id: orders-feed
version: 1.0.0
status: active
domain: checkout`;

export const CHANGES: {
  id: string;
  label: string;
  caughtBy: Clause[];
  safe?: boolean;
  broke: string;
  caught: string;
}[] = [
  {
    id: "add",
    label: "Add a new column, coupon_code",
    caughtBy: [],
    safe: true,
    broke: "",
    caught: "Allowed: adding a column breaks nobody. The contract version gets a minor bump.",
  },
  {
    id: "rename",
    label: "Rename amount to total",
    caughtBy: ["schema"],
    broke: "Finance's revenue model fails at 3 am; nobody upstream knows why.",
    caught: "The producer's CI checks the contract and fails before the change ships.",
  },
  {
    id: "type",
    label: "Store amount as text with a currency sign",
    caughtBy: ["schema"],
    broke: "Sums silently treat '₹240' as zero, and revenue drops.",
    caught: "Type check: amount must be a number.",
  },
  {
    id: "nulls",
    label: "Stop filling customer_id for guest checkouts",
    caughtBy: ["required"],
    broke: "Customer reports quietly lose 8% of orders.",
    caught: "Required field: the change needs a new contract version and a conversation first.",
  },
  {
    id: "status",
    label: "Add a new status, 'cancelled'",
    caughtBy: ["values"],
    broke: "Cancelled orders get counted as sales.",
    caught: "Allowed values: consumers are told before 'cancelled' appears.",
  },
  {
    id: "late",
    label: "Move the export to run every two days",
    caughtBy: ["sla"],
    broke: "The daily dashboard shows stale numbers with no warning.",
    caught: "Breaks the one-day freshness promise; monitored automatically.",
  },
];

export function evaluate(change: (typeof CHANGES)[number], enabled: Clause[]) {
  if (change.safe) return { status: "safe" as const, text: change.caught };
  const hit = change.caughtBy.find((c) => enabled.includes(c));
  return hit
    ? {
        status: "caught" as const,
        text: `${change.caught} (${CLAUSES[hit].label})`,
        owner: enabled.includes("team"),
      }
    : { status: "broke" as const, text: change.broke, owner: enabled.includes("team") };
}
