"use client";

import { motion } from "motion/react";
import { Check, Minus, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PATHS, assess, type Path } from "./model";
import type { LegacyState } from "./state";

/* 1 ─ Wanted: COBOL programmers ------------------------------------------------------------------- */

export function CobolCall() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Wanted: COBOL programmers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Two weeks, early 2020",
              "More than 362,000 New Jersey residents file for unemployment.",
            ],
            ["The systems", "Claims run on mainframes about 40 years old, written in COBOL."],
            ["6 April 2020", "The state asks for volunteers who can program COBOL."],
            ["The governor", "“How did we get here where we literally needed COBOL programmers?”"],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid grid-cols-[8rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-semibold">{t}</span>
              <span>{d}</span>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">Sources: CNBC, 6 April 2020; CNN, 8 April 2020.</p>
        </div>
      }
    >
      <p>
        When the pandemic hit in 2020, US states saw unemployment claims explode. Several found
        their claims systems ran on decades-old <Term id="mainframe">mainframes</Term> in COBOL, and
        few people left knew how to change them. New Jersey publicly asked for volunteers.
      </p>
      <p>
        Those systems weren&apos;t a mistake. They had run reliably for decades. The problem was
        that nothing around them had been built to change. This module is about connecting new
        systems to old ones you can&apos;t yet replace.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Connect to the mainframe ⭐ ----------------------------------------------------------------- */

export function Connect() {
  const [s, set] = useSceneState<LegacyState>();
  const rows = assess(s.path, s.acl);
  return (
    <StepLayout
      eyebrow="Build"
      title="Connect to the mainframe"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {(Object.keys(PATHS) as Path[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.path === k}
                onClick={() => set({ path: k })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs",
                  s.path === k
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {PATHS[k].name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.acl}
              onChange={(e) => set({ acl: e.target.checked })}
              className="accent-accent"
            />
            Translate through an anticorruption layer
          </label>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
            <span className="border-viz-add bg-viz-add/10 rounded-md border px-2 py-1.5">
              Pension app
            </span>
            <span className="text-muted">→</span>
            {s.acl && (
              <>
                <span className="border-accent bg-accent-soft rounded-md border px-2 py-1.5">
                  ACL
                </span>
                <span className="text-muted">→</span>
              </>
            )}
            {s.path === "api" && (
              <>
                <span className="border-viz-data bg-viz-data/10 rounded-md border px-2 py-1.5">
                  API wrapper
                </span>
                <span className="text-muted">→</span>
              </>
            )}
            {s.path === "cdc" && (
              <>
                <span className="border-viz-data bg-viz-data/10 rounded-md border px-2 py-1.5">
                  own copy ← CDC
                </span>
                <span className="text-muted">←</span>
              </>
            )}
            <span className="border-viz-idle bg-viz-idle/15 rounded-md border px-2 py-1.5">
              Mainframe (1990s)
            </span>
          </div>
          <p className="text-muted text-center text-xs">{PATHS[s.path].how}</p>
          <div className="flex flex-col gap-1.5">
            {rows.map(([t, v, d], i) => (
              <motion.div
                key={s.path + s.acl + t}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "flex gap-2 rounded-lg border px-3 py-2",
                  v === "good"
                    ? "border-good/40 bg-good/5"
                    : v === "bad"
                      ? "border-bad/40 bg-bad/5"
                      : "border-line bg-surface",
                )}
              >
                {v === "good" ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : v === "bad" ? (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <Minus className="text-muted mt-0.5 size-3.5 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-semibold">{t}</p>
                  <p className="text-muted text-[11px]">{d}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Illustrative.</p>
        </div>
      }
    >
      <p>
        A new pension self-service app needs policy data from a 1990s mainframe. Try each way in,
        with and without an <Term id="anticorruption-layer">anticorruption layer</Term>. Microsoft
        describes the layer as a façade or adapter &ldquo;between different subsystems that
        don&apos;t share the same semantics&rdquo;.
      </p>
      <p>
        <Term id="cdc">Change data capture</Term> is often the gentlest way out: it reads the
        database&apos;s own change log, so the old applications don&apos;t change at all.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Four strategies ----------------------------------------------------------------------------- */

const STRATEGIES: [string, string][] = [
  [
    "Bubble context",
    "A small, clean bounded context for one piece of new work, drawing all its data from legacy through an ACL, “like an umbilical cord”.",
  ],
  [
    "Autonomous bubble",
    "Has its own data store, kept in step by a synchronising ACL, so it can run for a while cut off from legacy.",
  ],
  [
    "Exposing legacy assets as services",
    "An open-host service over an ACL, so many new systems can use what legacy does well.",
  ],
  ["Expanding a bubble", "Growing a bubble's scope gradually as the new model proves itself."],
];

export function Bubbles() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four strategies"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {STRATEGIES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
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
        Eric Evans&apos;s 2013 paper &ldquo;Getting Started with DDD When Surrounded by Legacy
        Systems&rdquo; starts bluntly: such attempts &ldquo;almost always disappoint&rdquo;, and
        legacy replacement &ldquo;is usually a bad strategy&rdquo;. Instead he describes four
        strategies.
      </p>
      <p>
        The simplest is the <Term id="bubble-context">bubble context</Term>. Its honest warning:
        often &ldquo;the bubble bursts&rdquo; and the clean code is reabsorbed by the legacy, yet
        &ldquo;the new functionality does not disappear.&rdquo; An{" "}
        <Term id="autonomous-bubble">autonomous bubble</Term>, with its own data, lasts longer.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Still here ---------------------------------------------------------------------------------- */

export function StillHere() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Still here"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-sm font-semibold">IBM&apos;s claims (2026)</p>
            <p className="text-muted">
              43 of the world&apos;s top 50 banks and 8 of the top 10 payment companies rely on the
              mainframe as their core platform; mainframes handle over 70% of transactional
              workloads. The latest model, the z17, was announced in April 2025.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-sm font-semibold">COBOL, as estimated in 2017</p>
            <p className="text-muted">
              Reuters compiled industry estimates: 220 billion lines in use, 43% of banking systems
              built on it, 95% of ATM swipes relying on it. Old and approximate, but the order of
              magnitude explains New Jersey.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-sm font-semibold">Getting data out</p>
            <p className="text-muted">
              Debezium (open source) captures changes from MySQL, PostgreSQL, Oracle, Db2, SQL
              Server and others. IBM Data Replication covers mainframe sources including Db2 for
              z/OS, with IBM&apos;s Classic CDC for older stores such as IMS and VSAM.
            </p>
          </div>
          <Code>{`POL-STAT-CD  PIC X(2).   *> legacy: 'A7' = active, 'L3' = lapsed…
# ACL: PolicyStatus.from_legacy("A7") -> PolicyStatus.ACTIVE`}</Code>
        </div>
      }
    >
      <p>
        Mainframes are not museum pieces. They remain the core of many banks, insurers and
        governments because they are fast, reliable and hold decades of business rules.
      </p>
      <p>
        The risk is less the hardware than the shrinking pool of people who understand the code.
        Every connection you build to a mainframe should keep its quirks at the edge, in a
        translation layer someone can read.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which strategy? ----------------------------------------------------------------------------- */

export function WhichStrategy() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which strategy?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-strategy"
            prompt="Which of Evans's strategies fits each situation?"
            categories={[
              { id: "bubble", label: "Bubble context" },
              { id: "autonomous", label: "Autonomous bubble" },
              { id: "service", label: "Legacy as a service" },
            ]}
            items={[
              {
                id: "feature",
                label: "A small team adds a new benefits calculator that only reads legacy data",
                category: "bubble",
                why: "A clean model for one effort, fed through an ACL.",
              },
              {
                id: "offline",
                label:
                  "A new portal must keep showing statements while the mainframe runs its overnight batch",
                category: "autonomous",
                why: "Its own synced copy lets it run cut off for a while.",
              },
              {
                id: "many",
                label: "Six new apps all need the mainframe's tried-and-tested premium calculation",
                category: "service",
                why: "One open-host service over an ACL serves them all.",
              },
              {
                id: "eligibility",
                label: "Mobile, web and partner apps all need the legacy eligibility check",
                category: "service",
                why: "Expose what legacy does well, once.",
              },
            ]}
            explanation="Bubble: a clean island fed through translation. Autonomous bubble: plus its own data. Legacy as a service: share legacy's strengths through one well-defined interface."
          />
        </div>
      }
    >
      <p>Pick the strategy for each.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Legacy is valuable", "Decades of rules that work; respect them."],
  ["Translate at the edge", "An anticorruption layer keeps legacy codes out."],
  ["Prefer APIs or CDC", "Never read old tables straight into new code."],
  ["Bubbles", "Clean islands, fed through translation, sometimes with their own data."],
  ["Mind the skills", "Keep the knowledge of old systems alive and written down."],
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
        Every choice in this chapter is a decision someone will question in five years. Next: how to
        record architecture decisions, and check automatically that they still hold.
      </p>
    </StepLayout>
  );
}
