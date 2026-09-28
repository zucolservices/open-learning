"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ScrumGuideCredit } from "../_shared/scrum-guide-credit";
import { WEEKS, steer } from "./model";
import type { InspectState } from "./state";

/* 1 ─ Learning to drive ---------------------------------------------------------------------------- */

const ROAD = "M20 150 C 90 150, 110 60, 180 60 S 280 130, 330 70";
const SMALL =
  "M20 150 C 60 149, 88 132, 104 110 C 118 90, 140 64, 180 61 C 216 58, 238 92, 262 108 C 288 124, 310 96, 330 71";
const ONCE = "M20 150 L 330 128";

export function Driving() {
  const [s, set] = useSceneState<InspectState>();
  const small = s.drive === "small";
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Learning to drive"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.drive}
            options={[
              ["once", "Point the car, then look away"],
              ["small", "Keep looking, small corrections"],
            ]}
            onChange={(v) => set({ drive: v })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox="0 0 350 200"
              className="w-full"
              role="img"
              aria-label="A car on a winding road"
            >
              <path
                d={ROAD}
                fill="none"
                className="stroke-viz-idle/25"
                strokeWidth={34}
                strokeLinecap="round"
              />
              <path
                d={ROAD}
                fill="none"
                className="stroke-line-strong"
                strokeWidth={1.5}
                strokeDasharray="6 6"
              />
              <motion.path
                key={s.drive}
                d={small ? SMALL : ONCE}
                fill="none"
                className={small ? "stroke-good" : "stroke-bad"}
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {!small && (
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  x={330}
                  y={150}
                  textAnchor="end"
                  className="fill-bad text-[11px] font-semibold"
                >
                  off the road
                </motion.text>
              )}
            </svg>
          </div>
          <blockquote className="border-accent bg-accent-soft rounded-r-xl border-l-4 px-4 py-3 text-sm">
            &ldquo;Driving is not about getting the car going in the right direction. Driving is
            about constantly paying attention, making a little correction this way, a little
            correction that way.&rdquo;
            <footer className="text-muted mt-1 text-xs">
              Kent Beck, recalling his mother&apos;s driving lesson, in Extreme Programming
              Explained (1999)
            </footer>
          </blockquote>
        </div>
      }
    >
      <p>
        Nobody drives by pointing the car at the destination and closing their eyes. You look,
        notice you&apos;re drifting, and correct a little, all the time.
      </p>
      <p>
        Building software for real people is like that. The road bends as you learn what they need.
        Kent Beck: &ldquo;software development is like steering, not like getting the car pointed
        straight down the road.&rdquo;
      </p>
      <p className="text-muted text-sm">Try both ways of driving.</p>
    </StepLayout>
  );
}

/* 2 ─ Three pillars (step-through) --------------------------------------------------------------- */

const PILLARS = [
  {
    name: "Transparency",
    quote:
      "The emergent process and work must be visible to those performing the work as well as those receiving the work.",
    link: "Transparency enables inspection. Inspection without transparency is misleading and wasteful.",
    plain:
      "Everyone can see the real state of the work: what's done, what's not, what's stuck. No rosy status reports.",
  },
  {
    name: "Inspection",
    quote:
      "The Scrum artifacts and the progress toward agreed goals must be inspected frequently and diligently to detect potentially undesirable variances or problems.",
    link: "Inspection enables adaptation. Inspection without adaptation is considered pointless.",
    plain:
      "Look at the real work often, on purpose, to spot drift early. Not managers checking up on people: the team and stakeholders looking together.",
  },
  {
    name: "Adaptation",
    quote: "The adjustment must be made as soon as possible to minimize further deviation.",
    link: "A Scrum Team is expected to adapt the moment it learns anything new through inspection.",
    plain: "When you see drift, change course now: the plan, the product or the way you work.",
  },
];

export function Pillars() {
  const [s, set] = useSceneState<InspectState>();
  const f = Math.min(s.frame, PILLARS.length);
  const whole = f === PILLARS.length;
  return (
    <StepLayout
      eyebrow="Step through"
      title="Three pillars"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 items-stretch gap-2">
            {PILLARS.map((p, i) => {
              const on = whole || i === f;
              return (
                <motion.div
                  key={p.name}
                  animate={{ opacity: on ? 1 : 0.35, y: on ? 0 : 4 }}
                  className={cn(
                    "relative rounded-xl border px-1 py-4 text-center sm:px-3",
                    on ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  )}
                >
                  <p className="text-[11px] font-semibold sm:text-sm">{p.name}</p>
                  {i < 2 && (
                    <span className="text-accent absolute top-1/2 -right-2.5 z-10 -translate-y-1/2 text-lg">
                      →
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
          {whole ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-line bg-surface rounded-xl border p-4 text-sm"
            >
              <p>
                &ldquo;Scrum is founded on empiricism and lean thinking. Empiricism asserts that
                knowledge comes from experience and making decisions based on what is
                observed.&rdquo;
              </p>
              <p className="text-muted mt-2 text-xs">
                Each pillar feeds the next. Remove one and the loop breaks: you can&apos;t inspect
                what you can&apos;t see, and inspecting without changing anything is pointless.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={f}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface rounded-xl border p-4"
            >
              <p className="text-sm">&ldquo;{PILLARS[f].quote}&rdquo;</p>
              <p className="text-accent mt-2 text-sm font-medium">
                &ldquo;{PILLARS[f].link}&rdquo;
              </p>
            </motion.div>
          )}
          <Stepper step={f} count={PILLARS.length + 1} onChange={(n) => set({ frame: n })} />
          <FrameCaption
            frameKey={f}
            title={whole ? "The loop" : `In plain words: ${PILLARS[f].name.toLowerCase()}`}
          >
            {whole
              ? "Transparency lets you inspect; inspection lets you adapt; adapting changes the work, which you make visible again."
              : PILLARS[f].plain}
          </FrameCaption>
          <ScrumGuideCredit />
        </div>
      }
    >
      <p>
        Scrum turns the driving lesson into three habits, which the Scrum Guide calls its pillars:{" "}
        <Term id="three-pillars">transparency, inspection and adaptation</Term>.
      </p>
      <p>
        Together they are <Term id="empiricism">empiricism</Term>: deciding from what you actually
        observe, not from what you assumed at the start.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Steer to a moving target ⭐ (simulation) ---------------------------------------------------- */

const EVERY: [string, string][] = [
  ["1", "Every week"],
  ["2", "Every 2 weeks"],
  ["4", "Every 4 weeks"],
  ["13", "Every quarter"],
  ["26", "Only at the end"],
];

export function Steer() {
  const [s, set] = useSceneState<InspectState>();
  const r = steer(s.every, s.transparent);
  const x = (t: number) => 12 + (t / WEEKS) * 330;
  const y = (v: number) => 150 - (v / 100) * 140;
  const line = (vals: number[]) => vals.map((v, t) => `${t ? "L" : "M"}${x(t)},${y(v)}`).join(" ");
  const gap =
    r.target.map((v, t) => `${t ? "L" : "M"}${x(t)},${y(v)}`).join(" ") +
    " " +
    [...r.team]
      .map((v, t) => [v, t] as const)
      .reverse()
      .map(([v, t]) => `L${x(t)},${y(v)}`)
      .join(" ") +
    " Z";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Steer to a moving target"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Inspect and adapt:</span>
            <Segmented
              size="sm"
              value={String(s.every)}
              options={EVERY}
              onChange={(v) => set({ every: Number(v) })}
            />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.transparent}
              onChange={(e) => set({ transparent: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Transparency: inspections look at the working product with real users (untick: they rely
            on status reports that are weeks out of date)
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox="0 0 350 170"
              className="w-full"
              role="img"
              aria-label="What users need vs what the team builds, over 26 weeks"
            >
              <motion.path initial={false} animate={{ d: gap }} className="fill-bad/10" />
              <path
                d={line(r.target)}
                fill="none"
                className="stroke-fg/60"
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <motion.path
                initial={false}
                animate={{ d: line(r.team) }}
                fill="none"
                className="stroke-accent"
                strokeWidth={2.5}
              />
              {r.inspections.map((t) => (
                <circle key={t} cx={x(t)} cy={160} r={3} className="fill-viz-meta" />
              ))}
              <line x1={x(0)} y1={152} x2={x(WEEKS)} y2={152} className="stroke-line-strong" />
              {[0, 13, 26].map((t) => (
                <text
                  key={t}
                  x={x(t)}
                  y={169}
                  textAnchor={t === 0 ? "start" : t === WEEKS ? "end" : "middle"}
                  className="fill-muted text-[8px]"
                >
                  week {t}
                </text>
              ))}
            </svg>
            <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="border-fg/60 w-4 border-t-2 border-dashed" /> what users need
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-accent h-0.5 w-4" /> what the team is building
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-viz-meta size-2 rounded-full" /> inspection
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                r.misfit > 10 ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Average gap from what users need</p>
              <p className="font-mono text-sm">{r.misfit.toFixed(1)}</p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                r.lostWeeks > 5 ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Time spent inspecting</p>
              <p className="font-mono text-sm">{r.lostWeeks.toFixed(1)} weeks</p>
            </div>
          </div>
          <p className="border-line bg-surface-2 rounded-xl border px-3 py-2 text-xs">
            {!s.transparent
              ? "However often you inspect, you're steering by old, rosy reports, so the gap stays wide. “Inspection without transparency is misleading and wasteful.”"
              : s.every >= 13
                ? "Long stretches between inspections: the team builds confidently in the wrong direction, then lurches."
                : s.every === 1
                  ? "The closest fit, but inspecting every week takes a real share of the team's time. Shorter isn't free."
                  : "Close to what users need, at a modest cost. Scrum asks for this loop at least every calendar month."}
          </p>
          <p className="text-subtle text-[10px]">
            Illustrative model: the team can only move so far each week, updates its aim only when
            it inspects, and each inspection takes some time. The numbers are made up; the pattern
            is the point.
          </p>
        </div>
      }
    >
      <p>
        What users need drifts as everyone learns. The team can only steer towards what it{" "}
        <em>believes</em> they need, and it updates that belief when it inspects.
      </p>
      <p>
        Change how often the team inspects and adapts, then switch off transparency and see what
        happens.
      </p>
      <p className="text-muted text-sm">
        The Scrum Guide: &ldquo;Shorter Sprints can be employed to generate more learning cycles and
        limit risk of cost and effort to a smaller time frame.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 4 ─ Defined or empirical? --------------------------------------------------------------------- */

export function DefinedOrEmpirical() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Defined or empirical?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="defined-empirical"
            prompt="Which kind of process control fits each piece of work?"
            categories={[
              { id: "defined", label: "Defined: follow the recipe" },
              { id: "empirical", label: "Empirical: inspect and adapt" },
            ]}
            items={[
              {
                id: "bread",
                label: "Baking bread in a factory to a fixed recipe",
                category: "defined",
                why: "Same inputs, same outputs, every time. A defined process can just run.",
              },
              {
                id: "payroll",
                label: "Running the monthly payroll",
                category: "defined",
                why: "Well understood and repeatable; check it, but you don't need to discover it.",
              },
              {
                id: "app",
                label: "Building a new app for citizens",
                category: "empirical",
                why: "Needs emerge as people use it: you have to look and adjust.",
              },
              {
                id: "chatbot",
                label: "Improving a chatbot's answers from real conversations",
                category: "empirical",
                why: "You can't know in advance what people will ask. Observe, then adapt.",
              },
              {
                id: "furniture",
                label: "Assembling flat-pack furniture from its instructions",
                category: "defined",
                why: "The steps are known and don't change. Follow them.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        In 1995 Ken Schwaber took software methods to process-control experts at DuPont, led by
        Babatunde Ogunnaike. They were, he wrote, &ldquo;amazed and appalled&rdquo;: software was
        being run like a <Term id="empirical-process-control">defined process</Term>, when its
        complexity demanded an empirical one.
      </p>
      <p className="text-muted text-sm">
        A defined process &ldquo;can be started and allowed to run until completion, with the same
        results every time&rdquo;. An empirical one &ldquo;expects the unexpected&rdquo;, and is
        controlled through frequent inspection and adaptation.
      </p>
    </StepLayout>
  );
}

/* 5 ─ When does Scrum inspect? -------------------------------------------------------------------- */

export function WhenInspect() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="When does Scrum inspect?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="when-inspect"
            prompt="A new team member says: “Inspect and adapt is what the retrospective is for.” What's the better answer?"
            options={[
              {
                id: "all",
                label:
                  "Every Scrum event is a formal chance to inspect and adapt, and the team should adapt whenever it learns something new",
                correct: true,
                feedback:
                  "Yes. The Daily Scrum inspects progress towards the goal, the Review inspects the product, the Retrospective inspects how the team works, and none of them is a reason to wait.",
              },
              {
                id: "retro",
                label: "Right: the retrospective is the inspect-and-adapt event",
                feedback:
                  "The retrospective inspects how the team works, but it's one of several events that inspect and adapt.",
              },
              {
                id: "manager",
                label: "Inspection is the manager's job; the team adapts when told to",
                feedback:
                  "Inspection is done by the team and its stakeholders together, and Scrum Teams are self-managing.",
              },
              {
                id: "end",
                label: "Only at the end of the project, when the product is complete",
                feedback: "That's the one-pass approach this whole chapter is about avoiding.",
              },
            ]}
            explanation="The 2020 Scrum Guide: “Each event in Scrum is a formal opportunity to inspect and adapt Scrum artifacts.” And: “A Scrum Team is expected to adapt the moment it learns anything new through inspection.”"
          />
        </div>
      }
    >
      <p>Scrum builds the loop into its calendar, but doesn&apos;t make you wait for it.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const TAKEAWAYS: [string, string][] = [
  ["Steer, don't aim", "Small, frequent corrections beat one careful aim at the start."],
  ["Three pillars", "Transparency enables inspection; inspection enables adaptation."],
  ["No transparency, no loop", "Inspecting rosy reports is worse than useless: it's misleading."],
  ["Shorter, but not free", "More loops mean faster learning, and each one takes time."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The same learning loop shows up in manufacturing quality. Walter Shewhart drew it as a loop
        in 1939 (specification, production, inspection), and W. Edwards Deming spread it, later
        insisting on the name Plan-Do-Study-Act. Inspect and adapt echoes it.
      </p>
      <p>Next chapter: Scrum, the framework built around this loop.</p>
    </StepLayout>
  );
}
