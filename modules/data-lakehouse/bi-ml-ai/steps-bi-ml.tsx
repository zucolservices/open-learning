"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ServingState } from "./state";

/* 2 ─ Revenue means one thing ------------------------------------------------------------------- */

const TOOLS = [
  {
    name: "Finance dashboard",
    rule: "completed orders, minus refunds, before GST",
    value: 14.9,
  },
  {
    name: "Marketing notebook",
    rule: "every order placed, even cancelled ones",
    value: 17.3,
  },
  {
    name: "Ops spreadsheet",
    rule: "completed orders, including GST",
    value: 16.2,
  },
];

const METRIC = `metric: revenue
  description: Money we keep from completed orders
  expression: SUM(amount - refund_amount)
  filter: status = 'completed'
  table: gold.orders
  dimensions: [order_date, city, channel]`;

export function OneRevenue() {
  const [s, set] = useSceneState<ServingState>();
  return (
    <StepLayout
      eyebrow="Serving BI"
      title="Revenue means one thing"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.semantic ? "one" : "each"}
            options={[
              ["each", "Each tool writes its own SQL"],
              ["one", "Define it once, in a semantic layer"],
            ]}
            onChange={(v) => set({ semantic: v === "one" })}
          />
          <p className="text-muted text-xs">&ldquo;What was revenue on 12 September?&rdquo;</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {TOOLS.map((t, i) => {
              const v = s.semantic ? TOOLS[0].value : t.value;
              return (
                <div
                  key={t.name}
                  className={cn(
                    "rounded-xl border px-3 py-3",
                    s.semantic
                      ? "border-good/40 bg-good/5"
                      : i === 0
                        ? "border-line bg-surface"
                        : "border-bad/40 bg-bad/5",
                  )}
                >
                  <p className="text-muted text-xs">{t.name}</p>
                  <motion.p
                    key={v}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-2xl"
                  >
                    ₹{v} lakh
                  </motion.p>
                  <p className="text-subtle mt-1 text-[11px]">
                    {s.semantic ? "uses the shared definition" : t.rule}
                  </p>
                </div>
              );
            })}
          </div>
          <AnimatePresence>
            {s.semantic && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Code>{METRIC}</Code>
                <p className="text-subtle mt-1 text-[10px]">
                  Simplified; each semantic layer has its own syntax.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              s.semantic ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            {s.semantic
              ? "One definition, every tool. Change the rule once and every dashboard, notebook and AI assistant follows."
              : "Three honest answers, three different numbers. The meeting is now about whose number is right."}
          </p>
        </div>
      }
    >
      <p>
        The data is right, yet the numbers disagree: each tool&apos;s author decided what
        &ldquo;revenue&rdquo; means. Cancelled orders? Refunds? Tax?
      </p>
      <p>
        A <Term id="semantic-layer">semantic layer</Term> defines each business metric once, next to
        the gold tables. BI tools, notebooks and AI assistants ask it for &ldquo;revenue by
        city&rdquo; and it writes the SQL.
      </p>
      <p className="text-muted text-sm">
        For speed, dashboards also lean on pre-aggregated gold tables, caches and materialised
        views, so a chart doesn&apos;t scan a year of raw orders every time it loads.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The time-travel trap ----------------------------------------------------------------------- */

const PEOPLE = [
  { name: "Priya", churned: true, asOf: 1, today: 0 },
  { name: "Arjun", churned: false, asOf: 4, today: 5 },
  { name: "Meera", churned: true, asOf: 3, today: 0 },
  { name: "Kabir", churned: false, asOf: 0, today: 2 },
  { name: "Ananya", churned: true, asOf: 0, today: 0 },
  { name: "Rohan", churned: false, asOf: 6, today: 7 },
];

/** A simple rule a model might learn: churn if 0–1 orders in the last 30 days. */
const predict = (orders: number) => orders <= 1;
const accuracy = (key: "asOf" | "today") =>
  Math.round((PEOPLE.filter((p) => predict(p[key]) === p.churned).length / PEOPLE.length) * 100);

export function PointInTime() {
  const [s, set] = useSceneState<ServingState>();
  const key = s.asOf ? "asOf" : "today";
  const trainAcc = accuracy(key);
  const prodAcc = accuracy("asOf");
  return (
    <StepLayout
      eyebrow="Serving ML"
      title="The time-travel trap"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.asOf ? "asof" : "today"}
            options={[
              ["today", "Join today's feature values"],
              ["asof", "Join values as of each label date"],
            ]}
            onChange={(v) => set({ asOf: v === "asof" })}
          />
          <div className="border-line overflow-x-auto rounded-xl border">
            <table className="w-full text-xs">
              <thead className="bg-surface-2 text-muted text-left">
                <tr>
                  <th className="px-3 py-1.5 font-normal">Customer</th>
                  <th className="px-3 py-1.5 font-normal">orders_last_30d</th>
                  <th className="px-3 py-1.5 font-normal">Rule predicts</th>
                  <th className="px-3 py-1.5 font-normal">Churned by 1 July? (label)</th>
                </tr>
              </thead>
              <tbody>
                {PEOPLE.map((p) => {
                  const v = p[key];
                  const ok = predict(v) === p.churned;
                  return (
                    <tr key={p.name} className="border-line border-t">
                      <td className="px-3 py-1.5">{p.name}</td>
                      <td className="px-3 py-1.5 font-mono">
                        <motion.span
                          key={`${p.name}${v}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {v}
                        </motion.span>
                      </td>
                      <td className={cn("px-3 py-1.5", ok ? "text-good" : "text-bad")}>
                        {predict(v) ? "churn" : "stays"} {ok ? "✓" : "✗"}
                      </td>
                      <td className="px-3 py-1.5">{p.churned ? "yes" : "no"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                !s.asOf ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Accuracy in training</p>
              <p className="font-mono text-xl">{trainAcc}%</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Accuracy on real customers next month</p>
              <p className="font-mono text-xl">{prodAcc}%</p>
            </div>
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              s.asOf ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            {s.asOf
              ? "Honest: the model is judged on what it could have known on 1 June, the same situation it will face in production."
              : "Too good to be true. Customers who left have no recent orders today because they left: the answer leaked into the feature. In production the model can't see the future, and does much worse."}
          </p>
          <Code>
            {
              '-- Point-in-time ("as of") join, DuckDB syntax\nSELECT l.customer_id, l.churned, f.orders_last_30d\nFROM labels l\nASOF JOIN features f\n  ON l.customer_id = f.customer_id\n AND l.label_date >= f.feature_date;'
            }
          </Code>
        </div>
      }
    >
      <p>
        To train a churn model, you pair each customer&apos;s <em>label</em> (did they leave by 1
        July?) with <em>features</em> such as their orders in the last 30 days, taken on 1 June.
      </p>
      <p>
        The easy mistake is joining the features as they are <em>today</em>. That&apos;s{" "}
        <Term id="data-leakage">data leakage</Term>: information from after the prediction date
        sneaks in.
      </p>
      <p className="text-muted text-sm">
        A <Term id="point-in-time">point-in-time join</Term> picks each feature&apos;s value as it
        was at the label date. <Term id="feature-store">Feature stores</Term> do this for you, and
        table time travel lets you retrain on exactly the same data later. Illustrative numbers.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint ------------------------------------------------------------------------------- */

export function LeakCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Spot the leak"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="leak"
            prompt="A fraud model scores 99% in training but only 70% on live transactions. Its features come from gold.customer_360, joined on customer_id. What's the most likely cause?"
            options={[
              {
                id: "leak",
                label:
                  "customer_360 holds today's values, including things that changed because of the fraud",
                correct: true,
                feedback:
                  "Right. For example, an account frozen after the fraud. Join the values as of each transaction's time instead.",
              },
              {
                id: "small",
                label: "The model is too small",
                feedback:
                  "A bigger model would fit the leaked signal even better, and still fail live.",
              },
              {
                id: "format",
                label: "The table should be Iceberg, not Delta",
                feedback: "The table format doesn't change which values you joined.",
              },
              {
                id: "gpu",
                label: "Training used different hardware from serving",
                feedback: "Hardware changes speed, not what the model learned.",
              },
            ]}
            explanation="A big gap between training and live accuracy is the classic sign of leakage. Always ask: could the model have known this value at prediction time?"
          />
        </div>
      }
    >
      <p>Use what you just saw.</p>
    </StepLayout>
  );
}
