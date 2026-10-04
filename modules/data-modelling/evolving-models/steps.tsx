"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CONTRACT, NAMES, REPORTS, STAGES } from "./model";
import type { EvoState } from "./state";

/* 1 ─ Renaming a street --------------------------------------------------------------------------- */

export function StreetNames() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Renaming a street"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex gap-3">
            <div className="border-line bg-surface rounded-md border px-3 py-2 text-center text-xs line-through opacity-60">
              Station Road
            </div>
            <div className="border-accent bg-accent-soft rounded-md border px-3 py-2 text-center text-xs font-semibold">
              Gandhi Marg
            </div>
          </div>
          <p className="text-muted max-w-xs text-center text-xs">
            For a year both signs stay up, letters to either name arrive, and maps are updated
            before the old sign comes down.
          </p>
        </div>
      }
    >
      <p>
        When a city renames a street, it doesn&apos;t change the signs overnight. Both names work
        for a while, everyone is told the date, and the old sign comes down once maps and post have
        caught up.
      </p>
      <p>
        A table name or column is a promise to everyone who queries it. Changing it safely needs the
        same care: clear names to begin with, a written <Term id="model-contract">contract</Term>,
        and <Term id="model-version">versions</Term> with a{" "}
        <Term id="deprecation">deprecation</Term> date.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rename a column, safely ⭐ ------------------------------------------------------------------ */

export function SafeRename() {
  const [s, set] = useSceneState<EvoState>();
  const done = s.stage >= STAGES.length;
  const st = STAGES[Math.min(s.stage, STAGES.length - 1)];
  const picked = st.options.find((o) => o.id === s.pick);
  const migrated = s.stage >= 4 ? REPORTS.length : 0;
  const choose = (id: string) => {
    const o = st.options.find((x) => x.id === id)!;
    set({ pick: id, broke: s.broke || !!o.breaks });
  };
  const advance = () => set({ stage: s.stage + 1, pick: "" });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Rename a column, safely"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
            {REPORTS.map((r, i) => {
              const broken = s.broke && picked?.breaks && (picked.id === "inplace" || i >= 5);
              return (
                <motion.div
                  key={r}
                  animate={{ scale: broken ? 0.96 : 1 }}
                  className={cn(
                    "rounded-md border px-1.5 py-1 text-center text-[9px]",
                    broken
                      ? "border-bad bg-bad/15 text-bad"
                      : i < migrated
                        ? "border-good bg-good/10"
                        : "border-line bg-surface",
                  )}
                >
                  {r}
                  <span className="text-muted block font-mono text-[8px]">
                    {i < migrated ? "v2" : "v1"}
                  </span>
                </motion.div>
              );
            })}
          </div>
          {!done ? (
            <motion.div
              key={s.stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-1.5"
            >
              <p className="text-sm font-semibold">
                {s.stage + 1}. {st.title}
              </p>
              {st.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => choose(o.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    s.pick === o.id
                      ? o.ok
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {o.label}
                </button>
              ))}
              {picked && (
                <motion.p
                  key={picked.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn("text-xs", picked.ok ? "text-good" : "text-bad")}
                >
                  {picked.note}
                </motion.p>
              )}
              {picked?.ok && (
                <button
                  type="button"
                  onClick={advance}
                  className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
                >
                  {s.stage === STAGES.length - 1 ? "Finish" : "Next stage"}
                </button>
              )}
              {picked && !picked.ok && (
                <p className="text-muted text-[11px]">
                  Pick another option; nothing is permanent here.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-good bg-good/10 rounded-xl border px-4 py-3 text-xs"
            >
              <p className="text-sm font-semibold">Renamed, with no outage.</p>
              <p className="text-muted">Version, deprecation date, lineage, migration, removal.</p>
              <button
                type="button"
                onClick={() => set({ stage: 0, pick: "", broke: false })}
                className="border-line mt-2 rounded-full border px-3 py-1 text-[11px]"
              >
                start again
              </button>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        A badly named column, <code>cust_rev_amt</code>, is used by twelve reports. Rename it
        without breaking any of them. Choose a move at each stage; wrong moves show what would
        happen.
      </p>
      <p>
        The safe route mirrors dbt&apos;s own description: develop a new version, make it the
        latest, slate the old one for deprecation, update downstream references, then remove the old
        version.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Names are an interface ---------------------------------------------------------------------- */

export function Names() {
  const [s, set] = useSceneState<EvoState>();
  const n = NAMES[s.name] ?? NAMES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Names are an interface"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {NAMES.map(([bad], i) => (
              <button
                key={bad}
                type="button"
                aria-pressed={s.name === i}
                onClick={() => set({ name: i })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[11px]",
                  s.name === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {bad}
              </button>
            ))}
          </div>
          <motion.div
            key={n[0]}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex flex-col items-center gap-2 rounded-xl border px-4 py-4"
          >
            <div className="flex items-center gap-3 font-mono text-sm">
              <span className="text-bad line-through">{n[0]}</span>
              <span className="text-muted">→</span>
              <span className="text-good font-semibold">{n[1]}</span>
            </div>
            <p className="text-muted text-xs">{n[2]}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Good names make most documentation unnecessary. dbt&apos;s style guide is a good default:
        plural model names, <code>&lt;object&gt;_id</code> keys, <code>is_</code>/<code>has_</code>{" "}
        booleans, <code>&lt;event&gt;_at</code> timestamps in UTC, and business terms rather than
        the source system&apos;s, with no abbreviations.
      </p>
      <p>
        Whatever you choose, choose it once and apply it everywhere: consistency matters more than
        the exact rule.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Contracts and versions ---------------------------------------------------------------------- */

export function Contracts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Contracts and versions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{CONTRACT}</Code>
          <p className="text-subtle text-[10px]">Simplified; syntax follows recent dbt versions.</p>
        </div>
      }
    >
      <p>
        In dbt, an enforced contract lists every column&apos;s name and type; if the model&apos;s
        SQL stops matching, the build fails instead of quietly shipping a different shape. Contracts
        and model versions arrived in dbt 1.5 (April 2023); <code>deprecation_date</code> in 1.6.
      </p>
      <p>
        Documentation, owners and lineage usually live in a{" "}
        <Term id="data-catalog">data catalog</Term>, such as open-source Unity Catalog, DataHub or
        OpenMetadata. dbt itself warns not to adopt heavy governance too early; start with the
        models many people depend on.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Breaking or not? ---------------------------------------------------------------------------- */

export function BreakingOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Breaking or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="breaking-change"
            prompt="Which changes break the model's contract with its consumers?"
            categories={[
              { id: "break", label: "Breaking" },
              { id: "safe", label: "Non-breaking" },
            ]}
            items={[
              {
                id: "add",
                label: "Add a new column",
                category: "safe",
                why: "Existing queries keep working.",
              },
              {
                id: "rename",
                label: "Rename a column",
                category: "break",
                why: "Queries using the old name fail.",
              },
              {
                id: "type",
                label: "Change a column from integer to text",
                category: "break",
                why: "Types are part of the contract.",
              },
              {
                id: "remove",
                label: "Remove a column",
                category: "break",
                why: "Anyone using it breaks.",
              },
              {
                id: "null",
                label: "Allow NULLs in a column that never had them",
                category: "break",
                why: "dbt lists nullability changes as breaking.",
              },
              {
                id: "model",
                label: "Add a brand-new model",
                category: "safe",
                why: "Nobody depends on it yet.",
              },
            ]}
            explanation="Adding is usually safe; renaming, removing, retyping or loosening a column breaks the promise and needs a new version."
          />
        </div>
      }
    >
      <p>Sort the changes.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Names are an interface", "Consistent, business terms, no abbreviations."],
  ["Contracts", "Column names and types, enforced at build."],
  ["Versions", "Breaking change? Run v1 and v2 side by side."],
  ["Deprecation dates", "Tell people when the old one goes."],
  ["Catalogs and lineage", "Know who depends on what."],
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
      <p>Next: the capstone. Model a food-delivery business from its questions to its tables.</p>
    </StepLayout>
  );
}
