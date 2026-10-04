"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CONTEXTS, PIECES, type Ctx } from "./model";
import type { BcState } from "./state";

/* 1 ─ What's a meter? ----------------------------------------------------------------------------- */

const METERS: [string, string][] = [
  ["Connections", "the link between the grid and a location"],
  ["Billing", "the link between the grid and a customer"],
  ["Field engineers", "the physical box, replaced if faulty"],
];

export function Meter() {
  return (
    <StepLayout
      eyebrow="Story"
      title="What's a meter?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-center font-mono text-2xl">&ldquo;meter&rdquo;</p>
          {METERS.map(([who, means], i) => (
            <motion.div
              key={who}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid grid-cols-[7rem_1fr] gap-2 rounded-lg border px-3 py-2"
            >
              <span className="text-accent text-xs font-semibold">{who}</span>
              <span className="text-sm">{means}</span>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            Team names are our illustration of Fowler&apos;s three meanings.
          </p>
        </div>
      }
    >
      <p>
        Martin Fowler once worked with an electricity company where &ldquo;meter&rdquo; meant subtly
        different things to different parts of the organisation: the connection to a location, the
        connection to a customer, or the physical device. &ldquo;These subtle polysemes could be
        smoothed over in conversation but not in the precise world of computers.&rdquo;
      </p>
      <p>
        Evans&apos;s conclusion: &ldquo;Multiple models are in play on any large project&rdquo;, and
        that&apos;s fine, as long as each has clear edges. &ldquo;Model expressions, like any other
        phrase, only have meaning in context.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Split the Customer ⭐ ----------------------------------------------------------------------- */

export function SplitIt() {
  const [s, set] = useSceneState<BcState>();
  const placed = s.placed ?? {};
  const done = PIECES.every((p) => placed[p.id]);
  const misplaced = PIECES.filter((p) => placed[p.id] && placed[p.id] !== p.home);
  return (
    <StepLayout
      eyebrow="Build"
      title="Split the Customer"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            {PIECES.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-1.5">
                <span className="w-full font-mono text-[11px] sm:w-32">{p.label}</span>
                {(Object.keys(CONTEXTS) as Ctx[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={placed[p.id] === c}
                    onClick={() => set({ placed: { ...placed, [p.id]: c } })}
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[10px]",
                      placed[p.id] === c
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {CONTEXTS[c].name}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(CONTEXTS) as Ctx[]).map((c) => (
              <div key={c} className="border-accent/50 rounded-xl border border-dashed px-2.5 py-2">
                <p className="text-accent text-[10px] font-semibold uppercase">
                  {CONTEXTS[c].name} context
                </p>
                <p className="mt-1 font-mono text-[11px] font-semibold">{CONTEXTS[c].calls}</p>
                <p className="text-muted font-mono text-[10px]">customerId</p>
                {PIECES.filter((p) => placed[p.id] === c).map((p) => (
                  <motion.p
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn("font-mono text-[10px]", p.home !== c && "text-bad")}
                  >
                    {p.label}
                  </motion.p>
                ))}
              </div>
            ))}
          </div>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                misplaced.length ? "border-line bg-surface" : "border-good/50 bg-good/10",
              )}
            >
              {misplaced.length
                ? misplaced.map((p) => (
                    <p key={p.id} className="text-xs">
                      <span className="font-mono">{p.label}</span>: {p.why}
                    </p>
                  ))
                : "Four small models, each with its own name for the person and only the facts it needs. They share just an ID."}
            </motion.div>
          )}
          {Object.keys(placed).length > 0 && (
            <button
              type="button"
              onClick={() => set({ placed: {} })}
              className="text-muted flex items-center gap-1 self-end text-xs"
            >
              <RotateCcw className="size-3" /> Start again
            </button>
          )}
        </div>
      }
    >
      <p>
        Back to the insurer&apos;s overloaded Customer. Give each piece of data a home: the context
        where it means something. Each context gets its own small model, even its own name for the
        person.
      </p>
      <p>
        A <Term id="bounded-context">bounded context</Term> is, in Evans&apos;s words, &ldquo;a
        description of a boundary (typically a subsystem, or the work of a particular team) within
        which a particular model is defined and applicable.&rdquo; Inside it, one language; across
        the boundary, you translate, usually through a shared ID.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Core, supporting, generic ------------------------------------------------------------------- */

const KINDS: { t: string; d: string; ex: string; act: string }[] = [
  {
    t: "Core domain",
    d: "What makes the business valuable and different. Evans: “Make the core small. Apply top talent to the core domain.”",
    ex: "Pricing risk; assessing claims",
    act: "Build it, with your best people",
  },
  {
    t: "Supporting subdomain",
    d: "Specific to this business but not where it competes.",
    ex: "Agent commission rules",
    act: "Build it simply, or outsource",
  },
  {
    t: "Generic subdomain",
    d: "Every business needs it. Evans: “consider off-the-shelf solutions”.",
    ex: "Accounting, email, identity",
    act: "Buy or use a service",
  },
];

export function ThreeKinds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Core, supporting, generic"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {KINDS.map((k, i) => (
            <motion.div
              key={k.t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className={cn(
                "rounded-lg border px-3 py-2",
                i === 0 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">{k.t}</p>
                <p className="text-accent text-[11px]">{k.act}</p>
              </div>
              <p className="text-muted text-xs">{k.d}</p>
              <p className="mt-0.5 text-[11px]">e.g. {k.ex}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Not every context deserves the same care. Evans distinguishes the{" "}
        <Term id="core-domain">core domain</Term> from{" "}
        <Term id="generic-subdomain">generic subdomains</Term>; Vaughn Vernon&apos;s books (2013,
        2016) popularised a three-way split, adding{" "}
        <Term id="supporting-subdomain">supporting subdomains</Term> between them.
      </p>
      <p>
        The point is investment. Spend design effort where it makes a difference, and don&apos;t
        hand-build a payroll system when your business is insurance.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Boundaries and teams ------------------------------------------------------------------------ */

const RULES: [string, string][] = [
  [
    "Draw them on purpose",
    "Evans: “Explicitly set boundaries in terms of team organization, usage within specific parts of the application, and physical manifestations such as code bases and database schemas.”",
  ],
  [
    "One owner",
    "A common rule of thumb, from Vernon: one team per bounded context. A team may own several; several teams sharing one is trouble.",
  ],
  ["Name them", "“Name each bounded context, and make the names part of the ubiquitous language.”"],
  [
    "Not always a microservice",
    "A context can be one service, several, or a module inside a larger system. It's a boundary of meaning first.",
  ],
];

export function BoundariesTeams() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Boundaries and teams"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {RULES.map(([t, d], i) => (
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
        Here Conway&apos;s law from module 2 meets domain modelling. If a bounded context is owned
        by one team, the model and the team&apos;s conversations line up, and the boundary holds.
      </p>
      <p>
        Evans also warns against chasing one model for everything: as Fowler quotes him, total
        unification &ldquo;will not be feasible or cost-effective&rdquo; for a large system.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Build or buy? ------------------------------------------------------------------------------- */

export function WhichKind() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Build or buy?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-subdomain"
            prompt="For a food-delivery company, which kind of subdomain is each?"
            categories={[
              { id: "core", label: "Core" },
              { id: "supporting", label: "Supporting" },
              { id: "generic", label: "Generic" },
            ]}
            items={[
              {
                id: "dispatch",
                label: "Matching orders to riders in real time",
                category: "core",
                why: "Where the company wins or loses.",
              },
              {
                id: "eta",
                label: "Predicting delivery times",
                category: "core",
                why: "A competitive edge customers notice.",
              },
              {
                id: "onboarding",
                label: "Onboarding restaurants onto the platform",
                category: "supporting",
                why: "Specific to the business, but not where it competes.",
              },
              {
                id: "payroll",
                label: "Paying office staff salaries",
                category: "generic",
                why: "Every company needs it; buy it.",
              },
              {
                id: "sms",
                label: "Sending SMS notifications",
                category: "generic",
                why: "A commodity service.",
              },
            ]}
            explanation="Invest design effort in the core, keep supporting parts simple, and buy generic ones."
          />
        </div>
      }
    >
      <p>Decide where a food-delivery company should invest its best engineers.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Many models", "One per context, not one for the whole company."],
  ["Bounded context", "A boundary within which one model and one language apply."],
  ["Share an ID, not a model", "Contexts translate at their edges."],
  ["Invest in the core", "Buy the generic, keep the supporting simple."],
  ["Owned by one team", "Boundaries line up with teams."],
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
        Contexts still have to work together: claims needs to know if billing says a policy is paid.
        Next: context maps, the kinds of relationship between contexts.
      </p>
    </StepLayout>
  );
}
