"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { INDEXES, QUERIES, plan, type Ix } from "./model";
import type { UiState } from "./state";

/* 1 ─ Sorted by surname --------------------------------------------------------------------------- */

export function PhoneBook() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Sorted by surname"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 font-mono text-xs">
            {[
              "Iyer, Anand",
              "Iyer, Priya",
              "Kumar, Ravi",
              "Sharma, Meera",
              "Sharma, Priya",
              "Sharma, Rohit",
              "Verma, Asha",
            ].map((n, i) => (
              <p
                key={n}
                className={cn(
                  n.startsWith("Sharma") && "text-accent font-semibold",
                  n.endsWith("Priya") && "underline decoration-dotted",
                )}
              >
                {i + 1}. {n}
              </p>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="border-good/40 bg-good/5 rounded-lg border px-3 py-2 text-xs">
              Every Sharma: jump straight there. They&apos;re together.
            </p>
            <p className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-2 text-xs">
              Everyone called Priya: read the whole book. They&apos;re scattered.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A phone book sorted by surname, then first name, is perfect for finding every Sharma, and
        for finding Priya Sharma. It&apos;s useless for finding every Priya: they&apos;re spread
        through the whole book.
      </p>
      <p>
        A <Term id="composite-index">composite index</Term> on several columns works the same way.
        PostgreSQL&apos;s docs: it &ldquo;is most efficient when there are constraints on the
        leading (leftmost) columns&rdquo;. Column order is a design decision.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One index, four queries ⭐ ------------------------------------------------------------------ */

export function PickIndex() {
  const [s, set] = useSceneState<UiState>();
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One index, four queries"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(INDEXES) as Ix[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.ix === k}
                onClick={() => set({ ix: k })}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[11px]",
                  s.ix === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {INDEXES[k].label}
              </button>
            ))}
          </div>
          <Code>{INDEXES[s.ix].sql}</Code>
          <div className="flex flex-col gap-1.5">
            {QUERIES.map((q) => {
              const r = plan(s.ix, q.id);
              return (
                <motion.div
                  key={q.id + s.ix}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    r.good ? "border-good/50 bg-good/5" : "border-bad/40 bg-bad/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-xs font-semibold">
                      {r.good ? (
                        <Check className="text-good size-3.5" />
                      ) : (
                        <X className="text-bad size-3.5" />
                      )}
                      {q.label}
                    </p>
                    <span className="text-muted shrink-0 font-mono text-[10px]">
                      {r.pages.toLocaleString("en-IN")} pages
                    </span>
                  </div>
                  <p className="text-muted font-mono text-[10px] whitespace-pre-line">{q.sql}</p>
                  <p className="text-[11px]">{r.plan}</p>
                </motion.div>
              );
            })}
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative: 1 million orders in about 25,000 pages.
          </p>
        </div>
      }
    >
      <p>
        Four queries run against an orders table all day. Try each index and see which queries it
        serves. No single index serves all four.
      </p>
      <p>
        Watch for two tricks. Putting the sort column second, (customer_id, created_at), lets the
        database read a customer&apos;s latest orders straight off the index in order. And adding
        the remaining columns with INCLUDE makes a <Term id="covering-index">covering index</Term>:
        an index-only scan never touches the table at all.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When the index is ignored ------------------------------------------------------------------- */

const CASES: [string, string, string][] = [
  [
    "Too many rows match",
    "WHERE status = 'delivered'",
    "If most of the table matches, reading it straight through is cheaper than jumping around. PostgreSQL: queries matching “more than a few percent of all the table rows” won't use the index anyway.",
  ],
  [
    "A function hides the column",
    "WHERE lower(email) = 'asha@example.in'",
    "An index on email can't help; “the UPPER function is just a black box”. Index the expression itself: CREATE INDEX ON users (lower(email)).",
  ],
  [
    "A leading wildcard",
    "WHERE name LIKE '%kumar'",
    "The index is sorted by the start of the name; a pattern that starts with % can't narrow the search.",
  ],
  [
    "Only some rows matter",
    "WHERE status = 'pending'",
    "A partial index, CREATE INDEX … WHERE status = 'pending', stays tiny and fast.",
  ],
];

export function WhenSkipped() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When the index is ignored"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CASES.map(([t, sql, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-accent font-mono text-[10px]">{sql}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Having an index doesn&apos;t mean it will be used. The planner uses it only &ldquo;when it
        thinks doing so would be more efficient than a sequential table scan&rdquo;. How many rows
        match, its <Term id="selectivity">selectivity</Term>, decides most of that.
      </p>
      <p>
        So &ldquo;add an index&rdquo; is never the whole answer. The query has to be written so the
        index can help, and the index has to match the question.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Every index has a price --------------------------------------------------------------------- */

export function WriteCost() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Every index has a price"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="grid grid-cols-[6rem_1fr] items-center gap-2 text-xs">
                <span className="text-muted">
                  {n} index{n === 1 ? "" : "es"}
                </span>
                <div className="flex gap-0.5">
                  <span className="bg-viz-data/60 h-3 w-8 rounded-sm" title="table" />
                  {Array.from({ length: n }, (_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 * i }}
                      className="bg-viz-compute/60 h-3 w-8 rounded-sm"
                    />
                  ))}
                </div>
              </div>
            ))}
            <p className="text-muted text-[10px]">
              Work for one INSERT: the table, plus one entry in every index (illustrative).
            </p>
          </div>
          <Code>{`SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan;      -- 0 scans since the last reset?`}</Code>
        </div>
      }
    >
      <p>
        Every INSERT, every DELETE, and every UPDATE of an indexed column must change every index
        too. PostgreSQL&apos;s docs: indexes &ldquo;add overhead to the database system as a whole,
        so they should be used sensibly.&rdquo; Indexes also take disk space and buffer pool memory.
      </p>
      <p>
        Check which indexes are actually used. PostgreSQL counts scans in pg_stat_user_indexes;
        MySQL has sys.schema_unused_indexes. Be careful: a zero may just mean statistics were reset
        recently, and indexes enforcing unique keys are needed even if never scanned.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Will the index help? ------------------------------------------------------------------------ */

export function HelpsOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Will the index help?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="helps-or-not"
            prompt="The table has one index on (customer_id, created_at). Will it help each query?"
            categories={[
              { id: "yes", label: "Helps" },
              { id: "no", label: "Won't help" },
            ]}
            items={[
              {
                id: "cust",
                label: "WHERE customer_id = 42",
                category: "yes",
                why: "The leading column is constrained.",
              },
              {
                id: "both",
                label: "WHERE customer_id = 42 AND created_at > '2026-09-01'",
                category: "yes",
                why: "Both columns, in index order: ideal.",
              },
              {
                id: "order",
                label: "WHERE customer_id = 42 ORDER BY created_at",
                category: "yes",
                why: "Rows come out of the index already sorted.",
              },
              {
                id: "date",
                label: "WHERE created_at > '2026-09-01'",
                category: "no",
                why: "The leading column isn't constrained, like looking up everyone called Priya.",
              },
              {
                id: "func",
                label: "WHERE customer_id + 0 = 42",
                category: "no",
                why: "An expression on the column hides it from the index.",
              },
              {
                id: "all",
                label: "WHERE customer_id > 0 (every row)",
                category: "no",
                why: "Nearly all rows match; a sequential scan is cheaper.",
              },
            ]}
            explanation="Constrain the leading column, leave it unwrapped by expressions, and ask for few enough rows."
          />
        </div>
      }
    >
      <p>Think phone book.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Leading columns first", "Composite indexes work left to right."],
  ["Order can come free", "Put the sort column after the filter column."],
  ["Covering indexes", "Index-only scans skip the table."],
  ["Selectivity rules", "Many matching rows: a scan wins."],
  ["Indexes cost writes", "Drop the ones nobody uses."],
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
      <p>Next: a completely different index design, built for writing fast.</p>
    </StepLayout>
  );
}
