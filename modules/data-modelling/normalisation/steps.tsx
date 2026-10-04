"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { STAGES, TESTS, VIOLATIONS, type T, type Test } from "./model";
import type { NormState } from "./state";

/* 1 ─ The address written everywhere -------------------------------------------------------------- */

export function AddressBook() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The address written everywhere"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {["Birthday list", "Christmas cards", "Emergency contacts", "Wedding invites"].map(
            (l, i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="border-line bg-surface flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
              >
                <span>{l}</span>
                <span className={cn("font-mono", i === 2 ? "text-bad line-through" : "")}>
                  Gran · 12 Old Road
                </span>
              </motion.div>
            ),
          )}
          <p className="text-muted text-center text-xs">
            Gran moves. Three lists get updated; one doesn&apos;t.
          </p>
        </div>
      }
    >
      <p>
        If you copy your gran&apos;s address into four different lists, then she moves, you have to
        remember all four. Miss one and your lists disagree. Keep it in one address book that the
        lists refer to, and there&apos;s only one place to change.
      </p>
      <p>
        <Term id="normalisation">Normalisation</Term> is that idea, made into a method. E. F. Codd
        named it in 1970 and defined second and third <Term id="normal-form">normal forms</Term> in
        1971, to free tables from what he called insertion, update and deletion dependencies: today,{" "}
        <Term id="data-anomaly">anomalies</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Normalise an orders sheet ⭐ ---------------------------------------------------------------- */

function TableView({ t }: { t: T }) {
  return (
    <div className="border-line overflow-x-auto rounded-lg border">
      <p className="bg-surface-2 px-2 py-0.5 font-mono text-[10px] font-semibold">{t.name}</p>
      <table className="w-full font-mono text-[10px]">
        <thead>
          <tr>
            {t.head.map((h) => (
              <th
                key={h}
                className={cn(
                  "px-2 text-left font-normal whitespace-nowrap",
                  t.key.includes(h) ? "text-accent underline" : "text-muted",
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.rows.map((r, i) => (
            <tr key={i} className="border-line border-t">
              {r.map((c, j) => (
                <td key={j} className="px-2 py-0.5 whitespace-nowrap">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Normalise() {
  const [s, set] = useSceneState<NormState>();
  const st = STAGES[s.stage];
  const test = TESTS.find((t) => t.id === s.test)!;
  const [res, ok] = test.results[s.stage];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Normalise an orders sheet"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper
            step={s.stage}
            count={STAGES.length}
            onChange={(n) => set({ stage: n })}
            label={st.name}
          />
          <motion.div
            key={s.stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("grid gap-2", st.tables.length > 1 && "sm:grid-cols-2")}
          >
            {st.tables.map((t) => (
              <TableView key={t.name} t={t} />
            ))}
          </motion.div>
          <FrameCaption frameKey={s.stage} title={st.name}>
            {st.note}
          </FrameCaption>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted mb-1 text-[10px]">TEST THIS DESIGN</p>
            <div className="flex flex-wrap gap-1">
              {TESTS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={s.test === t.id}
                  onClick={() => set({ test: t.id as Test })}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px]",
                    s.test === t.id ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <motion.p
              key={`${s.test}-${s.stage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("mt-2 text-xs font-semibold", ok ? "text-good" : "text-bad")}
            >
              {res} {!ok && <span className="text-muted font-normal">({test.kind})</span>}
            </motion.p>
          </div>
          <p className="text-subtle text-[10px]">
            Underlined columns form each table&apos;s key. Data made up.
          </p>
        </div>
      }
    >
      <p>
        Step an orders sheet through the normal forms. At each stage, pick a change the café needs
        to make and see how painful it is.
      </p>
      <p>
        <strong>First</strong> normal form: one value per cell. <strong>Second</strong>: no column
        depends on only part of a composite key. <strong>Third</strong>: no column depends on
        another non-key column. By the end every change touches exactly one row.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The key, the whole key ---------------------------------------------------------------------- */

export function WholeKey() {
  const [s, set] = useSceneState<NormState>();
  const v = VIOLATIONS[s.viol] ?? VIOLATIONS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The key, the whole key"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-center text-sm">
            Every non-key column should state a fact about <strong>the key</strong>,{" "}
            <strong>the whole key</strong>, and <strong>nothing but the key</strong>.
          </p>
          <div className="flex gap-1.5">
            {VIOLATIONS.map((x, i) => (
              <button
                key={x.form}
                type="button"
                aria-pressed={s.viol === i}
                onClick={() => set({ viol: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.viol === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                breaks {x.form}: &ldquo;{x.rule}&rdquo;
              </button>
            ))}
          </div>
          <motion.div
            key={v.form}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
          >
            <p className="font-mono">
              {v.table.split(v.bad).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="text-bad font-semibold underline decoration-wavy">
                      {v.bad}
                    </span>
                  )}
                </span>
              ))}
            </p>
            <p className="text-muted mt-2">{v.why}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        The popular mnemonic echoes William Kent&apos;s 1983 guide to the normal forms. Kent put the
        violations plainly: second normal form is broken when a column is &ldquo;a fact about a
        subset of a key&rdquo;, third when it is &ldquo;a fact about another non-key field&rdquo;.
      </p>
      <p>
        Underneath both is the idea of a{" "}
        <Term id="functional-dependency">functional dependency</Term>: if you know the product, you
        know its price.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When to stop -------------------------------------------------------------------------------- */

export function WhenToStop() {
  const cards: [string, string][] = [
    [
      "Boyce–Codd normal form (1974)",
      "A stricter third normal form: every column that determines another must be a candidate key. Most 3NF tables already meet it.",
    ],
    [
      "Fourth and fifth",
      "Deal with rarer cases, like two independent lists in one table. Worth knowing they exist.",
    ],
    [
      "Not every copy is redundant",
      "An order line should keep the price actually paid. When the menu price changes, old orders mustn't change with it. That's history, not duplication.",
    ],
    [
      "Reads pay the price",
      "Kent noted normalisation tends to penalise retrieval: more tables means more joins. Analytical models often denormalise on purpose (modules 5 and 6).",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When to stop"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {cards.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        For systems that record transactions, third normal form (or <Term id="bcnf">BCNF</Term>) is
        the usual target. Beyond that, the returns shrink.
      </p>
      <p>
        Normalisation is a tool for keeping changes safe, not a goal. Where data is mostly read and
        rarely changed, deliberately repeating some of it can be the better design.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which anomaly? ------------------------------------------------------------------------------ */

export function WhichAnomaly() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which anomaly?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-anomaly"
            prompt="Which kind of anomaly is each?"
            categories={[
              { id: "update", label: "Update" },
              { id: "insert", label: "Insert" },
              { id: "delete", label: "Delete" },
            ]}
            items={[
              {
                id: "phone",
                label: "A customer's phone is stored in 40 rows, and one is missed",
                category: "update",
                why: "The same fact in many places drifts apart.",
              },
              {
                id: "supplier",
                label: "A new supplier can't be recorded until it supplies a part",
                category: "insert",
                why: "One fact can't exist without another.",
              },
              {
                id: "last",
                label: "Deleting a product's last order also loses its price",
                category: "delete",
                why: "Removing one fact removes an unrelated one.",
              },
              {
                id: "warehouse",
                label: "Two rows now show different addresses for the same warehouse",
                category: "update",
                why: "Kent's example: redundancy became inconsistency.",
              },
              {
                id: "course",
                label: "A course can't be added until a student enrols",
                category: "insert",
                why: "The course has nowhere to live on its own.",
              },
            ]}
            explanation="Update: a repeated fact drifts. Insert: a fact can't be stored on its own. Delete: removing one fact loses another. Normalising removes all three."
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
  ["Each fact once", "So every change touches one row."],
  ["1NF", "One value per cell."],
  ["2NF", "Facts about the whole key, not part of it."],
  ["3NF", "Nothing but the key: no column depends on another non-key column."],
  ["Stop sensibly", "3NF/BCNF for transactions; denormalise for reading."],
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
        Next: why the same data is shaped one way for running a business and another for analysing
        it.
      </p>
    </StepLayout>
  );
}
