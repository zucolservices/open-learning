"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COLS, EVENTS, JOBS } from "./model";
import type { PlatState } from "./state";

/* 1 ─ The toolbox, not the brand ------------------------------------------------------------------ */

export function Toolbox() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The toolbox, not the brand"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {[
            ["Hammer", "Drives nails. Dozens of brands; you need to know when to use one."],
            ["Spirit level", "Checks things are straight, whoever made it."],
            ["Stud finder", "Finds what you can't see behind the wall."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A good carpenter knows what each tool is for. Brands come and go; a spirit level is a spirit
        level. Pick the job first, then the tool.
      </p>
      <p>
        Data quality tools are the same. Most fall into three kinds:{" "}
        <Term id="rules-as-code">rules written as code</Term>, observability that learns what normal
        looks like, and features built into your data platform or{" "}
        <Term id="data-catalog">data catalogue</Term>. This module maps them to the jobs you&apos;ve
        learned.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The tool map ⭐ ----------------------------------------------------------------------------- */

export function Map() {
  const [s, set] = useSceneState<PlatState>();
  const job = JOBS.find((j) => j.id === s.job) ?? JOBS[0];
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="The tool map"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {JOBS.map((j) => (
              <button
                key={j.id}
                type="button"
                aria-pressed={s.job === j.id}
                onClick={() => set({ job: j.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.job === j.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {j.label}
              </button>
            ))}
          </div>
          <p className="text-muted text-[11px]">{job.module} of this track</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {COLS.map((c, ci) => (
              <div
                key={c.id}
                className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3"
              >
                <p className="text-muted text-[10px] uppercase">{c.label}</p>
                {job.tools[c.id].length === 0 && (
                  <p className="text-subtle text-xs">Little built in</p>
                )}
                {job.tools[c.id].map((t, i) => (
                  <motion.span
                    key={`${job.id}-${t}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 * ci }}
                    className="bg-surface-2 rounded-md px-2 py-1 text-xs"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Examples, not a complete list or a recommendation. Names as of October 2026.
          </p>
        </div>
      }
    >
      <p>
        Pick a job from the track and see the kinds of tools that do it. Open-source libraries and
        standards cover nearly every job. Every big data platform now has built-in quality rules,
        monitoring and lineage. Commercial observability platforms bundle monitoring, lineage and
        incident workflow.
      </p>
      <p>
        The rules-as-code tools are where most teams start: dbt tests, Great Expectations, Deequ or
        pandera, depending on where the data lives.
      </p>
    </StepLayout>
  );
}

/* 3 ─ A market on the move ------------------------------------------------------------------------ */

export function Moving() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="A market on the move"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {EVENTS.map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[6rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In under two years, start-ups were bought, licences changed and products were renamed.
        Expect more of the same.
      </p>
      <p>
        That&apos;s why the track teaches ideas (tests, contracts, monitors, lineage,
        reconciliation) rather than products. Keep your rules in open, portable formats where you
        can (SQL, YAML, an open contract standard) so switching tools doesn&apos;t mean starting
        over.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Choosing for your team ---------------------------------------------------------------------- */

export function Choosing() {
  const qs: [string, string][] = [
    [
      "Where does the data live?",
      "Warehouse SQL suits dbt tests; Spark suits Deequ or GX; dataframes suit pandera; streams need a schema registry.",
    ],
    [
      "What does your platform already do?",
      "Built-in rules, monitoring and lineage may cover the basics at no extra licence cost.",
    ],
    [
      "How many tables matter?",
      "Writing rules scales to dozens of critical tables; learned monitoring helps with thousands.",
    ],
    ["Who responds to alerts?", "A tool is only useful if owners see its alerts and act on them."],
    [
      "Can you leave?",
      "Check licences (open source, source-available, commercial) and how portable your rules are.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing for your team"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {qs.map(([q, a], i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{q}</p>
              <p className="text-muted">{a}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        There&apos;s no single best stack. A small team on a cloud warehouse might use dbt tests,
        source freshness and Elementary. A Spark lakehouse team might lean on pipeline expectations
        and the catalogue&apos;s lineage and monitoring.
      </p>
      <p>
        Whatever you choose: start with the critical datasets, give every check an owner, and grow
        from there.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What kind of tool? -------------------------------------------------------------------------- */

export function WhichKind() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What kind of tool?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="tool-kind"
            prompt="Which kind is each?"
            categories={[
              { id: "rules", label: "Rules as code" },
              { id: "observe", label: "Learned monitoring" },
              { id: "standard", label: "Open standard" },
            ]}
            items={[
              {
                id: "dbt",
                label: "A not_null test in a dbt YAML file",
                category: "rules",
                why: "You wrote the rule.",
              },
              {
                id: "mc",
                label: "A monitor that learns a table's normal row count",
                category: "observe",
                why: "Nobody wrote a threshold.",
              },
              {
                id: "ol",
                label: "OpenLineage run events",
                category: "standard",
                why: "A shared format many tools emit.",
              },
              {
                id: "gx",
                label: "A Great Expectations expectation suite",
                category: "rules",
                why: "Explicit expectations.",
              },
              {
                id: "odcs",
                label: "An ODCS contract file",
                category: "standard",
                why: "An open format for contracts.",
              },
            ]}
            explanation="Rules-as-code tools check what you specify; learned monitoring flags departures from normal; open standards let different tools share contracts and lineage."
          />
        </div>
      }
    >
      <p>Sort them.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Job first", "Pick the problem, then the tool."],
  ["Three kinds", "Rules as code, learned monitoring, platform built-ins."],
  ["Open formats", "Keep rules portable as tools change hands."],
  ["Use what you have", "Platforms now include a lot."],
  ["Owners matter", "Alerts nobody acts on are noise."],
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
        Next: the capstone. A board report is 18% too high, and it&apos;s your job to find out why.
      </p>
    </StepLayout>
  );
}
