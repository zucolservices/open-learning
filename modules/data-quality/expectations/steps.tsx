"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BAD_FAILS, CODE, GX_FLOW, RULES, report, type Tool } from "./model";
import type { ExpState } from "./state";

/* 1 ─ Write the rule, not the check --------------------------------------------------------------- */

export function Recipes() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Write the rule, not the check"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Telling the inspector how</p>
            <p className="text-muted mt-1">
              &ldquo;Open each box, count the screws, write the number down, compare it to 100,
              shout if it&apos;s lower…&rdquo;
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Telling the inspector what</p>
            <p className="text-muted mt-1">
              &ldquo;Every box has at least 100 screws.&rdquo; The inspector knows how to check it,
              and how to report.
            </p>
          </div>
        </div>
      }
    >
      <p>
        You can hand a quality inspector step-by-step instructions, or just the standard to meet.
        The second is shorter, harder to get wrong, and the inspector can report results the same
        way every time.
      </p>
      <p>
        <Term id="validation-framework">Validation frameworks</Term> work like that. You declare{" "}
        <Term id="expectation">expectations</Term> about your data (&ldquo;amount is never
        negative&rdquo;), and the tool writes the queries, runs them and reports what failed.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One rule set, five tools ⭐ ----------------------------------------------------------------- */

export function FiveTools() {
  const [s, set] = useSceneState<ExpState>();
  const c = CODE[s.tool];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One rule set, five tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CODE) as Tool[]).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.tool === t}
                onClick={() => set({ tool: t, ran: false })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.tool === t ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {CODE[t].name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {RULES.map((r, i) => (
              <span
                key={r}
                className={cn(
                  "rounded-md border px-2 py-0.5 text-[10px]",
                  s.ran && s.bad && BAD_FAILS[i]
                    ? "border-bad bg-bad/10"
                    : "border-line bg-surface",
                )}
              >
                {r}
              </span>
            ))}
          </div>
          <motion.div key={s.tool} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-muted mb-1 text-[10px]">{c.lang}</p>
            <Code>{c.code}</Code>
          </motion.div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              [false, "clean batch"],
              [true, "bad batch"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.bad === v}
                onClick={() => set({ bad: v as boolean, ran: false })}
                className={cn(
                  "rounded-md border px-3 py-1",
                  s.bad === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
            <button
              type="button"
              onClick={() => set({ ran: true })}
              className="bg-accent text-accent-fg rounded-full px-4 py-1 font-medium"
            >
              Run
            </button>
          </div>
          {s.ran && (
            <motion.pre
              key={`${s.tool}-${s.bad}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface-2 overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[11px] whitespace-pre-wrap"
            >
              {report(s.tool, s.bad)}
            </motion.pre>
          )}
          <p className="text-subtle text-[10px]">
            Simplified syntax and output; check each tool&apos;s docs for your version.
          </p>
        </div>
      }
    >
      <p>
        The same five rules, written for five popular tools. Switch tools to compare how each
        expresses them, then run a clean batch and a bad one. The bad batch has a duplicate order, a
        missing customer and a negative amount.
      </p>
      <p>
        Different syntax, same idea: declarative rules in, pass/fail results out. dbt tests live in
        your SQL project; Great Expectations and pandera in Python; Soda in YAML contracts; Deequ on
        Spark at very large scale.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Inside a framework -------------------------------------------------------------------------- */

export function GxVocabulary() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Inside a framework"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {GX_FLOW.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[10rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-semibold">{t}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Great Expectations shows the parts most frameworks have, even if names differ: the rules,
        the data to check, a way to run them on a schedule, actions when they fail, and a readable
        report.
      </p>
      <p>
        GX Core 1.0 arrived in August 2024 and remains Apache-licensed open source, now stewarded by
        Fivetran. The hosted GX Cloud was sold to FICO and stopped being publicly available on 1
        June 2026.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Choosing a framework ------------------------------------------------------------------------ */

export function Choosing() {
  const rows: [string, string, string][] = [
    [
      "Already using dbt",
      "dbt data tests, plus packages like dbt-utils and dbt-expectations (now maintained by Metaplane)",
      "Apache 2.0",
    ],
    [
      "Huge tables on Spark",
      "Deequ or PyDeequ, from Amazon (2018 paper); checks become Spark aggregations",
      "Apache 2.0",
    ],
    ["Python dataframes, notebooks", "pandera schemas for pandas, polars and PySpark", "MIT"],
    ["Python, many backends, rich reports", "Great Expectations (GX Core)", "Apache 2.0"],
    [
      "YAML contracts across sources",
      "Soda Core 4: free and source-available since moving to the Elastic License in January 2026",
      "ELv2",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing a framework"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {rows.map(([w, t, l], i) => (
            <motion.div
              key={w}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold">{w}</span>
                <span className="text-muted font-mono text-[10px]">{l}</span>
              </div>
              <p className="text-muted">{t}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Pick the tool that lives where your data and your team already are. A dbt shop rarely needs
        a second framework for basic tests; a Spark platform team may want Deequ; Python data
        scientists, pandera.
      </p>
      <p>
        Check licences and ownership as well as features: in 2026 alone, Soda Core changed licence
        and Great Expectations changed hands.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which tool fits? ---------------------------------------------------------------------------- */

export function PickTool() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tool fits?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-framework"
            prompt="Which tool is the most natural fit for each team?"
            categories={[
              { id: "dbt", label: "dbt tests" },
              { id: "deequ", label: "Deequ" },
              { id: "pandera", label: "pandera" },
              { id: "gx", label: "Great Expectations" },
            ]}
            items={[
              {
                id: "warehouse",
                label: "Analytics engineers building models in dbt on a cloud warehouse",
                category: "dbt",
                why: "Tests live next to the models.",
              },
              {
                id: "spark",
                label: "A platform team checking billion-row tables on Spark",
                category: "deequ",
                why: "Built for Spark scale.",
              },
              {
                id: "notebook",
                label: "Data scientists validating pandas dataframes in a notebook",
                category: "pandera",
                why: "Lightweight schemas in Python.",
              },
              {
                id: "multi",
                label: "A Python team checking files, databases and Spark, with shareable reports",
                category: "gx",
                why: "Many backends and Data Docs.",
              },
            ]}
            explanation="Choose the framework that sits where your data and code already are; most do the same core job."
          />
        </div>
      }
    >
      <p>Sort the teams.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Declare, don't hand-code", "Rules in, results out."],
  ["Same core idea", "dbt, GX, Soda, Deequ and pandera."],
  ["Where you work", "SQL project, Python, Spark or YAML."],
  ["Check licences", "Soda Core is ELv2 since 2026; GX Core stays Apache."],
  ["Results are reports", "Pass/fail, counts, failing rows, docs."],
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
      <p>Next: where in a pipeline the checks should run.</p>
    </StepLayout>
  );
}
