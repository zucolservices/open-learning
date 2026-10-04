"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES, FLAGS, OCCURRING, PATTERNS, type Pattern } from "./model";
import type { PatState } from "./state";

/* 1 ─ The right tool ------------------------------------------------------------------------------ */

export function Toolbox() {
  const tools: [string, string][] = [
    ["One calendar, many uses", "Role-playing"],
    ["A drawer for odds and ends", "Junk"],
    ["A ticket number with nothing behind it", "Degenerate"],
    ["Russian dolls you have to open one by one", "Snowflake"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="The right tool"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {tools.map(([t, p], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm">{t}</p>
              <p className="text-accent mt-1 text-xs font-semibold">{p}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every kitchen drawer has a few odd tools for awkward jobs. Dimensional modelling has the
        same: a handful of named patterns for dimensions that don&apos;t fit the simple star.
      </p>
      <p>
        You&apos;ve met the <Term id="degenerate-dimension">degenerate dimension</Term>. This module
        adds <Term id="role-playing-dimension">role-playing</Term> and{" "}
        <Term id="junk-dimension">junk</Term> dimensions, the <Term id="snowflake">snowflake</Term>{" "}
        Kimball warns against, and the occasional <Term id="outrigger">outrigger</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix five awkward designs ⭐ ----------------------------------------------------------------- */

export function FixFive() {
  const [s, set] = useSceneState<PatState>();
  const picks = s.picks ?? {};
  const c = CASES.find((x) => x.id === s.open) ?? CASES[0];
  const pick = picks[c.id];
  const ok = pick === c.answer;
  const done = CASES.filter((x) => picks[x.id] === x.answer).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix five awkward designs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {CASES.map((x, i) => {
              const fixed = picks[x.id] === x.answer;
              return (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={s.open === x.id}
                  onClick={() => set({ open: x.id })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]",
                    s.open === x.id ? "border-accent bg-accent-soft" : "border-line",
                    fixed && "text-good",
                  )}
                >
                  {fixed ? (
                    <Check className="size-3" />
                  ) : (
                    <span className="font-mono">{i + 1}</span>
                  )}
                  {x.title}
                </button>
              );
            })}
          </div>
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <Code>{c.before}</Code>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(PATTERNS) as Pattern[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set({ picks: { ...picks, [c.id]: p } })}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs",
                    pick === p
                      ? p === c.answer
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {PATTERNS[p]}
                </button>
              ))}
            </div>
            {pick && (
              <motion.div
                key={pick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-2"
              >
                <p className={cn("flex gap-1.5 text-xs", ok ? "text-good" : "text-bad")}>
                  {ok ? (
                    <Check className="mt-0.5 size-3.5 shrink-0" />
                  ) : (
                    <X className="mt-0.5 size-3.5 shrink-0" />
                  )}
                  <span>
                    {ok
                      ? c.why
                      : (c.wrong[pick] ?? "Not this one. Look at what's awkward in the design.")}
                  </span>
                </p>
                {ok && <Code>{c.after}</Code>}
              </motion.div>
            )}
          </motion.div>
          <p className="text-muted text-xs">
            {done} of {CASES.length} fixed.
          </p>
        </div>
      }
    >
      <p>
        Five designs a team has shipped, each awkward in a different way. For each, choose the
        pattern that fixes it and see the result.
      </p>
      <p>Wrong picks explain why; try as often as you like.</p>
    </StepLayout>
  );
}

/* 3 ─ Only what actually happens ------------------------------------------------------------------ */

export function JunkCombos() {
  const [s, set] = useSceneState<PatState>();
  const all: string[][] = [];
  for (const g of FLAGS.gift)
    for (const c of FLAGS.channel)
      for (const p of FLAGS.payment) for (const r of FLAGS.rush) all.push([g, c, p, r]);
  const occurs = (row: string[]) => OCCURRING.some((o) => o.join() === row.join());
  return (
    <StepLayout
      eyebrow="Explore"
      title="Only what actually happens"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <button
            type="button"
            aria-pressed={s.full}
            onClick={() => set({ full: !s.full })}
            className={cn(
              "self-start rounded-md border px-3 py-1 text-xs",
              s.full ? "border-bad bg-bad/10" : "border-good bg-good/10",
            )}
          >
            {s.full
              ? `every possible combination (${all.length})`
              : `combinations that occur (${OCCURRING.length})`}
          </button>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {(s.full ? all : OCCURRING).map((r, i) => (
              <motion.div
                key={r.join()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.01 * i }}
                className={cn(
                  "rounded border px-2 py-0.5 font-mono text-[10px]",
                  s.full && !occurs(r)
                    ? "border-line text-subtle"
                    : "border-viz-data bg-viz-data/10",
                )}
              >
                {i + 1}: gift {r[0]} · {r[1]} · {r[2]} · rush {r[3]}
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Four little flags have 2 × 3 × 3 × 2 = 36 possible combinations. Kimball&apos;s advice: the
        junk dimension &ldquo;does not need to be the Cartesian product&rdquo; of every value, only
        the combinations that actually occur in the data.
      </p>
      <p>The fact table then carries one key, profile_key, instead of four.</p>
    </StepLayout>
  );
}

/* 4 ─ Snowflake or flat? -------------------------------------------------------------------------- */

export function Snowflake() {
  const [s, set] = useSceneState<PatState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Snowflake or flat?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {[
              [true, "snowflaked"],
              [false, "flattened"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.snow === v}
                onClick={() => set({ snow: v as boolean })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.snow === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
          </div>
          <Code>
            {s.snow
              ? `SELECT dep.name, SUM(f.amount)
FROM fact_sales f
JOIN dim_product    p   ON p.product_key = f.product_key
JOIN dim_brand      b   ON b.brand_key = p.brand_key
JOIN dim_category   c   ON c.category_key = b.category_key
JOIN dim_department dep ON dep.department_key = c.department_key
GROUP BY dep.name`
              : `SELECT p.department, SUM(f.amount)
FROM fact_sales f
JOIN dim_product p ON p.product_key = f.product_key
GROUP BY p.department`}
          </Code>
          <p className="text-muted text-center text-xs">
            Same answer, same information. {s.snow ? "Four joins." : "One join."}
          </p>
        </div>
      }
    >
      <p>
        Normalising a dimension&apos;s hierarchy into separate tables makes a{" "}
        <Term id="snowflake">snowflake schema</Term>. Kimball is blunt: &ldquo;you should avoid
        snowflakes&rdquo;, because they are hard for users to navigate and can hurt performance. A
        flattened dimension contains exactly the same information.
      </p>
      <p>
        Dimensions are small next to fact tables, so the repeated brand and category names cost
        little.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Name the pattern ---------------------------------------------------------------------------- */

export function NamePattern() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name the pattern"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="name-pattern"
            prompt="Which pattern is each describing?"
            categories={[
              { id: "role", label: "Role-playing" },
              { id: "junk", label: "Junk" },
              { id: "degen", label: "Degenerate" },
              { id: "snow", label: "Snowflake" },
            ]}
            items={[
              {
                id: "flight",
                label: "A flight fact links to the airport dimension twice: departure and arrival",
                category: "role",
                why: "One dimension, two roles.",
              },
              {
                id: "flags",
                label: "A dimension holding is_promo, is_online and is_return flags together",
                category: "junk",
                why: "Bundled low-cardinality flags.",
              },
              {
                id: "po",
                label: "The purchase order number stored on each line-item fact",
                category: "degen",
                why: "A key with no table.",
              },
              {
                id: "geo",
                label: "store → city → state → country as four linked tables",
                category: "snow",
                why: "A normalised hierarchy.",
              },
              {
                id: "hire",
                label: "An HR fact with hire_date_key and termination_date_key",
                category: "role",
                why: "The date dimension in two roles.",
              },
            ]}
            explanation="Role-playing: one dimension used several ways. Junk: flags bundled. Degenerate: an identifier on the fact. Snowflake: a hierarchy normalised into tables."
          />
        </div>
      }
    >
      <p>Sort the descriptions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Role-playing", "One dimension, several roles via views."],
  ["Junk", "Flags together; only combinations that occur."],
  ["Degenerate", "An identifier on the fact, no table."],
  ["Avoid snowflakes", "Flatten: same information, simpler queries."],
  ["Outriggers, sparingly", "A dimension pointing to another dimension."],
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
        Next: dimension values change over time. Slowly changing dimensions decide what history to
        keep.
      </p>
    </StepLayout>
  );
}
