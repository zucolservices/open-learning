/** One bad night, three failed checks, and what each response does. Made-up figures. */

export type Action = "warn" | "block" | "quarantine";

export const FAILURES: {
  id: string;
  check: string;
  detail: string;
  allowed: Action[];
  best: Action;
  results: Record<Action, { ok: boolean; text: string }>;
}[] = [
  {
    id: "postcode",
    check: "delivery_postcode not null",
    detail: "12 of 10,000 orders have no postcode. Revenue reports don't use it.",
    allowed: ["warn", "block", "quarantine"],
    best: "warn",
    results: {
      warn: {
        ok: true,
        text: "Reports publish on time; the CRM team gets a ticket to fix 12 records.",
      },
      block: { ok: false, text: "The whole board pack is held back for a field it doesn't use." },
      quarantine: {
        ok: false,
        text: "Works, but 12 real sales vanish from revenue until someone replays them: more harm than the missing postcode.",
      },
    },
  },
  {
    id: "amount",
    check: "amount >= 0",
    detail: "40 orders have negative amounts: a bug flipped the sign on one shop's sales.",
    allowed: ["warn", "block", "quarantine"],
    best: "quarantine",
    results: {
      warn: {
        ok: false,
        text: "Revenue is published ₹80,000 too low, with a warning nobody reads.",
      },
      block: {
        ok: false,
        text: "Correct, but 9,960 good orders are held too; every dashboard is a day stale.",
      },
      quarantine: {
        ok: true,
        text: "9,960 orders flow on; 40 wait in a quarantine table to be fixed and replayed. Reports say '40 orders pending'.",
      },
    },
  },
  {
    id: "volume",
    check: "row count within 20% of usual",
    detail:
      "Only 7,000 orders arrived, 30% fewer than a normal Tuesday. Something upstream is broken.",
    allowed: ["warn", "block"],
    best: "block",
    results: {
      warn: { ok: false, text: "The board sees a 30% sales crash that never happened." },
      block: {
        ok: true,
        text: "The circuit opens: yesterday's numbers stay up, marked as delayed, until the missing orders arrive.",
      },
      quarantine: { ok: false, text: "" },
    },
  },
];

export const SYNTAX: Record<string, { label: string; code: string }> = {
  dbt: {
    label: "dbt",
    code: `columns:
  - name: delivery_postcode
    data_tests:
      - not_null:
          config:
            severity: error
            warn_if: ">0"
            error_if: ">1000"      # warn for a few, fail for many
            store_failures: true    # keep a copy of failing rows`,
  },
  databricks: {
    label: "Databricks pipelines",
    code: `from pyspark import pipelines as dp

@dp.table
@dp.expect("has_postcode", "delivery_postcode IS NOT NULL")      # warn: keep, count
@dp.expect_or_drop("positive_amount", "amount >= 0")             # drop bad rows
@dp.expect_or_fail("has_order_id", "order_id IS NOT NULL")       # stop the update
def orders_clean():
    return spark.read.table("orders_raw")`,
  },
  quarantine: {
    label: "Quarantine pattern",
    code: `-- flag rows, then split them
CREATE OR REPLACE TABLE orders_checked AS
SELECT *, (amount < 0 OR order_id IS NULL) AS is_quarantined
FROM orders_raw;

INSERT INTO orders     SELECT * FROM orders_checked WHERE NOT is_quarantined;
INSERT INTO quarantine SELECT * FROM orders_checked WHERE is_quarantined;`,
  },
  kafka: {
    label: "Kafka Connect",
    code: `# sink connector: send records it can't process to a dead letter topic
errors.tolerance=all
errors.deadletterqueue.topic.name=orders-dlq
errors.deadletterqueue.context.headers.enable=true`,
  },
};
