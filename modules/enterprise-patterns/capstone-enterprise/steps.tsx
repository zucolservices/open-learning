"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, Landmark, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, type Level } from "./model";
import type { CapState } from "./state";

/* 1 ─ The brief ----------------------------------------------------------------------------------- */

const FACTS: [string, string][] = [
  [
    "The system",
    "A 20-year-old mainframe running pensions, disability support and four other schemes.",
  ],
  ["The people", "About 30 lakh citizens paid every month, and 4,000 caseworkers."],
  ["The constraint", "Payments cannot stop, even for a day."],
  [
    "The goal",
    "A citizen portal, faster rule changes, and the old system switched off within five years.",
  ],
];

export function Brief() {
  return (
    <StepLayout
      eyebrow="The brief"
      title="Modernise a benefits system"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-accent/40 bg-accent-soft flex items-center gap-3 rounded-xl border px-4 py-3">
            <Landmark className="text-accent size-6 shrink-0" />
            <p className="text-sm">
              A fictional state&apos;s social welfare department hires you as lead architect.
            </p>
          </div>
          {FACTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[7rem_1fr] gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Everything in this track, in one project. You&apos;ll make seven decisions, each drawing on
        a module: how to organise the teams, where to draw boundaries, how to migrate, how to
        connect to the <Term id="legacy-system">legacy system</Term>, how contexts talk, how to move
        payments, and how to govern it all.
      </p>
      <p>
        Then you&apos;ll see what each decision leads to two years later. There are no marks; change
        your mind as often as you like.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make the decisions ⭐ ----------------------------------------------------------------------- */

export function Choose() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const made = DECISIONS.filter((d) => choices[d.id]).length;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Make the decisions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DECISIONS.map((d) => (
            <div key={d.id} className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-xs font-semibold">
                {d.area} <span className="text-muted font-normal">· module {d.module}</span>
              </p>
              <div className="mt-1 flex flex-col gap-1">
                {d.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={choices[d.id] === opt.id}
                    onClick={() => set({ choices: { ...choices, [d.id]: opt.id } })}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-left text-[11px]",
                      choices[d.id] === opt.id
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-muted text-xs">
            {made < DECISIONS.length
              ? `${DECISIONS.length - made} decisions still open.`
              : "All seven made. Continue to see two years later."}
          </p>
        </div>
      }
    >
      <p>
        Choose what you would really do. Some options are traps that real programmes fall into;
        others are reasonable but costly.
      </p>
      <p>
        Hint: think about who will have to coordinate with whom (Conway&apos;s law), and what
        happens if something goes wrong on the first of the month.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two years later ⭐ -------------------------------------------------------------------------- */

const LEVEL: Record<Level, { cls: string; icon: typeof Check; label: string }> = {
  holds: { cls: "border-good/50 bg-good/10", icon: Check, label: "Holds" },
  strains: { cls: "border-line bg-surface", icon: AlertTriangle, label: "Strains" },
  fails: { cls: "border-bad/60 bg-bad/10", icon: X, label: "Fails" },
};

export function TwoYears() {
  const [s] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const results = DECISIONS.map((d) => ({ d, o: d.options.find((x) => x.id === choices[d.id]) }));
  const counts = { holds: 0, strains: 0, fails: 0 };
  for (const r of results) if (r.o) counts[r.o.level]++;
  return (
    <StepLayout
      eyebrow="Consequences"
      title="Two years later"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            {(["holds", "strains", "fails"] as Level[]).map((l) => (
              <div key={l} className={cn("rounded-lg border px-2 py-1.5", LEVEL[l].cls)}>
                <p className="font-mono text-lg font-semibold">{counts[l]}</p>
                <p className="text-muted text-[10px]">{LEVEL[l].label}</p>
              </div>
            ))}
          </div>
          {results.map(({ d, o }, i) => {
            if (!o)
              return (
                <p
                  key={d.id}
                  className="text-subtle border-line rounded-lg border border-dashed px-3 py-2 text-xs"
                >
                  {d.area}: not decided yet.
                </p>
              );
            const L = LEVEL[o.level];
            const Icon = L.icon;
            return (
              <motion.div
                key={d.id + o.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className={cn("flex gap-2 rounded-lg border px-3 py-2", L.cls)}
              >
                <Icon
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0",
                    o.level === "holds"
                      ? "text-good"
                      : o.level === "fails"
                        ? "text-bad"
                        : "text-muted",
                  )}
                />
                <div>
                  <p className="text-xs font-semibold">
                    {d.area} <span className="text-muted font-normal">· see module {d.module}</span>
                  </p>
                  <p className="text-muted text-[11px]">{o.later}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      }
    >
      <p>
        Two years in. Each decision plays out; the module it draws on is linked so you can revisit
        it. Go back and change any choice to see a different future.
      </p>
      <p>
        The pattern behind the good outcomes: small, reversible steps; boundaries that match teams;
        translation at the edge of legacy; and evidence (parallel runs, fitness functions) before
        anyone is affected.
      </p>
    </StepLayout>
  );
}

/* 4 ─ It happened for real ------------------------------------------------------------------------ */

const ECHOES: { t: string; when: string; d: string }[] = [
  {
    t: "New Jersey unemployment claims",
    when: "April 2020",
    d: "Claims surged and the 40-plus-year-old systems struggled; the governor asked for volunteers who knew COBOL. The risk was skills, not just hardware.",
  },
  {
    t: "UK Universal Credit",
    when: "2010 onwards",
    d: "Due to complete in 2017; reset in 2013. A twin track followed: the old 'live service' kept running while a new digital 'full service' was built incrementally. The National Audit Office found in 2018 that it hadn't delivered value for money; in 2024 completion was expected in 2028.",
  },
  {
    t: "HealthCare.gov",
    when: "October 2013",
    d: "Launched to outages; investigators blamed the absence of clear leadership and weak oversight. A 'badgeless' team practising 'ruthless prioritization' recovered it within about two months, and the US Digital Service was founded in 2014 (renamed in 2025).",
  },
  {
    t: "India's Direct Benefit Transfer",
    when: "since 1 January 2013",
    d: "Benefits paid straight to bank accounts, enabled by Jan Dhan accounts, Aadhaar and mobile numbers (JAM), with NPCI's Aadhaar Payment Bridge routing payments. ₹53.7 lakh crore transferred in total, as of 4 October 2026.",
  },
];

export function Echoes() {
  return (
    <StepLayout
      eyebrow="Real programmes"
      title="It happened for real"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ECHOES.map((e, i) => (
            <motion.div
              key={e.t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">
                {e.t}{" "}
                <span className="text-muted font-mono text-[11px] font-normal">· {e.when}</span>
              </p>
              <p className="text-muted text-xs">{e.d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Government benefit systems are where these patterns matter most: millions of people, money
        that must arrive on time, and systems older than many of the engineers working on them.
      </p>
      <p>
        Notice the lessons. Incremental delivery let Universal Credit adjust as it learned, but
        didn&apos;t rescue the original timetable. HealthCare.gov&apos;s recovery came from team
        structure and priorities as much as code. And India&apos;s DBT built shared rails (identity,
        accounts, a payment router) that many schemes plug into: platform thinking at national
        scale.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which pattern helps? ------------------------------------------------------------------------ */

export function WhichPattern() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which pattern helps?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="capstone-patterns"
            prompt="Which pattern from this track best addresses each problem?"
            categories={[
              { id: "teams", label: "Team design" },
              { id: "contexts", label: "Bounded contexts" },
              { id: "strangler", label: "Strangler fig" },
              { id: "acl", label: "Anticorruption layer" },
            ]}
            items={[
              {
                id: "waiting",
                label: "Every feature needs three teams, who wait on each other",
                category: "teams",
                why: "Conway's law: reorganise around streams.",
              },
              {
                id: "word",
                label: "'Beneficiary' means three different things in three departments",
                category: "contexts",
                why: "Give each meaning its own context.",
              },
              {
                id: "cantstop",
                label: "The old system can't be switched off, but must be replaced",
                category: "strangler",
                why: "Replace it piece by piece behind a façade.",
              },
              {
                id: "codes",
                label: "Legacy status codes are spreading through the new services",
                category: "acl",
                why: "Translate at the boundary.",
              },
            ]}
            explanation="People problems need team design; meaning problems need boundaries; replacement needs incremental migration; legacy leakage needs translation."
          />
        </div>
      }
    >
      <p>One last sort across the whole track.</p>
    </StepLayout>
  );
}

/* 6 ─ What you can do now ------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Design teams and systems together", "Conway's law and Team Topologies."],
  ["Draw boundaries", "Shared language, bounded contexts, context maps, aggregates."],
  ["Connect systems well", "Integration styles, messaging, routing, orchestration."],
  ["Structure for change", "Hexagons, modular monoliths, events, data ownership."],
  [
    "Change what you can't switch off",
    "Strangler fig, legacy bubbles, ADRs, governance that guides.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Track complete"
      title="What you can do now"
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
        Remember Priya from module 1: one fact, many copies, many pipes. You now have names for
        every part of that picture, and patterns to make it less fragile.
      </p>
      <p>
        Related tracks: System Design for sagas and event-driven systems, API Design for the
        contracts between services, and Streaming Data for change data capture and event logs.
      </p>
    </StepLayout>
  );
}
