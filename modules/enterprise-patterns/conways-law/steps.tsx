"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, ORGS, pairs, teamsInvolved, type Change, type Org } from "./model";
import type { ConwayState } from "./state";

/* 1 ─ How do committees invent? ------------------------------------------------------------------- */

export function Committees() {
  return (
    <StepLayout
      eyebrow="Story"
      title="How do committees invent?"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="grid w-full max-w-md grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-col gap-1.5">
              <p className="text-muted text-center text-[10px]">who talks to whom</p>
              {["Team A", "Team B", "Team C"].map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="border-viz-compute bg-viz-compute/10 rounded-lg border px-3 py-2 text-center text-xs"
                >
                  {t}
                </motion.div>
              ))}
            </div>
            <ArrowRight className="text-muted size-5" />
            <div className="flex flex-col gap-1.5">
              <p className="text-muted text-center text-[10px]">what gets built</p>
              {["Part A", "Part B", "Part C"].map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + 0.1 * i }}
                  className="border-viz-data bg-viz-data/10 rounded-lg border px-3 py-2 text-center font-mono text-xs"
                >
                  {t}
                </motion.div>
              ))}
            </div>
          </div>
          <blockquote className="border-accent bg-surface max-w-md rounded-r-xl border-l-2 px-4 py-3 text-sm">
            &ldquo;Organizations which design systems &hellip; are constrained to produce designs
            which are copies of the communication structures of these organizations.&rdquo;
            <p className="text-muted mt-1 text-xs">— Melvin Conway, Datamation, April 1968</p>
          </blockquote>
        </div>
      }
    >
      <p>
        Give a compiler to three teams and you tend to get a three-part compiler. Not because anyone
        planned it, but because each team builds what it can build without constantly asking the
        others, and the joins fall where the teams meet.
      </p>
      <p>
        Mel Conway noticed this in 1967. Harvard Business Review turned his paper down because, he
        says, he &ldquo;had not proved&rdquo; it; Datamation published it in 1968. Fred Brooks later
        named the idea <Term id="conways-law">Conway&apos;s law</Term>. Note what gets copied: how
        people actually communicate, which isn&apos;t always the official org chart.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Reorganise the teams ⭐ --------------------------------------------------------------------- */

export function Reorganise() {
  const [s, set] = useSceneState<ConwayState>();
  const o = ORGS[s.org];
  const involved = teamsInvolved(s.org, s.change);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Reorganise the teams"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Org>
            size="sm"
            value={s.org}
            onChange={(org) => set({ org })}
            options={(Object.keys(ORGS) as Org[]).map((k) => [k, ORGS[k].name])}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <p className="text-muted text-[10px]">teams</p>
              {o.teams.map((t) => (
                <motion.div
                  key={t}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs",
                    involved.includes(t)
                      ? "border-viz-compute bg-viz-compute/15"
                      : "border-line bg-surface",
                  )}
                >
                  {t}
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-muted text-[10px]">the system they build</p>
              {o.parts.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className={cn(
                    "border-viz-data bg-viz-data/10 rounded-lg border px-3 py-2 font-mono text-xs",
                    s.org === "one" && "border-dashed py-6 text-center",
                  )}
                >
                  {p}
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-muted text-xs">{o.note}</p>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-xs font-semibold">Now ship a change:</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {(Object.keys(CHANGES) as Change[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={s.change === c}
                  onClick={() => set({ change: c })}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px]",
                    s.change === c
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {CHANGES[c].name}
                </button>
              ))}
            </div>
            <motion.p
              key={s.org + s.change}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-2 text-sm",
                s.org === "streams" && involved.length === 1 ? "text-good" : "text-fg",
              )}
            >
              {s.org === "one"
                ? `One team, but ${pairs(24)} possible conversations among 24 people.`
                : `${involved.length} team${involved.length > 1 ? "s" : ""} must coordinate: ${involved.join(", ")}.`}
            </motion.p>
          </div>
          <p className="text-subtle text-[10px]">
            A fictional company with 24 engineers. Illustrative.
          </p>
        </div>
      }
    >
      <p>
        A food-delivery company has 24 engineers. Organise them three ways and watch the system each
        organisation tends to produce, then ship a change and count who has to agree.
      </p>
      <p>
        Organising by technology makes every feature a three-team project. Organising by business
        stream lets most changes stay inside one team. This is the{" "}
        <Term id="inverse-conway">inverse Conway manoeuvre</Term>: shape the teams, and how they
        communicate, to get the architecture you want.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Four team types ----------------------------------------------------------------------------- */

const TYPES: [string, string][] = [
  [
    "Stream-aligned",
    "Aligned to a flow of work from (usually) a segment of the business domain. Most teams should be this kind.",
  ],
  [
    "Platform",
    "Provides a compelling internal product, such as a deployment platform, that speeds up stream-aligned teams.",
  ],
  [
    "Enabling",
    "Helps stream-aligned teams overcome obstacles and pick up missing skills, then moves on.",
  ],
  [
    "Complicated-subsystem",
    "Owns a part that needs deep specialist knowledge, such as a pricing algorithm.",
  ],
];

const MODES: [string, string][] = [
  ["Collaboration", "Working together for a defined time to discover something new."],
  ["X-as-a-Service", "One team provides something; the other consumes it with little contact."],
  ["Facilitating", "One team helps and mentors another."],
];

export function Topologies() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four team types"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {TYPES.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 * i }}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  i === 0 ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-xs font-semibold">Three ways teams interact</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {MODES.map(([t, d]) => (
              <div key={t} className="border-line bg-surface-2 rounded-lg px-3 py-2">
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted text-[11px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        If teams shape systems, design the teams. Matthew Skelton and Manuel Pais&apos;s{" "}
        <Term id="team-topologies">Team Topologies</Term> (2019; second edition September 2025)
        offers a small vocabulary: four team types and three ways for them to interact. Most teams
        should be <Term id="stream-aligned-team">stream-aligned</Term>.
      </p>
      <p>
        Its key design factor is <Term id="cognitive-load">cognitive load</Term>: &ldquo;Teams can
        only handle so much complexity before breaking down.&rdquo; Give a team a slice it can hold
        in its head, and platforms and specialists to lean on for the rest.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Evidence and caution ------------------------------------------------------------------------ */

const EVIDENCE: { t: string; d: string; tone?: "warn" }[] = [
  {
    t: "The mirroring study",
    d: "A 2008 Harvard study compared matched pairs of products doing the same job. In every pair, the one built by a loosely coupled open-source community was significantly more modular than the one from a tightly coupled firm, by up to eight times on one measure.",
  },
  {
    t: "Two-pizza teams",
    d: "Amazon's founder: “We try to create teams that are no larger than can be fed by two pizzas.” Small teams, each owning something whole.",
  },
  {
    t: "Not all-powerful",
    d: "Martin Fowler warns that moving teams around won't quickly reshape a rigid existing system. The inverse Conway manoeuvre steers new growth; old code changes slowly.",
    tone: "warn",
  },
  {
    t: "Don't copy a famous model",
    d: "Spotify's 2012 squads-and-tribes paper was widely copied. A Spotify agile coach, Joakim Sundén, later said: “Even at the time we wrote it, we weren't doing it. It was part ambition, part approximation.”",
    tone: "warn",
  },
];

export function Evidence() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Evidence and caution"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {EVIDENCE.map((e, i) => (
            <motion.div
              key={e.t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className={cn(
                "rounded-lg border px-3 py-2",
                e.tone === "warn" ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <p className="text-sm font-semibold">{e.t}</p>
              <p className="text-muted text-xs">{e.d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Conway&apos;s law is an observation, not a law of physics, but the evidence for it is
        strong: the structure of a product tends to follow the structure of the group that made it.
      </p>
      <p>
        The practical lesson is modest: when you plan an architecture, plan the teams with it, and
        expect change to take time.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which kind of team? ------------------------------------------------------------------------- */

export function WhichType() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of team?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-team-type"
            prompt="Which Team Topologies type is each team?"
            categories={[
              { id: "stream", label: "Stream-aligned" },
              { id: "platform", label: "Platform" },
              { id: "enabling", label: "Enabling" },
              { id: "complicated", label: "Complicated-subsystem" },
            ]}
            items={[
              {
                id: "checkout",
                label: "Owns checkout for the shopping app, from screen to database",
                category: "stream",
                why: "A flow of work from one part of the business, end to end.",
              },
              {
                id: "claims",
                label: "Owns motor insurance claims, including the claims staff's tools",
                category: "stream",
                why: "Another business stream, owned whole.",
              },
              {
                id: "deploy",
                label: "Runs the self-service deployment and monitoring platform other teams use",
                category: "platform",
                why: "An internal product consumed as a service.",
              },
              {
                id: "coach",
                label: "Spends a month with each team helping them adopt automated testing",
                category: "enabling",
                why: "Helps, teaches, then moves on.",
              },
              {
                id: "fraud",
                label: "Builds the fraud-scoring model that needs specialist statisticians",
                category: "complicated",
                why: "Deep specialist knowledge, kept in one place.",
              },
            ]}
            explanation="Most teams should be stream-aligned; the other three types exist to reduce their cognitive load."
          />
        </div>
      }
    >
      <p>Match each team to its type.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Conway's law", "Systems copy the communication structures of the teams that build them."],
  ["Inverse Conway", "Shape teams on purpose to get the architecture you want."],
  ["Stream-aligned first", "Teams owning business slices end to end, supported by the rest."],
  ["Cognitive load", "Give each team only what it can hold in its head."],
  ["No copying", "Famous team models describe one company at one moment."],
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
        Business streams make good team boundaries, but where exactly do they lie? The next chapter,
        on domain-driven design, is about finding them.
      </p>
    </StepLayout>
  );
}
