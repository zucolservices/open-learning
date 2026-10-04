"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BAD, CLEAN, COLS, TESTS, missed, results, type TestId } from "./model";
import type { TestState } from "./state";

const RUN_NAMES: Record<TestId, string> = {
  pk_unique: "unique_orders_order_id",
  pk_not_null: "not_null_orders_order_id",
  cust_not_null: "not_null_orders_customer_id",
  cust_rel: "relationships_orders_customer_id__customers",
  status_values: "accepted_values_orders_status",
  amount_positive: "assert_no_negative_amounts",
};

/* 1 ─ Smoke alarms for data ----------------------------------------------------------------------- */

export function SmokeAlarm() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Smoke alarms for data"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "Checking by hand",
              "Walk round the house every evening sniffing for smoke. Works until the night you're tired.",
            ],
            [
              "Smoke alarms",
              "Small, cheap, always on. Silent when all is well; loud the moment something is wrong.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                i ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You could check your house for smoke every evening, but you&apos;d eventually forget. Smoke
        alarms do it constantly, say nothing when all is well, and shout when something&apos;s
        wrong.
      </p>
      <p>
        <Term id="data-test">Data tests</Term> are smoke alarms for tables. Each one is a small{" "}
        <Term id="assertion">assertion</Term>, like &ldquo;every order has a customer&rdquo;, that
        runs automatically after data loads and fails loudly when the rule is broken. Great
        Expectations calls them &ldquo;unit tests for your data&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A bad load meets its tests ⭐ --------------------------------------------------------------- */

export function TestBench() {
  const [s, set] = useSceneState<TestState>();
  const attached = s.attached ?? [];
  const toggle = (id: TestId) =>
    set({
      attached: attached.includes(id) ? attached.filter((x) => x !== id) : [...attached, id],
      ran: false,
    });
  const res = results(s.load, attached);
  const miss = missed(s.load, attached);
  const rows = s.load === "clean" ? CLEAN.map((r) => ({ row: r, defects: [] as TestId[] })) : BAD;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="A bad load meets its tests"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              ["clean", "Monday's load"],
              ["bad", "Tuesday's load"],
            ].map(([k, l]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.load === k}
                onClick={() => set({ load: k as TestState["load"], ran: false })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.load === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="border-line overflow-x-auto rounded-lg border">
            <table className="w-full font-mono text-[10px]">
              <thead className="bg-surface-2">
                <tr>
                  {COLS.map((c) => (
                    <th key={c} className="px-2 py-1 text-left font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const caught = s.ran && r.defects.some((d) => attached.includes(d));
                  const escaped = s.ran && r.defects.length > 0 && !caught;
                  return (
                    <tr
                      key={i}
                      className={cn(
                        "border-line border-t",
                        caught && "bg-good/10",
                        escaped && "bg-bad/15",
                      )}
                    >
                      {r.row.map((c, j) => (
                        <td key={j} className="px-2 py-0.5">
                          {c === null ? <span className="text-subtle">null</span> : c}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted mb-1 text-[10px]">ATTACH TESTS (models/orders.yml)</p>
            <div className="flex flex-wrap gap-1">
              {TESTS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={attached.includes(t.id)}
                  onClick={() => toggle(t.id)}
                  className={cn(
                    "rounded-md border px-2 py-1 font-mono text-[10px]",
                    attached.includes(t.id) ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {attached.includes(t.id) ? "✓ " : ""}
                  {t.col}: {t.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => set({ ran: true })}
              className="bg-accent text-accent-fg mt-2 rounded-full px-4 py-1.5 text-xs font-medium"
            >
              dbt test
            </button>
          </div>
          {s.ran && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface-2 rounded-lg border px-3 py-2 font-mono text-[11px]"
            >
              {res.length === 0 && (
                <p className="text-muted">No tests attached: nothing checked, nothing reported.</p>
              )}
              {res.map((r) => (
                <p key={r.test.id} className={r.failing ? "text-bad" : "text-good"}>
                  {r.failing ? `FAIL ${r.failing}` : "PASS"} {RUN_NAMES[r.test.id]}
                </p>
              ))}
              {miss.length > 0 && (
                <p className="text-bad mt-1 font-sans">
                  {miss.length} bad row{miss.length > 1 ? "s" : ""} got through untested (red in the
                  table).
                </p>
              )}
              {s.load === "bad" && miss.length === 0 && res.length > 0 && (
                <p className="text-good mt-1 font-sans">Every bad row was caught.</p>
              )}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Tuesday&apos;s orders contain five different problems. Attach tests to the columns, run
        them, and see which problems are caught and which slip through. Then run Monday&apos;s clean
        load: tests should stay quiet when nothing is wrong.
      </p>
      <p>
        In dbt each test is a query that looks for rows breaking a rule; it passes when it finds
        none. The four built-in <Term id="generic-test">generic tests</Term> are unique, not_null,
        accepted_values and relationships. Rules they don&apos;t cover, like &ldquo;no negative
        amounts&rdquo;, become a one-off &ldquo;singular&rdquo; test.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Data tests and unit tests ------------------------------------------------------------------- */

export function UnitVsData() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Data tests and unit tests"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold">Data test: is the real data right?</p>
            <Code>{`models:
  - name: orders
    columns:
      - name: order_id
        data_tests: [unique, not_null]`}</Code>
            <p className="text-muted mt-1 text-[11px]">
              Runs on the built table, every time data loads.
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold">Unit test: is my logic right?</p>
            <Code>{`unit_tests:
  - name: refund_makes_amount_negative
    model: orders
    given:
      - input: ref('raw_orders')
        rows: [{order_id: 1, type: refund, value: 50}]
    expect:
      rows: [{order_id: 1, amount: -50}]`}</Code>
            <p className="text-muted mt-1 text-[11px]">
              Runs on tiny made-up inputs, in development and CI.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Software has unit tests; since dbt 1.8 (May 2024) data projects have them too, for checking
        the logic of a transformation on small invented inputs. Data tests check the real data that
        arrives.
      </p>
      <p>
        You need both. Correct code still produces bad output when the input is bad, and pipelines
        usually break when new data arrives, not when code changes. So data tests should run on
        every load.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When a test fails --------------------------------------------------------------------------- */

export function WhenTestsFail() {
  const [s, set] = useSceneState<TestState>();
  const err = s.severity === "error";
  const nodes = ["stg_orders", "test: orders.amount", "fct_revenue", "board_dashboard"];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When a test fails"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {(["error", "warn"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.severity === k}
                onClick={() => set({ severity: k })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs",
                  s.severity === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                severity: {k}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {nodes.map((n, i) => {
              const state =
                i === 0 ? "built" : i === 1 ? (err ? "FAIL" : "WARN") : err ? "skipped" : "built";
              return (
                <div key={n} className="flex items-center gap-2">
                  {i > 0 && <span className="text-muted">→</span>}
                  <motion.div
                    layout
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs",
                      state === "FAIL"
                        ? "border-bad bg-bad/10"
                        : state === "WARN"
                          ? "border-viz-compute bg-viz-compute/10"
                          : state === "skipped"
                            ? "border-line text-subtle line-through"
                            : "border-good bg-good/10",
                    )}
                  >
                    <p className="font-mono">{n}</p>
                    <p className="text-[10px]">{state}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
          <Code>{`- name: amount
  data_tests:
    - dbt_utils.accepted_range:
        arguments: { min_value: 0 }
        config:
          severity: ${s.severity}
          store_failures: true`}</Code>
        </div>
      }
    >
      <p>
        With <code>dbt build</code>, models and tests run together in order. If a test fails with
        severity <code>error</code> (the default), everything downstream of it is skipped, so bad
        data doesn&apos;t reach the dashboard. With <code>warn</code>, it&apos;s reported but the
        run carries on.
      </p>
      <p>
        <code>store_failures</code> saves the failing rows to a table so someone can look at them.
        Module 7 goes deeper on choosing what each failure should do.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which test catches it? ---------------------------------------------------------------------- */

export function WhichTest() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which test catches it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-test"
            prompt="Which built-in dbt test would catch each problem?"
            categories={[
              { id: "unique", label: "unique" },
              { id: "not_null", label: "not_null" },
              { id: "accepted", label: "accepted_values" },
              { id: "rel", label: "relationships" },
            ]}
            items={[
              {
                id: "dup",
                label: "Two rows share invoice number INV-88",
                category: "unique",
                why: "A key appears twice.",
              },
              {
                id: "blank",
                label: "A payment has no payment_id",
                category: "not_null",
                why: "A required value is missing.",
              },
              {
                id: "typo",
                label: "A country code reads 'UKK'",
                category: "accepted",
                why: "Not in the allowed list.",
              },
              {
                id: "orphan",
                label: "An order points to product 9001, which doesn't exist",
                category: "rel",
                why: "A foreign key with no parent.",
              },
              {
                id: "nullkey",
                label: "Duplicated nulls in a key column",
                category: "not_null",
                why: "unique skips nulls, so pair it with not_null.",
              },
            ]}
            explanation="unique: duplicates. not_null: missing values (unique ignores nulls). accepted_values: unexpected values. relationships: orphaned foreign keys."
          />
        </div>
      }
    >
      <p>Sort the problems.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Assertions on data", "A test looks for bad rows; zero means pass."],
  ["Four generic tests", "unique, not_null, accepted_values, relationships."],
  ["Singular tests", "One-off SQL for any other rule."],
  ["Data tests vs unit tests", "Real data on every load vs logic in CI."],
  ["Fail safely", "Errors skip downstream models; warnings report."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: before writing rules, profile the data to learn what normal looks like.</p>
    </StepLayout>
  );
}
