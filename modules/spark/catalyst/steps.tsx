"use client";

import { motion } from "motion/react";
import { Navigation } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES, QUERY, ruleEffect } from "./model";
import type { CatState } from "./state";

/* 1 ─ The route planner --------------------------------------------------------------------------- */

export function SatNav() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The route planner"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted">You ask:</p>
            <p className="font-semibold">
              &ldquo;Take me to the station, via the bank, picking up groceries.&rdquo;
            </p>
          </div>
          <Navigation className="text-accent size-6" />
          <div className="border-accent bg-accent-soft w-full max-w-sm rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted">It plans:</p>
            <p>
              Groceries first (they&apos;re on the way), then the bank, then the station; avoid the
              flyover works.
            </p>
          </div>
        </div>
      }
    >
      <p>
        You tell a route planner where you want to go, not which turns to take. It checks the places
        exist, reorders the stops, avoids roadworks and picks the fastest roads. Same destination, a
        much better route.
      </p>
      <p>
        Spark&apos;s optimiser, <Term id="catalyst">Catalyst</Term>, does this for queries. Because
        Spark is lazy (module 4), it sees your whole query before running anything, and rewrites it.
        Both SQL and DataFrame code go through it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Through the optimiser ⭐ -------------------------------------------------------------------- */

export function StepCatalyst() {
  const [s, set] = useSceneState<CatState>();
  const f = FRAMES[Math.min(s.frame ?? 0, FRAMES.length - 1)];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Through the optimiser"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{QUERY}</Code>
          <Stepper
            step={s.frame ?? 0}
            count={FRAMES.length}
            onChange={(n) => set({ frame: n })}
            label={f.phase}
          />
          <div className="border-line bg-surface min-h-36 rounded-xl border px-4 py-3">
            {f.tree.map(([d, line, mark], i) => (
              <motion.p
                key={`${s.frame}-${i}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "font-mono text-[11px]",
                  mark === "new" && "text-good",
                  mark === "moved" && "text-viz-meta",
                  mark === "warn" && "text-viz-compute",
                )}
                style={{ paddingLeft: `${d * 12}px` }}
              >
                {d > 0 ? "└ " : ""}
                {line}
              </motion.p>
            ))}
          </div>
          <FrameCaption frameKey={s.frame ?? 0} title={f.title}>
            {f.text}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Trees simplified. Green: new or rewritten; purple: moved; amber: not yet known.
          </p>
        </div>
      }
    >
      <p>
        Step one query through Catalyst. Its designers described four phases: &ldquo;(1) analyzing a
        logical plan to resolve references, (2) logical plan optimization, (3) physical planning,
        and (4) code generation&rdquo;, after parsing turns your text into a tree.
      </p>
      <p>
        The <Term id="logical-plan">logical plan</Term> says what to compute; the{" "}
        <Term id="physical-plan">physical plan</Term> says how, down to which join algorithm. In the
        physical phase Catalyst can generate several plans and compare them; the other phases are
        rule based.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Switch the rules off ------------------------------------------------------------------------ */

export function RulesOff() {
  const [s, set] = useSceneState<CatState>();
  const r = ruleEffect(s.pushdown, s.pruning);
  const toggle = (k: "pushdown" | "pruning", label: string) => (
    <label className="flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        checked={s[k]}
        onChange={(e) => set({ [k]: e.target.checked } as Partial<CatState>)}
        className="accent-accent"
      />
      {label}
    </label>
  );
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Switch the rules off"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {toggle("pushdown", "Predicate pushdown: filter customers before the join")}
          {toggle("pruning", "Column pruning: read only the columns the query uses")}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["customer rows into the join", `${r.customersRows} M`],
              ["orders columns read", `${r.ordersCols} of 12`],
              ["customers columns read", `${r.custCols} of 9`],
              ["data read", `${r.gb} GB`],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <div className="bg-surface-2 h-3 rounded-full">
            <motion.div
              className="bg-viz-remove h-full rounded-full"
              animate={{ width: `${(r.gb / 86) * 100}%` }}
            />
          </div>
          <p className="text-subtle text-[10px]">
            An illustrative 80 GB orders table and 6 GB customers table in Parquet.
          </p>
        </div>
      }
    >
      <p>
        Two of the most valuable rules. <Term id="predicate-pushdown">Predicate pushdown</Term>{" "}
        moves a filter as close to the data as possible, even into the file reader.{" "}
        <Term id="column-pruning">Column pruning</Term> drops columns nothing uses, which with
        columnar files like Parquet means never reading them.
      </p>
      <p>
        You can&apos;t really switch these off, and wouldn&apos;t want to. But you can defeat them
        by accident, for example by hiding a filter inside a Python function Spark can&apos;t look
        into (module 18).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Reading explain() --------------------------------------------------------------------------- */

const MODES: [string, string][] = [
  ['explain() or "simple"', "Only the physical plan."],
  ['"extended"', "Parsed, analysed and optimised logical plans, then the physical plan."],
  ['"formatted"', "A physical plan outline plus details for each node. The most readable."],
  ['"cost"', "The logical plan with size statistics, if available."],
  ['"codegen"', "The generated code, if any."],
];

export function ReadExplain() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading explain()"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`df.explain("formatted")
# or in SQL:
EXPLAIN FORMATTED SELECT ...`}</Code>
          <div className="flex flex-col gap-1.5">
            {MODES.map(([m, d]) => (
              <div
                key={m}
                className="border-line bg-surface grid grid-cols-[8.5rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-xs"
              >
                <span className="font-mono">{m}</span>
                <span className="text-muted">{d}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        You can see every plan Catalyst produces. Read them bottom up, look for{" "}
        <span className="font-mono">PushedFilters</span> on scans, check which join was chosen, and
        count the <span className="font-mono">Exchange</span> nodes: each one is a shuffle (module
        9).
      </p>
      <p>
        One more setting worth knowing: full cost-based optimisation (spark.sql.cbo.enabled) is off
        by default and needs table statistics from ANALYZE TABLE. Spark still makes size-based
        choices, such as broadcasting small tables, and adjusts plans at runtime with Adaptive Query
        Execution (module 11).
      </p>
    </StepLayout>
  );
}

/* 5 ─ In what order? ------------------------------------------------------------------------------ */

export function PhaseOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="In what order?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="catalyst-order"
            prompt="Put Catalyst's steps in order."
            items={[
              {
                id: "parse",
                label: "Parse the SQL or DataFrame code into an unresolved logical plan",
              },
              { id: "analyse", label: "Resolve tables, columns and types using the catalog" },
              {
                id: "optimise",
                label: "Apply rules: fold constants, push down filters, prune columns",
              },
              { id: "physical", label: "Choose physical operators, such as which join to use" },
              { id: "codegen", label: "Generate compact code for executors to run" },
            ]}
            explanation="Parse, analyse, optimise, plan physically, generate code. Errors about unknown columns come from analysis, before any data is read."
          />
        </div>
      }
    >
      <p>Arrange the phases.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["You say what, Catalyst decides how", "For SQL and DataFrames alike."],
  ["Four phases after parsing", "Analyse, optimise, physical plan, generate code."],
  ["Pushdown and pruning", "Read less data: the biggest wins."],
  ["Read the plan", 'explain("formatted"), bottom up.'],
  ["Don't hide logic", "Opaque functions block the optimiser."],
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
      <p>
        Next: what happens when the physical plan runs, in jobs, stages and tasks, seen through the
        Spark UI.
      </p>
    </StepLayout>
  );
}
