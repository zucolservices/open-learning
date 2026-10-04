"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  CHANGE_RECORDED,
  CHANGE_VALID,
  DAY_MAX,
  INF,
  INVOICE_DAY,
  MONTHS,
  SQL_APP,
  SQL_SYSTEM,
  VERSIONS,
  dayLabel,
  priceAt,
} from "./model";
import type { TimeState } from "./state";

/* 1 ─ The backdated pay rise ---------------------------------------------------------------------- */

export function Payslip() {
  const steps: [string, string][] = [
    ["25 Feb", "Payroll runs. Sally is paid at her old salary."],
    ["15 Mar", "HR mentions she got a raise, effective 15 February."],
    ["Today", "What was her salary on 25 February? It depends what you mean."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="The backdated pay rise"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {steps.map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span>{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Martin Fowler tells this story: payroll runs on 25 February. On 15 March, HR reveals a pay
        rise that took effect on 15 February. What was the salary on 25 February? What was true
        then, or what the system said then?
      </p>
      <p>
        Both answers matter. One clock records <Term id="valid-time">valid time</Term>, when
        something was true in the world. The other records{" "}
        <Term id="transaction-time">transaction time</Term>, when the database learned it. Keep both
        and the model is <Term id="bitemporal">bitemporal</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Two clocks ⭐ ------------------------------------------------------------------------------- */

const W = 300;
const H = 200;
const x = (d: number) => 30 + (Math.min(d, DAY_MAX) / DAY_MAX) * (W - 40);
const y = (d: number) => H - 25 - (Math.min(d, DAY_MAX) / DAY_MAX) * (H - 40);

export function TwoClocks() {
  const [s, set] = useSceneState<TimeState>();
  const answer = priceAt(s.valid, s.known);
  const truth = priceAt(s.valid, DAY_MAX);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Two clocks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="A plane of valid time against recorded time, shaded by price"
            >
              {VERSIONS.map((v, i) => (
                <rect
                  key={i}
                  x={x(v.validFrom)}
                  y={y(Math.min(v.recTo, DAY_MAX))}
                  width={x(Math.min(v.validTo, DAY_MAX)) - x(v.validFrom)}
                  height={y(v.recFrom) - y(Math.min(v.recTo, DAY_MAX))}
                  className={
                    v.price === 120
                      ? "fill-viz-data/25 stroke-viz-data"
                      : "fill-viz-compute/30 stroke-viz-compute"
                  }
                  strokeWidth={0.8}
                />
              ))}
              <text x={x(15)} y={y(30)} className="fill-fg text-[9px]">
                ₹120
              </text>
              <text x={x(15)} y={y(100)} className="fill-fg text-[9px]">
                ₹120
              </text>
              <text x={x(85)} y={y(100)} className="fill-fg text-[9px]">
                ₹130
              </text>
              {MONTHS.map(([d, l]) => (
                <g key={l}>
                  <text x={x(d)} y={H - 10} className="fill-muted text-[7px]">
                    {l}
                  </text>
                  <text x={2} y={y(d) + 2} className="fill-muted text-[7px]">
                    {l.split(" ")[1]}
                  </text>
                </g>
              ))}
              <text x={W - 10} y={H - 2} textAnchor="end" className="fill-muted text-[7px]">
                valid time → (true in the world)
              </text>
              <text x={30} y={10} className="fill-muted text-[7px]">
                ↑ recorded time (when we knew)
              </text>
              <line
                x1={x(INVOICE_DAY)}
                y1={y(0)}
                x2={x(INVOICE_DAY)}
                y2={y(DAY_MAX)}
                className="stroke-line-strong"
                strokeDasharray="2 2"
              />
              <circle
                cx={x(s.valid)}
                cy={y(s.known)}
                r={5}
                className="fill-accent stroke-surface"
                strokeWidth={1.5}
              />
            </svg>
            <div className="flex flex-col gap-2 text-xs">
              <label className="flex flex-col gap-1">
                <span className="text-muted">
                  price on (valid time):{" "}
                  <span className="text-fg font-mono">{dayLabel(s.valid)}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={DAY_MAX - 1}
                  value={s.valid}
                  onChange={(e) => set({ valid: Number(e.target.value) })}
                  className="accent-accent"
                  aria-label="Valid date"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-muted">
                  as we knew it on (recorded time):{" "}
                  <span className="text-fg font-mono">{dayLabel(s.known)}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={DAY_MAX - 1}
                  value={s.known}
                  onChange={(e) => set({ known: Number(e.target.value) })}
                  className="accent-accent"
                  aria-label="Recorded date"
                />
              </label>
              <motion.div
                key={`${answer}-${truth}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-accent bg-accent-soft rounded-xl border px-3 py-2"
              >
                <p className="text-sm font-semibold">₹{answer ?? "?"}</p>
                <p className="text-muted text-[11px]">
                  {s.known < s.valid
                    ? "Asking about a date we hadn't reached yet: this is the price we expected."
                    : answer !== truth
                      ? `We later learned it was really ₹${truth}.`
                      : "What we knew then matches what we know now."}
                </p>
              </motion.div>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => set({ valid: INVOICE_DAY, known: INVOICE_DAY })}
                  className="border-line rounded-full border px-2 py-0.5 text-[10px]"
                >
                  25 Feb, as known on 25 Feb
                </button>
                <button
                  type="button"
                  onClick={() => set({ valid: INVOICE_DAY, known: 100 })}
                  className="border-line rounded-full border px-2 py-0.5 text-[10px]"
                >
                  25 Feb, as known today
                </button>
              </div>
            </div>
          </div>
          <div className="border-line overflow-x-auto rounded-lg border font-mono text-[10px]">
            <div className="bg-surface-2 grid min-w-[26rem] grid-cols-5 gap-2 px-2 py-1 font-semibold">
              <span>price</span>
              <span>valid_from</span>
              <span>valid_to</span>
              <span>recorded_from</span>
              <span>recorded_to</span>
            </div>
            {VERSIONS.map((v, i) => (
              <div
                key={i}
                className={cn(
                  "border-line grid min-w-[26rem] grid-cols-5 gap-2 border-t px-2 py-0.5",
                  v.price === answer &&
                    v.validFrom <= s.valid &&
                    s.valid < v.validTo &&
                    v.recFrom <= s.known &&
                    s.known < v.recTo &&
                    "bg-accent-soft",
                )}
              >
                <span>₹{v.price}</span>
                <span>{dayLabel(v.validFrom)}</span>
                <span>{v.validTo === INF ? "∞" : dayLabel(v.validTo)}</span>
                <span>{dayLabel(v.recFrom)}</span>
                <span>{v.recTo === INF ? "∞" : dayLabel(v.recTo)}</span>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            A chai price that really rose on {dayLabel(CHANGE_VALID)}, entered on{" "}
            {dayLabel(CHANGE_RECORDED)}. Made-up example.
          </p>
        </div>
      }
    >
      <p>
        The same story with a price: chai went up to ₹130 on 15 February, but nobody entered it
        until 15 March. Move the two sliders, or tap the two questions, and watch the point move
        across the plane.
      </p>
      <p>
        The correction didn&apos;t overwrite anything. The old row was closed in recorded time, and
        two new rows describe what we now believe. So you can answer both &ldquo;what was
        true?&rdquo; and &ldquo;what did the invoices use?&rdquo;: the second is what an auditor
        asks.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Temporal tables in SQL ---------------------------------------------------------------------- */

export function TemporalSql() {
  const [s, set] = useSceneState<TimeState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Temporal tables in SQL"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {[
              [true, "system-versioned (recorded time)"],
              [false, "application time (valid time)"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.sys === v}
                onClick={() => set({ sys: v as boolean })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.sys === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
          </div>
          <Code>{s.sys ? SQL_SYSTEM : SQL_APP}</Code>
          <p className="text-subtle text-[10px]">Simplified; exact syntax varies by database.</p>
        </div>
      }
    >
      <p>
        The SQL:2011 standard (December 2011) added both clocks. System-versioned tables keep every
        past version automatically, for audit; application-time period tables store when facts are
        true, which you supply. Combine them and you have what the literature calls a bitemporal
        table.
      </p>
      <p>
        SQL Server has system-versioned tables since 2016 and MariaDB since 10.3. PostgreSQL 18 adds
        temporal constraints (no overlapping periods) but not system versioning. The terms come from
        Richard Snodgrass, whose 1999 book on time in SQL is free online.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Snapshots and events ------------------------------------------------------------------------ */

export function SnapshotsEvents() {
  const rows: [string, string, string][] = [
    [
      "Current state",
      "One row per thing, overwritten. Simple, but the past is gone.",
      "SCD type 1",
    ],
    [
      "Versions with dates",
      "A row per version with valid_from and valid_to: one clock.",
      "SCD type 2, application time",
    ],
    [
      "Snapshots",
      "The state copied at regular intervals: quick to read for any period end.",
      "periodic snapshot facts",
    ],
    [
      "Events",
      "Every change stored as it happened; any state can be rebuilt by replaying.",
      "transaction facts, event logs",
    ],
    ["Both clocks", "Versions with valid and recorded periods.", "bitemporal tables"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Snapshots and events"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {rows.map(([t, d, e], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[8rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span>
                {d} <span className="text-muted">({e})</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Time keeps appearing in this track. Each technique answers a different question about the
        past, from &ldquo;none&rdquo; (overwrite) to &ldquo;everything, from both points of
        view&rdquo; (bitemporal).
      </p>
      <p>
        Pick the simplest one that answers the questions people will actually ask, and the audits
        you&apos;ll actually face.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which clock? -------------------------------------------------------------------------------- */

export function WhichClock() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which clock?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-clock"
            prompt="Is each about valid time or recorded (transaction) time?"
            categories={[
              { id: "valid", label: "Valid time" },
              { id: "rec", label: "Recorded time" },
            ]}
            items={[
              {
                id: "moved",
                label: "The day a customer actually moved house",
                category: "valid",
                why: "When it was true in the world.",
              },
              {
                id: "saved",
                label: "The moment the new address was saved",
                category: "rec",
                why: "When the database learned it.",
              },
              {
                id: "policy",
                label: "An insurance policy covering 1 January to 31 December",
                category: "valid",
                why: "A period of real-world truth.",
              },
              {
                id: "audit",
                label: "An auditor asks what the system showed on 1 March",
                category: "rec",
                why: "What we knew then.",
              },
              {
                id: "raise",
                label: "A pay rise effective 15 February",
                category: "valid",
                why: "Effective dates are valid time.",
              },
            ]}
            explanation="Valid time is when something was true in the world; recorded time is when the database knew it. Bitemporal models keep both."
          />
        </div>
      }
    >
      <p>Sort the dates.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Valid time", "When it was true: effective dates."],
  ["Recorded time", "When we knew: for audit and reproducibility."],
  ["Bitemporal", "Both; corrections never overwrite."],
  ["SQL:2011", "Application-time and system-versioned tables."],
  ["Simplest that works", "From overwrite to both clocks."],
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
      <p>Next: naming, documenting and changing a model without breaking the people who use it.</p>
    </StepLayout>
  );
}
