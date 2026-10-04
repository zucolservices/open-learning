"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHECKS, SCENARIOS, STAGES, WAP_STEPS, outcome, type CheckId } from "./model";
import type { WhereState } from "./state";

/* 1 ─ Taste as you cook --------------------------------------------------------------------------- */

export function Kitchen() {
  const steps: [string, string][] = [
    ["Check the delivery", "Is the fish fresh? Is everything on the list here?"],
    ["Taste as you cook", "Too much salt is easier to fix now than at the table."],
    ["Look before it leaves", "The head chef checks every plate at the pass."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Taste as you cook"
      stage={
        <div className="flex flex-1 items-center justify-center gap-2">
          {steps.map(([t, d], i) => (
            <div key={t} className="flex items-center gap-2">
              {i > 0 && <span className="text-accent">→</span>}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className="border-line bg-surface w-36 rounded-xl border px-3 py-3 text-xs"
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted mt-1">{d}</p>
              </motion.div>
            </div>
          ))}
        </div>
      }
    >
      <p>
        A good kitchen doesn&apos;t only check the plate at the end. It checks deliveries as they
        arrive, tastes while cooking, and looks at every plate before it goes out. Each check
        catches problems the others can&apos;t.
      </p>
      <p>
        Pipelines are the same. Test at the edge (as data arrives), in the middle (after each
        transformation) and at the gate (before anyone can see it). Catching problems early is
        sometimes called <Term id="shift-left">shifting left</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Checks along a pipeline ⭐ ------------------------------------------------------------------ */

export function PlaceChecks() {
  const [s, set] = useSceneState<WhereState>();
  const enabled = s.enabled ?? [];
  const toggle = (id: CheckId) =>
    set({
      enabled: enabled.includes(id) ? enabled.filter((x) => x !== id) : [...enabled, id],
      ran: false,
    });
  const results = SCENARIOS.map((x) => ({ x, hit: outcome(x, enabled) }));
  const reached = results.filter((r) => !r.hit).length;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Checks along a pipeline"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {STAGES.map((st, i) => (
              <div
                key={st.id}
                className="border-line bg-surface relative rounded-xl border px-3 py-2"
              >
                <p className="text-sm font-semibold">{st.label}</p>
                <p className="text-muted mb-1 text-[10px]">{st.where}</p>
                <div className="flex flex-col gap-1">
                  {CHECKS.filter((c) => c.stage === st.id).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={enabled.includes(c.id)}
                      onClick={() => toggle(c.id)}
                      className={cn(
                        "rounded-md border px-2 py-1 text-left text-[11px]",
                        enabled.includes(c.id) ? "border-accent bg-accent-soft" : "border-line",
                      )}
                    >
                      {enabled.includes(c.id) ? "✓ " : "+ "}
                      {c.label}
                    </button>
                  ))}
                </div>
                {i < 2 && (
                  <span className="text-accent absolute top-1/2 -right-2 hidden sm:block">→</span>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set({ ran: true })}
            className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
          >
            Run a bad week
          </button>
          {s.ran && (
            <div className="flex flex-col gap-1">
              {results.map(({ x, hit }, i) => (
                <motion.div
                  key={x.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    hit ? "border-good bg-good/10" : "border-bad bg-bad/10",
                  )}
                >
                  <p>
                    <span className="font-semibold">{x.label}</span>
                    <span className={hit ? "text-good" : "text-bad"}>
                      {" "}
                      ·{" "}
                      {hit
                        ? `caught ${STAGES.find((st) => st.id === hit.stage)!.label.toLowerCase()}`
                        : "reached the dashboard"}
                    </span>
                  </p>
                  <p className="text-muted text-[11px]">{x.note}</p>
                </motion.div>
              ))}
              <p className={cn("text-xs font-semibold", reached ? "text-bad" : "text-good")}>
                {reached
                  ? `${reached} of 5 problems reached users.`
                  : "Nothing reached users this week."}
              </p>
            </div>
          )}
        </div>
      }
    >
      <p>
        Add checks at each stage, then run a bad week with five different problems. See where each
        is caught, or whether it reaches the dashboard.
      </p>
      <p>
        Notice which checks only work in one place: a late file can only be noticed at the edge, and
        duplicates created by a join only after the join. The audit at the gate is a broad safety
        net, but the later a problem is caught, the more work has been wasted.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Write, audit, publish ----------------------------------------------------------------------- */

export function Wap() {
  const [s, set] = useSceneState<WhereState>();
  const st = WAP_STEPS[s.wap] ?? WAP_STEPS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Write, audit, publish"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper
            step={s.wap}
            count={WAP_STEPS.length}
            onChange={(n) => set({ wap: n })}
            label={st.title}
          />
          <div className="flex items-center gap-3 text-xs">
            <div className="border-viz-data bg-viz-data/10 rounded-lg border px-3 py-2">
              <p className="font-mono">main</p>
              <p className="text-muted text-[10px]">
                {s.wap < 2 ? "yesterday's data" : "today's audited data"}
              </p>
            </div>
            <span className="text-muted">
              {s.wap < 2 ? "←  dashboards read this" : "⇐ fast-forwarded"}
            </span>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                s.wap === 2 ? "border-line text-subtle" : "border-accent bg-accent-soft",
              )}
            >
              <p className="font-mono">audit_0412</p>
              <p className="text-muted text-[10px]">
                {s.wap === 0 ? "being written" : s.wap === 1 ? "being checked" : "merged"}
              </p>
            </div>
          </div>
          <Code>{st.sql}</Code>
          <FrameCaption frameKey={s.wap} title={st.title}>
            {st.note}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Apache Iceberg syntax (1.2 and later), simplified.
          </p>
        </div>
      }
    >
      <p>
        <Term id="write-audit-publish">Write-Audit-Publish</Term> (WAP) is the gate done properly:
        write new data where consumers can&apos;t see it, audit it, and publish only if it passes.
        Netflix popularised the pattern in a 2017 talk.
      </p>
      <p>
        It&apos;s like a newspaper proof: print a copy, have an editor check it, then run the
        presses. Consumers never see a half-loaded or failed batch.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Branches for data --------------------------------------------------------------------------- */

export function Branches() {
  const cards: [string, string][] = [
    [
      "Apache Iceberg",
      "Branches and tags since version 1.2 (March 2023); WAP writes to a branch, then fast-forwards main.",
    ],
    [
      "Project Nessie",
      "An Iceberg catalogue with git-like branches and merges across many tables.",
    ],
    [
      "lakeFS",
      "Git-like branches over object storage for any format; pre-merge hooks can block a failing merge. Business Source License from v1.87 (September 2026).",
    ],
    ["Delta Lake", "No branches; SHALLOW CLONE makes a cheap copy to test on before merging back."],
    [
      "dbt",
      "Tests on sources check raw assumptions and freshness; dbt build skips anything downstream of a failed test.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Branches for data"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {cards.map(([t, d], i) => (
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
        Table formats and tools increasingly offer branches for data, borrowing the idea from git:
        work on a copy, check it, then merge. That makes WAP cheap, because nothing is physically
        copied.
      </p>
      <p>
        Without branches, the same idea works with a staging table that is swapped in only after
        checks pass.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Where would you check? ---------------------------------------------------------------------- */

export function WhereCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where would you check?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="where-check"
            prompt="Where is the earliest place each check makes sense?"
            categories={[
              { id: "edge", label: "Edge" },
              { id: "middle", label: "Middle" },
              { id: "gate", label: "Gate" },
            ]}
            items={[
              {
                id: "arrived",
                label: "Did today's file arrive by 6 am?",
                category: "edge",
                why: "Only checkable on arrival.",
              },
              {
                id: "columns",
                label: "Does the file have the columns we expect?",
                category: "edge",
                why: "Schema, before anything uses it.",
              },
              {
                id: "join",
                label: "Did the join keep exactly one row per order?",
                category: "middle",
                why: "Right after the join that could break it.",
              },
              {
                id: "whole",
                label: "Is today's whole table consistent with yesterday's before users see it?",
                category: "gate",
                why: "The final audit, before publishing.",
              },
              {
                id: "mapping",
                label: "Did the status mapping produce only known values?",
                category: "middle",
                why: "After the transformation that maps it.",
              },
            ]}
            explanation="Check arrival and shape at the edge, each transformation's guarantees in the middle, and the whole result at the gate before publishing."
          />
        </div>
      }
    >
      <p>Sort the checks.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Edge", "Arrival, freshness, schema, volume."],
  ["Middle", "What each transformation promises."],
  ["Gate", "Audit the whole result before publishing."],
  ["Write-audit-publish", "Consumers never see an unchecked batch."],
  ["Branches make it cheap", "Iceberg, Nessie, lakeFS; staging swaps elsewhere."],
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
      <p>Next: when a check fails, what should happen: warn, block or quarantine.</p>
    </StepLayout>
  );
}
