"use client";

import { motion } from "motion/react";
import { BookOpen, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGELOG, PAYMENTS, WITHIN, loginNear, stateCurve, tableAt, tierAt } from "./data";
import type { JoinState } from "./state";

/* 1 ─ The cashier's register ------------------------------------------------------------------- */

export function Cashier() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The cashier's register"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <BookOpen className="text-accent size-5" />
            <p className="mt-1 font-semibold">A register of customers</p>
            <p className="text-muted text-sm">
              When a cheque arrives, the cashier looks up the customer&apos;s details. Address
              changes update the register, but don&apos;t make the cashier do anything else.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <p className="font-semibold">A tray of recent slips</p>
            <p className="text-muted text-sm">
              To match each withdrawal with an ID check from the last five minutes, the cashier
              keeps recent ID slips in a tray and clears out anything older.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Filtering and mapping need no memory. Counting, de-duplicating and joining do. A stream
        processor keeps that memory as <Term id="state-store">state</Term>, next to the code, so
        lookups are fast.
      </p>
      <p>
        The register is a table joined to a stream of cheques; the tray is a window over another
        stream. Both are state, and both need managing.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Streams and tables ⭐ ---------------------------------------------------------------------- */

export function Duality() {
  const [s, set] = useSceneState<JoinState>();
  const table = tableAt(s.upTo);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Streams and tables"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="text-muted text-xs">Changelog stream (customer tiers)</p>
            {CHANGELOG.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => set({ upTo: i + 1 })}
                className={cn(
                  "rounded-md border px-2 py-1 text-left font-mono text-[11px]",
                  i < s.upTo
                    ? c.tier === null
                      ? "border-viz-remove bg-viz-remove/10"
                      : "border-accent bg-accent-soft"
                    : "border-line text-subtle",
                )}
              >
                t={c.t} · {c.key} → {c.tier ?? "null (delete)"}
              </button>
            ))}
            <input
              type="range"
              min={0}
              max={CHANGELOG.length}
              value={s.upTo}
              onChange={(e) => set({ upTo: Number(e.target.value) })}
              className="accent-accent mt-1"
              aria-label="Changelog position"
            />
          </div>
          <div>
            <p className="text-muted mb-1 text-xs">
              Table after {s.upTo} change{s.upTo === 1 ? "" : "s"}
            </p>
            <div className="border-line bg-surface rounded-xl border">
              {Object.keys(table).length === 0 && (
                <p className="text-muted px-3 py-2 text-xs">empty</p>
              )}
              {Object.entries(table).map(([k, v]) => (
                <motion.div
                  key={k}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-line flex justify-between border-b px-3 py-1.5 font-mono text-xs last:border-0"
                >
                  <span>{k}</span>
                  <span className="text-accent">{v}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Kafka&apos;s docs describe a <Term id="stream-table-duality">duality</Term>: a stream can be
        read as the changelog of a table, and a table as a snapshot of a stream&apos;s latest value
        per key. Move through the changelog and watch the table build up; meera&apos;s null deletes
        her row.
      </p>
      <p>
        That is also how state survives a crash. Kafka Streams keeps each state store in RocksDB on
        local disk (by default) and copies every change to a compacted changelog topic. A new
        instance replays it to rebuild the table; standby replicas (0 by default, 1 recommended)
        keep a warm copy ready.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Join payments to customers and logins ⭐ ---------------------------------------------------- */

export function JoinIt() {
  const [s, set] = useSceneState<JoinState>();
  const rows = PAYMENTS.map((p) => {
    if (s.join === "table") {
      const tier = tierAt(p.user, p.t);
      return { p, match: tier, label: tier ? `tier ${tier}` : "no customer row" };
    }
    const l = loginNear(p.user, p.t);
    return { p, match: l, label: l ? `login at t=${l.t}` : `no login within ${WITHIN} min` };
  });
  return (
    <StepLayout
      eyebrow="Simulation · illustrative events"
      title="Join payments to customers and logins"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <Segmented
              size="sm"
              value={s.join}
              options={[
                ["table", "Stream–table: customer tier"],
                ["window", `Stream–stream: login ±${WITHIN} min`],
              ]}
              onChange={(v) => set({ join: v })}
            />
            <Segmented
              size="sm"
              value={s.kind}
              options={[
                ["inner", "Inner join"],
                ["left", "Left join"],
              ]}
              onChange={(v) => set({ kind: v })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {rows.map(({ p, match, label }) => {
              const dropped = !match && s.kind === "inner";
              return (
                <motion.div
                  key={`${p.t}-${s.join}-${s.kind}`}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: dropped ? 0.4 : 1, x: 0 }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                    match
                      ? "border-line bg-surface"
                      : dropped
                        ? "border-line border-dashed"
                        : "border-bad/50 bg-bad/10",
                  )}
                >
                  {match ? (
                    <Check className="text-good size-3.5" />
                  ) : (
                    <X className="text-bad size-3.5" />
                  )}
                  <span className="w-12 font-mono">t={p.t}</span>
                  <span className="w-14">{p.user}</span>
                  <span className="w-20 font-mono">₹{p.amount.toLocaleString("en-IN")}</span>
                  <span className={cn("flex-1", !match && "text-bad")}>
                    {dropped ? "dropped (inner join)" : label}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <p className="text-muted text-[11px]">
            {s.join === "table"
              ? "Each payment looks up the table as it is when the payment is processed: asha's t=4 payment sees silver, her t=13 payment sees gold. meera was deleted at t=11, so the lookup at t=10 still finds her."
              : "meera's ₹52,000 payment and asha's ₹300 one have no login within five minutes. An inner join drops them; a left join keeps them with an empty match, which is exactly what a fraud team wants to see."}
          </p>
        </div>
      }
    >
      <p>
        Four payments, joined two ways. A <Term id="stream-table-join">stream–table join</Term>{" "}
        enriches each payment with the customer&apos;s current tier. Only payments trigger it: a
        tier change just updates the table. A{" "}
        <Term id="stream-stream-join">stream–stream join</Term> pairs each payment with a login from
        the same user within five minutes, so both sides must be kept in state for that long.
      </p>
      <p>
        Both sides must be partitioned the same way (same key, same partition count) so matching
        records meet. Kafka Streams&apos; GlobalKTable avoids that by copying a small table to every
        instance. For correct results with out-of-order data, Kafka 3.5 added versioned tables that
        answer &ldquo;what was the value at the payment&apos;s time?&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Watch the state grow ⭐ -------------------------------------------------------------------- */

export function GrowingState() {
  const [s, set] = useSceneState<JoinState>();
  const curve = stateCurve(s.minutes, s.bounded);
  const max = Math.max(...stateCurve(120, false));
  return (
    <StepLayout
      eyebrow="Simulation · illustrative rates"
      title="Watch the state grow"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.bounded ? "bounded" : "unbounded"}
            options={[
              ["bounded", `Window of ${WITHIN} min (or a TTL)`],
              ["unbounded", "No window, no TTL"],
            ]}
            onChange={(v) => set({ bounded: v === "bounded" })}
          />
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-20 shrink-0">Running for</span>
            <input
              type="range"
              min={10}
              max={120}
              step={10}
              value={s.minutes}
              onChange={(e) => set({ minutes: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-16 text-right font-mono">{s.minutes} min</span>
          </label>
          <div className="flex h-40 items-end gap-px">
            {curve.map((v, i) => (
              <div
                key={i}
                className={cn("flex-1 rounded-t-sm", s.bounded ? "bg-accent/60" : "bg-bad/60")}
                style={{ height: `${Math.max(1, (v / max) * 100)}%` }}
              />
            ))}
          </div>
          <p className="text-sm">
            Records held in state now:{" "}
            <span className="font-mono font-semibold">
              {curve[curve.length - 1].toLocaleString("en-IN")}
            </span>
            <span className="text-muted">
              {" "}
              {s.bounded ? "(flat: old records expire)" : "(grows forever)"}
            </span>
          </p>
        </div>
      }
    >
      <p>
        A join that may match any record from any time has to keep every record forever. Bound it
        with a window, or with a time-to-live that expires old state, and it levels off.
      </p>
      <p>
        Engines warn about this. Flink SQL&apos;s regular joins keep state unless you set{" "}
        <code className="font-mono text-xs">table.exec.state.ttl</code>, which defaults to 0,
        meaning never cleaned (Flink&apos;s TTL works on processing time only). Spark needs a
        watermark and a time limit on outer stream–stream joins, and warns that otherwise inner-join
        state &ldquo;will keep growing indefinitely&rdquo;. Real state does get big: Shopify reports
        one Flink app with over 8 TB.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which join? ------------------------------------------------------------------------------ */

export function WhichJoin() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which join?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-join"
            prompt="Which join fits each need?"
            categories={[
              { id: "st", label: "Stream–table" },
              { id: "ss", label: "Stream–stream (windowed)" },
              { id: "tt", label: "Table–table" },
            ]}
            items={[
              {
                id: "enrich",
                label: "Add the product name and price to every order event",
                category: "st",
                why: "Look up current product details as each order arrives.",
              },
              {
                id: "clickbuy",
                label: "Match each ad click with a purchase in the next 30 minutes",
                category: "ss",
                why: "Both are event streams; the window bounds the state.",
              },
              {
                id: "fk",
                label: "Keep an up-to-date view of each order with its customer's latest address",
                category: "tt",
                why: "Both sides change over time; a (foreign-key) table–table join keeps the view current.",
              },
              {
                id: "fraud",
                label: "Flag payments with no login from the same user within 5 minutes",
                category: "ss",
                why: "A left stream–stream join keeps payments that found no login.",
              },
              {
                id: "fx",
                label: "Convert each payment to rupees using the current exchange-rate table",
                category: "st",
                why: "Each payment looks up the rate; rate changes alone produce nothing.",
              },
            ]}
            explanation="Events meeting reference data: stream–table. Events meeting events: a windowed stream–stream join. Changing data meeting changing data: table–table."
          />
        </div>
      }
    >
      <p>Five needs, three kinds of join.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["State is memory", "Counts, dedupes and joins keep it next to the code."],
  ["Streams ⇄ tables", "A table is the latest value per key of a changelog."],
  ["Join types", "Stream–table lookups; windowed stream–stream; table–table."],
  ["Bound your state", "Windows, TTLs and retention, or it grows forever."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Next: keeping that state safe through crashes, with checkpoints and exactly-once processing.
      </p>
    </StepLayout>
  );
}
