"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { INMON, KIMBALL, MONTHS, PROPS, TIMELINE, firstReport, type Piece } from "./model";
import type { IKState } from "./state";

/* 1 ─ Two ways to build a town -------------------------------------------------------------------- */

export function TwoBuilders() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Two ways to build a town"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Roads, pipes and power first",
              "Lay the whole town's infrastructure, then build houses on it. Nobody moves in for a while, but everything connects.",
            ],
            [
              "One street at a time",
              "Agree on standard pipe sizes and road widths, then finish one street and let people move in, then the next.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-4"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You can build a town by laying every road and pipe first, then the houses. Or you can agree
        the standards and finish it a street at a time. Both can end with the same town.
      </p>
      <p>
        The two classic ways to build an{" "}
        <Term id="enterprise-data-warehouse">enterprise data warehouse</Term> are like that. Bill
        Inmon&apos;s starts with an integrated, normalised warehouse and builds{" "}
        <Term id="data-mart">data marts</Term> on it. Ralph Kimball&apos;s builds dimensional stars
        process by process, joined by conformed dimensions.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One warehouse, two plans ⭐ ----------------------------------------------------------------- */

const KIND: Record<Piece["kind"], string> = {
  edw: "bg-viz-meta",
  mart: "bg-viz-data",
  star: "bg-viz-data",
  dims: "bg-viz-compute",
};

function Lane({ title, pieces, month }: { title: string; pieces: Piece[]; month: number }) {
  const fr = firstReport(pieces);
  const delivered = pieces.filter(
    (p) => (p.kind === "mart" || p.kind === "star") && p.end <= month,
  );
  return (
    <div className="border-line bg-surface rounded-xl border px-3 py-2">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold">{title}</span>
        <span className="text-muted">first report: month {fr}</span>
      </div>
      <div className="relative mt-2 flex flex-col gap-1">
        {pieces.map((p) => {
          const done = Math.max(0, Math.min(1, (month - p.start) / (p.end - p.start)));
          return (
            <div key={p.name} className="relative h-4">
              <div
                className="bg-surface-2 absolute h-full rounded"
                style={{
                  left: `${(p.start / MONTHS) * 100}%`,
                  width: `${((p.end - p.start) / MONTHS) * 100}%`,
                }}
              >
                <motion.div
                  animate={{ width: `${done * 100}%` }}
                  className={cn("h-full rounded", KIND[p.kind])}
                />
              </div>
              <span
                className="absolute top-0 text-[9px] leading-4 whitespace-nowrap"
                style={
                  p.start / MONTHS > 0.5
                    ? { right: `calc(${100 - (p.end / MONTHS) * 100}% + 4px)` }
                    : { left: `calc(${(p.start / MONTHS) * 100}% + 4px)` }
                }
              >
                {p.name}
              </span>
            </div>
          );
        })}
        <div
          className="bg-accent absolute top-0 bottom-0 w-0.5"
          style={{ left: `${(month / MONTHS) * 100}%` }}
        />
      </div>
      <p className="text-muted mt-2 text-[11px]">
        Usable by month {month}:{" "}
        {delivered.length ? delivered.map((d) => d.name).join(", ") : "nothing yet"}
      </p>
    </div>
  );
}

export function BuildRace() {
  const [s, set] = useSceneState<IKState>();
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="One warehouse, two plans"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted">month</span>
            <input
              type="range"
              min={0}
              max={MONTHS}
              value={s.month}
              onChange={(e) => set({ month: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Month"
            />
            <span className="w-8 font-mono font-semibold">{s.month}</span>
          </div>
          <Lane title="Inmon: Corporate Information Factory" pieces={INMON} month={s.month} />
          <Lane title="Kimball: dimensional bus" pieces={KIMBALL} month={s.month} />
          <div className="text-muted flex flex-wrap gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="bg-viz-meta size-2 rounded-sm" /> normalised enterprise warehouse
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-viz-compute size-2 rounded-sm" /> conformed dimensions
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-viz-data size-2 rounded-sm" /> marts / stars people can query
            </span>
          </div>
          <p className="text-subtle text-[10px]">
            An illustrative plan for one retailer; real projects vary widely.
          </p>
        </div>
      }
    >
      <p>
        Drag through a year. In the{" "}
        <Term id="corporate-information-factory">Corporate Information Factory</Term>, coordinated
        extracts load a third-normal-form warehouse of atomic data first; departmental marts with
        dimensional summaries are built from it.
      </p>
      <p>
        Kimball&apos;s plan delivers one business process at a time, but agrees the conformed
        dimensions up front, so the pieces fit. The Kimball Group rejects the common
        &ldquo;bottom-up&rdquo; label for exactly that reason: the bus matrix is an enterprise plan.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Inmon's four words -------------------------------------------------------------------------- */

export function FourWords() {
  const [s, set] = useSceneState<IKState>();
  const p = PROPS[s.prop] ?? PROPS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Inmon's four words"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-2">
            {PROPS.map(([t], i) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.prop === i}
                onClick={() => set({ prop: i })}
                className={cn(
                  "rounded-xl border px-3 py-3 text-sm font-semibold",
                  s.prop === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <motion.div
            key={p[0]}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
          >
            <p>{p[1]}</p>
            <p className="text-muted mt-1">e.g. {p[2]}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Inmon&apos;s often-quoted definition calls a data warehouse a subject-oriented, integrated,
        time-variant and non-volatile collection of data supporting management&apos;s decisions. The
        exact wording varies between sources; the four words don&apos;t.
      </p>
      <p>
        Both camps agree with all four. Where they differ is in the shape of the data that delivers
        them.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where the ideas came from ------------------------------------------------------------------- */

export function Timeline() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where the ideas came from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {TIMELINE.map(([y, t], i) => (
            <motion.div
              key={y}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[4rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{y}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Inmon is often called the father of data warehousing, but the idea had a head start:
        IBM&apos;s Devlin and Murphy described a business data warehouse in 1988.
      </p>
      <p>
        It isn&apos;t a war with a winner. Kimball&apos;s colleague Margy Ross wrote that the real
        difference is whether a normalised layer is required before the dimensional one, and that
        storing the same data twice is usually unwarranted. Modern layered designs (raw, cleaned,
        then marts) borrow from both.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Inmon, Kimball or both? --------------------------------------------------------------------- */

export function WhoSaid() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Inmon, Kimball or both?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="inmon-kimball"
            prompt="Which approach does each describe?"
            categories={[
              { id: "inmon", label: "Inmon / CIF" },
              { id: "kimball", label: "Kimball" },
              { id: "both", label: "Both" },
            ]}
            items={[
              {
                id: "3nf",
                label: "A normalised enterprise warehouse loaded before any marts",
                category: "inmon",
                why: "The CIF's central 3NF layer.",
              },
              {
                id: "process",
                label: "Dimensional models built by business process",
                category: "kimball",
                why: "Not by department.",
              },
              {
                id: "dept",
                label: "Marts tailored to each department",
                category: "inmon",
                why: "CIF marts by business function.",
              },
              {
                id: "bus",
                label: "A bus matrix of conformed dimensions",
                category: "kimball",
                why: "Kimball's enterprise plan.",
              },
              {
                id: "integrated",
                label: "Integrated data from many source systems, with history",
                category: "both",
                why: "Both want an integrated, time-variant warehouse.",
              },
            ]}
            explanation="Both aim for an integrated warehouse with history. Inmon puts a normalised layer first and builds departmental marts; Kimball builds dimensional stars per process tied by conformed dimensions."
          />
        </div>
      }
    >
      <p>Sort the statements.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Four words", "Subject-oriented, integrated, time-variant, non-volatile."],
  ["Inmon / CIF", "Normalised EDW first, departmental marts from it."],
  ["Kimball", "Stars per process, conformed dimensions, bus matrix."],
  ["Not bottom-up", "The bus is an enterprise plan, delivered in pieces."],
  ["Hybrids today", "Layered designs borrow from both."],
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
      <p>Next: Data Vault, a third approach built for change and auditability.</p>
    </StepLayout>
  );
}
