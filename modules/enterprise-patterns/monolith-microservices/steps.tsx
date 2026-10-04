"use client";

import { motion } from "motion/react";
import { Building, Home, Warehouse } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SHAPES, assess, type Shape } from "./model";
import type { MmState } from "./state";

/* 1 ─ One house or a street? ---------------------------------------------------------------------- */

const HOUSES = [
  {
    icon: Warehouse,
    t: "One big open house",
    d: "Everyone shares every room. Cosy until the family grows.",
    m: "Monolith",
  },
  {
    icon: Building,
    t: "One house, locked rooms",
    d: "Shared roof and plumbing; each room has its own key.",
    m: "Modular monolith",
  },
  {
    icon: Home,
    t: "A street of houses",
    d: "Each family independent, each with its own utilities, bills and repairs.",
    m: "Microservices",
  },
];

export function Houses() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One house or a street?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {HOUSES.map(({ icon: Icon, t, d, m }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex gap-3 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent mt-0.5 size-6 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
                <p className="text-accent mt-1 font-mono text-[11px]">≈ {m}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A growing family can share one open house, lock rooms off inside it, or move into separate
        houses on the same street. Separate houses give independence, and every one needs its own
        boiler, bills and repairs.
      </p>
      <p>
        Software has the same choice: a <Term id="monolith">monolith</Term>, a{" "}
        <Term id="modular-monolith">modular monolith</Term> or{" "}
        <Term id="microservices">microservices</Term>. With bounded contexts (module 4) you know
        where the walls could go. This module is about whether they should be internal walls or
        separate buildings.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One, five or fifty ⭐ ----------------------------------------------------------------------- */

export function HowMany() {
  const [s, set] = useSceneState<MmState>();
  const sh = SHAPES[s.shape];
  const a = assess(s.shape, s.teams);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One, five or fifty"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {(Object.keys(SHAPES) as Shape[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.shape === k}
                onClick={() => set({ shape: k })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs",
                  s.shape === k
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {SHAPES[k].name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">teams</span>
            <input
              type="range"
              min={1}
              max={20}
              value={s.teams}
              onChange={(e) => set({ teams: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-6 text-right font-mono">{s.teams}</span>
          </label>
          <div className="flex min-h-14 flex-wrap content-start gap-1">
            {Array.from({ length: sh.deployables }, (_, i) => (
              <motion.span
                key={`${s.shape}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.01 * i }}
                className={cn(
                  "border-viz-data bg-viz-data/15 rounded",
                  sh.deployables === 1
                    ? "h-12 w-full"
                    : sh.deployables === 5
                      ? "h-10 w-16"
                      : "size-5",
                  s.shape === "modular" && "grid grid-cols-4 gap-1 border p-1",
                  s.shape !== "modular" && "border",
                )}
              >
                {s.shape === "modular" &&
                  ["orders", "billing", "stock", "users"].map((m) => (
                    <span
                      key={m}
                      className="border-viz-data/60 grid place-items-center rounded-sm border border-dashed text-[9px]"
                    >
                      {m}
                    </span>
                  ))}
              </motion.span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["things to deploy", String(sh.deployables)],
              ["network hops per request", String(sh.hops)],
              ["services per team", sh.deployables === 1 ? "1, shared by all" : String(a.perTeam)],
              ["boundaries", sh.boundaries],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="text-xs font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <motion.p
            key={s.shape + s.teams}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              a.tone === "good"
                ? "border-good/50 bg-good/10"
                : a.tone === "bad"
                  ? "border-bad/50 bg-bad/10"
                  : "border-line bg-surface",
            )}
          >
            {a.verdict}
          </motion.p>
          <p className="text-subtle text-[10px]">Rules of thumb, not formulas. Illustrative.</p>
        </div>
      }
    >
      <p>
        Choose how many deployable pieces to split a system into, and how many teams work on it.
        Start with 50 services and 3 teams, then try other combinations.
      </p>
      <p>
        Microservices buy independent releases at the cost of networks, partial failures, more
        monitoring and more automation. Martin Fowler calls this the{" "}
        <Term id="microservice-premium">microservice premium</Term>: worth paying only for systems
        complex enough, and organisations large enough, to need it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What a microservice is ---------------------------------------------------------------------- */

export function Definitions() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What a microservice is"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <blockquote className="border-accent bg-surface rounded-r-xl border-l-2 px-4 py-3 text-sm">
            &ldquo;An approach to developing a single application as a suite of small services, each
            running in its own process and communicating with lightweight mechanisms… built around
            business capabilities and independently deployable by fully automated deployment
            machinery.&rdquo;
            <p className="text-muted mt-1 text-xs">— James Lewis and Martin Fowler, 2014</p>
          </blockquote>
          <blockquote className="border-viz-meta bg-surface rounded-r-xl border-l-2 px-4 py-3 text-sm">
            &ldquo;A microservice is one of those where it is independently deployable so I can make
            a change to it and I can roll out new versions of it without having to change any other
            part of my system.&rdquo;
            <p className="text-muted mt-1 text-xs">— Sam Newman, InfoQ podcast</p>
          </blockquote>
          <blockquote className="border-viz-compute bg-surface rounded-r-xl border-l-2 px-4 py-3 text-sm">
            &ldquo;Almost all the successful microservice stories have started with a monolith that
            got too big and was broken up.&rdquo;
            <p className="text-muted mt-1 text-xs">— Martin Fowler, MonolithFirst, 2015</p>
          </blockquote>
        </div>
      }
    >
      <p>
        Size isn&apos;t the point. The defining property is{" "}
        <Term id="independent-deployability">independent deployability</Term>: change one service
        and release it without touching or coordinating the others. Newman adds that avoiding shared
        databases is &ldquo;really about achieving that independent deployability.&rdquo;
      </p>
      <p>
        Fowler&apos;s warning from the same essay: systems built as microservices from scratch have,
        in the cases he heard of, &ldquo;ended up in serious trouble.&rdquo; Get the boundaries
        right inside one deployable first.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Real stories -------------------------------------------------------------------------------- */

const STORIES: { t: string; when: string; d: string }[] = [
  {
    t: "Shopify",
    when: "2019–20",
    d: "One of the largest Ruby on Rails codebases, worked on by more than a thousand developers, evolved into a modular monolith: one codebase, components organised by business concept. Its open-source tool Packwerk enforces dependency and privacy boundaries.",
  },
  {
    t: "Segment",
    when: "2018",
    d: "Had grown to over 140 services, one per data destination, with three full-time engineers spending most of their time keeping it alive. Consolidated them into a single service.",
  },
  {
    t: "Amazon Prime Video",
    when: "2023",
    d: "One audio/video quality-monitoring tool, built from Step Functions, Lambda and S3, was moved into a single process on EC2 and ECS, cutting its infrastructure cost by over 90%. One tool, not all of Prime Video; the original post is now offline (archived copy).",
  },
  {
    t: "Uber",
    when: "2020",
    d: "Around 2,200 critical microservices. Rather than merging them, Uber grouped them into about 70 domains: domain-oriented microservice architecture.",
  },
];

export function Stories() {
  return (
    <StepLayout
      eyebrow="Real stories"
      title="Real stories"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {STORIES.map((st, i) => (
            <motion.div
              key={st.t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">
                {st.t}{" "}
                <span className="text-muted font-mono text-[11px] font-normal">· {st.when}</span>
              </p>
              <p className="text-muted text-xs">{st.d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        These stories get passed around as &ldquo;microservices are dead&rdquo; or &ldquo;monoliths
        are back&rdquo;. Read carefully, they say something narrower: each organisation matched the
        number of deployables to its teams and its problem.
      </p>
      <p>
        Segment and Prime Video had split further than their problem needed. Shopify kept one
        deployable but enforced the boundaries. Uber needed many services and added structure on
        top.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Pick a shape -------------------------------------------------------------------------------- */

export function PickShape() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick a shape"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="pick-shape"
            prompt="A state government department is building a new grants portal with two teams of six. The domain has four clear areas (applications, assessment, payments, reporting), and the rules will change often in the first year. What shape should they start with?"
            options={[
              {
                id: "micro",
                label: "Twelve microservices, three per area, on Kubernetes",
                feedback:
                  "Two teams running twelve services pay the premium with no one to share it.",
              },
              {
                id: "modular",
                label: "A modular monolith with four modules and enforced boundaries",
                correct: true,
                feedback: "One thing to deploy, clear boundaries, and the option to split later.",
              },
              {
                id: "mud",
                label: "A single codebase with no internal structure; split it later if needed",
                feedback: "Without boundaries, 'later' becomes a rewrite.",
              },
              {
                id: "two",
                label: "Two services, one per team, split by front end and back end",
                feedback: "A technical split means every feature needs both teams (module 2).",
              },
            ]}
            explanation="Small teams and changing rules favour one deployable with strong internal boundaries. Split out a module when a team or a scaling need demands it."
          />
        </div>
      }
    >
      <p>Use the domain, the teams and the rate of change.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Independent deployability", "The point of microservices, not their size."],
  ["The premium", "Networks, failures, operations: pay only when needed."],
  ["Modular monolith", "Boundaries without distribution; a strong default."],
  ["Match the teams", "Deployables follow team ownership."],
  ["Read stories carefully", "One tool's rewrite isn't a trend."],
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
        Next: a style that changes how data itself is stored, keeping every change as an event, and
        separating reads from writes.
      </p>
    </StepLayout>
  );
}
