"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COLS, ROWS, SUGGESTIONS, profile } from "./model";
import type { ProfState } from "./state";

/* 1 ─ A check-up before a diagnosis --------------------------------------------------------------- */

export function CheckUp() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A check-up before a diagnosis"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "Guessing",
              "“You look tired; take these.” Treatment before anyone measured anything.",
            ],
            [
              "Measuring first",
              "Weight, blood pressure, a blood test. Now you know what normal looks like for this patient, and what isn't.",
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
        A good doctor measures before prescribing. Writing data tests without looking at the data
        first is prescribing blind: you don&apos;t know which rules hold, which are already broken,
        or what you haven&apos;t thought of.
      </p>
      <p>
        <Term id="data-profiling">Data profiling</Term> is the check-up: counting nulls, distinct
        values, ranges and patterns in each column. It often turns up problems nobody suspected, and
        gives you a starting list of rules.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Profile a supplier file ⭐ ------------------------------------------------------------------ */

function Stat({ k, v, bad }: { k: string; v: string | number; bad?: boolean }) {
  return (
    <div>
      <p className="text-muted text-[10px]">{k}</p>
      <p className={cn("font-mono text-sm font-semibold", bad && "text-bad")}>{v}</p>
    </div>
  );
}

export function ProfileFile() {
  const [s, set] = useSceneState<ProfState>();
  const p = profile(s.col);
  const decisions = s.decisions ?? {};
  const maxV = p.max ?? 1;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Profile a supplier file"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {COLS.map((c) => {
              const q = profile(c);
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={s.col === c}
                  onClick={() => set({ col: c })}
                  className={cn(
                    "rounded-md border px-2 py-1 font-mono text-[11px]",
                    s.col === c ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {c}
                  {q.nulls > 0 && <span className="text-bad ml-1">●</span>}
                </button>
              );
            })}
          </div>
          <motion.div
            key={s.col}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              <Stat k="rows" v={p.rows} />
              <Stat
                k="nulls"
                v={`${p.nulls} (${Math.round((p.nulls / p.rows) * 100)}%)`}
                bad={p.nulls > 0}
              />
              <Stat k="distinct" v={p.distinct} />
              <Stat k="unique" v={p.unique} />
              <Stat k="min" v={p.min ?? "–"} />
              <Stat k="max" v={p.max ?? "–"} bad={s.col === "price"} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted mb-1 text-[10px]">{p.numeric ? "values" : "top values"}</p>
                {p.numeric ? (
                  <div className="flex h-16 items-end gap-0.5">
                    {p.values.map((v, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(3, (v / maxV) * 100)}%` }}
                        className={cn(
                          "flex-1 rounded-t-sm",
                          v === p.max && s.col === "price" ? "bg-bad" : "bg-viz-data/70",
                        )}
                      />
                    ))}
                  </div>
                ) : (
                  p.top.map(([v, n]) => (
                    <p key={v} className="font-mono text-[11px]">
                      {v} <span className="text-muted">× {n}</span>
                    </p>
                  ))
                )}
              </div>
              <div>
                <p className="text-muted mb-1 text-[10px]">
                  patterns (A letter, a lower-case, 9 digit)
                </p>
                {p.patterns.map(([pt, n]) => (
                  <p
                    key={pt}
                    className={cn(
                      "font-mono text-[11px]",
                      p.patterns.length > 1 && n === 1 && "text-bad",
                    )}
                  >
                    {pt} <span className="text-muted">× {n}</span>
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
          {!s.suggested ? (
            <button
              type="button"
              onClick={() => set({ suggested: true })}
              className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
            >
              Suggest rules from this profile
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              {SUGGESTIONS.map((x) => {
                const d = decisions[x.id];
                const right = d !== undefined && d === x.keep;
                return (
                  <div
                    key={x.id}
                    className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[11px]">{x.rule}</span>
                      <span className="flex gap-1">
                        {[
                          [true, "keep"],
                          [false, "reject"],
                        ].map(([v, l]) => (
                          <button
                            key={l as string}
                            type="button"
                            onClick={() =>
                              set({ decisions: { ...decisions, [x.id]: v as boolean } })
                            }
                            className={cn(
                              "rounded border px-2 py-0.5 text-[10px]",
                              d === v
                                ? right
                                  ? "border-good bg-good/15"
                                  : "border-bad bg-bad/10"
                                : "border-line",
                            )}
                          >
                            {l as string}
                          </button>
                        ))}
                      </span>
                    </div>
                    {d !== undefined && (
                      <p className={cn("mt-0.5 text-[11px]", right ? "text-good" : "text-bad")}>
                        {x.why}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-subtle text-[10px]">
            {ROWS.length} made-up products. A red dot marks columns with missing values.
          </p>
        </div>
      }
    >
      <p>
        A new supplier sent a product file. Click each column to see its profile: nulls, distinct
        values, range, top values and the pattern of characters. Three problems are hiding in plain
        sight.
      </p>
      <p>
        Then let the profile suggest rules, as tools like Amazon&apos;s Deequ do, and keep or reject
        each one. Deequ&apos;s own docs say suggestions &ldquo;should always be manually
        reviewed&rdquo;: they assume the data they learned from was correct.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Beyond single columns ----------------------------------------------------------------------- */

export function ThreeLevels() {
  const levels: [string, string, string][] = [
    [
      "Single column",
      "Nulls, distinct and unique counts, min and max, patterns, inferred type.",
      "weight_g is numeric but stored as text.",
    ],
    [
      "Across columns",
      "How columns move together: correlations and combinations.",
      "Decor items are always the heaviest and most expensive.",
    ],
    [
      "Dependencies",
      "Rules hidden in the data: which columns identify a row, which determine others, which values appear in another table.",
      "sku → name, price; every category appears in the category list.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Beyond single columns"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {levels.map(([t, d, e], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
              style={{ marginLeft: `${i * 12}px` }}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
              <p className="text-accent mt-1">e.g. {e}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Researchers group profiling into three levels (Abedjan, Golab and Naumann&apos;s 2015
        survey): single-column statistics, relationships between columns, and dependencies such as
        candidate keys and foreign-key-like inclusions.
      </p>
      <p>
        One subtlety in the column stats: <em>distinct</em> counts values seen at least once;{" "}
        <em>unique</em> counts values seen exactly once. They are easy to mix up.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Profiling tools ----------------------------------------------------------------------------- */

export function Tools() {
  const tools: [string, string][] = [
    [
      "fg-data-profiling",
      "One-line HTML or JSON report for pandas and Spark. Formerly ydata-profiling, originally pandas-profiling (renamed again in April 2026).",
    ],
    [
      "dbt-profiler",
      "A dbt package that profiles models in SQL: null share, distinct counts, min and max.",
    ],
    [
      "Deequ / PyDeequ",
      "Amazon's library on Spark: column profiles at billion-row scale, and rule suggestions.",
    ],
    ["AWS Glue DataBrew", "Managed profile jobs with reports in S3."],
    ["Soda Cloud", "Profiling is part of the commercial platform, not open-source Soda Core."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Profiling tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {tools.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Profiling is built into many tools, from a single Python call to managed cloud jobs. A plain
        SQL query with COUNT, COUNT DISTINCT, MIN and MAX gets you most of the way too.
      </p>
      <p>
        Tools change: Great Expectations, for instance, removed its automatic profilers in version
        1.0 (August 2024). Profile regularly, not once: what&apos;s normal drifts.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Rule or investigate? ------------------------------------------------------------------------ */

export function RuleOrInvestigate() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Rule or investigate?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="rule-or-investigate"
            prompt="Should each profiling finding become a rule straight away, or be investigated first?"
            categories={[
              { id: "rule", label: "Make it a rule" },
              { id: "ask", label: "Investigate first" },
            ]}
            items={[
              {
                id: "pk",
                label: "order_id has no nulls and no duplicates across 2 million rows",
                category: "rule",
                why: "That's what a key should look like.",
              },
              {
                id: "max",
                label: "One price is ₹99,999 while the rest are under ₹2,000",
                category: "ask",
                why: "Probably an error; don't build a range around it.",
              },
              {
                id: "country",
                label: "country is 'IN' in every row of the sample",
                category: "ask",
                why: "Maybe the sample was small; ask what's expected.",
              },
              {
                id: "text",
                label: "A date column is text, all in YYYY-MM-DD",
                category: "rule",
                why: "Cast it, and check the format on every load.",
              },
              {
                id: "phone",
                label: "12% of phone numbers are missing",
                category: "ask",
                why: "Is phone required? The business decides.",
              },
            ]}
            explanation="Profiles show what the data is, not what it should be. Clear structural facts become rules; surprises need a human decision first."
          />
        </div>
      }
    >
      <p>Sort the findings.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Look before you judge", "Profile new data before writing rules."],
  ["Column stats", "Nulls, distinct vs unique, ranges, patterns, types."],
  ["Deeper levels", "Correlations and dependencies."],
  ["Suggestions need review", "They assume the sample was right."],
  ["Profile again", "Normal changes over time."],
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
      <p>Next: validation frameworks, for declaring and running rules at scale.</p>
    </StepLayout>
  );
}
