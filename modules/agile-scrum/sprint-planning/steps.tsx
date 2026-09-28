"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Flag, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ScrumGuideCredit } from "../_shared/scrum-guide-credit";
import {
  ABSENCES,
  CAPACITY,
  DAYS,
  FORECAST,
  GOALS,
  ITEMS,
  PEOPLE,
  RECENT,
  RECENT_DAYS,
  WISHFUL,
  runSprint,
} from "./model";
import type { PlanState } from "./state";

/* 1 ─ Why, what and how --------------------------------------------------------------------------- */

const TOPICS = [
  {
    q: "Topic One: Why is this Sprint valuable?",
    quote:
      "The Product Owner proposes how the product could increase its value and utility in the current Sprint. The whole Scrum Team then collaborates to define a Sprint Goal that communicates why the Sprint is valuable to stakeholders.",
    trip: "“We're going to reach the waterfall and be home by Sunday night.”",
  },
  {
    q: "Topic Two: What can be Done this Sprint?",
    quote:
      "Through discussion with the Product Owner, the Developers select items from the Product Backlog to include in the current Sprint.",
    trip: "Pack what the trip needs and what you can carry. Leave the rest.",
  },
  {
    q: "Topic Three: How will the chosen work get done?",
    quote:
      "For each selected Product Backlog item, the Developers plan the work necessary to create an Increment that meets the Definition of Done.",
    trip: "Plan the route and who carries what. You'll adjust it on the way.",
  },
];

export function ThreeTopics() {
  const [s, set] = useSceneState<PlanState>();
  const f = Math.min(s.frame, TOPICS.length - 1);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Why, what and how"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {["Why", "What", "How"].map((w, i) => (
              <motion.div
                key={w}
                animate={{ opacity: i <= f ? 1 : 0.35 }}
                className={cn(
                  "rounded-xl border py-3 text-center text-sm font-semibold",
                  i === f ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {w}
              </motion.div>
            ))}
          </div>
          <motion.div
            key={f}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-4"
          >
            <p className="text-muted font-mono text-[11px]">{TOPICS[f].q}</p>
            <p className="mt-2 text-sm">&ldquo;{TOPICS[f].quote}&rdquo;</p>
          </motion.div>
          <Stepper step={f} count={TOPICS.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={f} title="On the weekend trek">
            {TOPICS[f].trip}
          </FrameCaption>
          <ScrumGuideCredit />
        </div>
      }
    >
      <p>
        Planning a weekend trek with friends: first agree why you&apos;re going, then what to pack,
        then the route. If a bridge is out, you change the route, not the goal.
      </p>
      <p>
        A <Term id="sprint">Sprint</Term> is planned the same way. The Scrum Guide&apos;s{" "}
        <Term id="sprint-planning">Sprint Planning</Term> covers three topics, and &ldquo;The Sprint
        Goal must be finalized prior to the end of Sprint Planning.&rdquo;
      </p>
      <p className="text-muted text-sm">
        Sprint Planning is &ldquo;timeboxed to a maximum of eight hours for a one-month Sprint. For
        shorter Sprints, the event is usually shorter.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Plan a Sprint ⭐ ------------------------------------------------------------------------------- */

export function PlanIt() {
  const [s, set] = useSceneState<PlanState>();
  const goal = GOALS.find((g) => g.id === s.goal);
  const picked = new Set(s.picked);
  const planned = ITEMS.filter((i) => picked.has(i.id)).reduce((a, i) => a + i.size, 0);
  const out = goal && s.ran ? runSprint(goal.id, s.picked) : null;
  const missingNeeds = goal ? goal.needs.filter((n) => !picked.has(n)) : [];
  const max = Math.max(planned, WISHFUL, FORECAST) * 1.3;
  return (
    <StepLayout
      eyebrow="Build"
      title="Plan a Sprint"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold">
              1. Why: choose the Sprint Goal (the Product Owner proposed three)
            </p>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={s.goal === g.id}
                  onClick={() => set({ goal: g.id, ran: false })}
                  className={cn(
                    "flex items-start gap-1.5 rounded-xl border px-2.5 py-2 text-left text-xs",
                    s.goal === g.id
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <Flag className="text-accent mt-0.5 size-3.5 shrink-0" />
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold">2. What: pick items for this Sprint</p>
            <div className="grid gap-1 sm:grid-cols-2">
              {ITEMS.map((it) => {
                const on = picked.has(it.id);
                const serves = goal && it.goal === goal.id;
                const need = goal?.needs.includes(it.id);
                return (
                  <button
                    key={it.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      set({
                        picked: on ? s.picked.filter((x) => x !== it.id) : [...s.picked, it.id],
                        ran: false,
                      })
                    }
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-[11px]",
                      on
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded font-mono text-[10px]",
                        on ? "bg-accent text-accent-fg" : "bg-viz-data/20",
                      )}
                    >
                      {it.size}
                    </span>
                    <span className="flex-1">{it.label}</span>
                    {serves && (
                      <span
                        className={cn(
                          "text-[9px]",
                          need ? "text-accent font-semibold" : "text-muted",
                        )}
                      >
                        {need ? "goal needs" : "goal"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1.5 text-[11px]">
              How much fits? (sizes in points, an optional practice)
            </p>
            <div className="bg-surface-2 relative h-5 overflow-hidden rounded">
              <motion.div
                className={cn("h-full", planned > FORECAST ? "bg-bad/60" : "bg-accent/70")}
                animate={{ width: `${(planned / max) * 100}%` }}
              />
              {[
                [FORECAST, "forecast", "bg-good"],
                [WISHFUL, "wishful", "bg-bad"],
              ].map(([v, l, c]) => (
                <div
                  key={l as string}
                  className="absolute inset-y-0 flex items-center"
                  style={{ left: `${((v as number) / max) * 100}%` }}
                >
                  <span className={cn("h-full w-0.5", c as string)} />
                  <span className="text-fg ml-1 text-[9px] whitespace-nowrap">
                    {l as string} {v as number}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted mt-1.5 text-[11px]">
              Planned {planned}. Forecast {FORECAST} = recent average ({RECENT.join(", ")}) scaled
              from {RECENT_DAYS} to {CAPACITY} available person-days.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!goal || planned === 0}
              onClick={() => set({ ran: true })}
              className="bg-accent text-accent-fg rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Run the two weeks
            </button>
            {goal && missingNeeds.length > 0 && (
              <span className="text-bad text-xs">
                The goal needs:{" "}
                {missingNeeds.map((n) => ITEMS.find((i) => i.id === n)!.label).join(", ")}
              </span>
            )}
          </div>
          <AnimatePresence>
            {out && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "rounded-xl border px-4 py-3 text-xs",
                  out.goalMet ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                <p className="text-sm font-semibold">
                  {out.goalMet ? "Sprint Goal met." : "Sprint Goal missed."}{" "}
                  {out.notDone.length === 0
                    ? "Everything planned got Done."
                    : `${out.notDone.length} item${out.notDone.length > 1 ? "s" : ""} didn't fit.`}
                </p>
                <ul className="mt-2 grid gap-0.5">
                  {s.picked.map((id) => {
                    const it = ITEMS.find((i) => i.id === id)!;
                    const ok = out.done.includes(id);
                    return (
                      <li key={id} className="flex items-center gap-1.5">
                        {ok ? (
                          <Check className="text-good size-3" />
                        ) : (
                          <X className="text-bad size-3" />
                        )}
                        {it.label}
                      </li>
                    );
                  })}
                </ul>
                <p className="text-muted mt-2">
                  One goal item turned out bigger than expected, as work often does. The team kept
                  the goal in mind and did its items first.
                  {out.offGoal.length > 2 &&
                    " Several items had nothing to do with the goal: they spread the team thin."}
                  {out.planned > FORECAST + 3 &&
                    " Planning above the forecast just meant promising things that were never going to happen."}
                  {out.planned < FORECAST - 5 &&
                    " There was spare capacity: the team could have pulled in more with the Product Owner."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <p>
        A team of {PEOPLE}, a two-week Sprint of {DAYS} working days. Not everyone is available:
      </p>
      <ul className="text-muted list-disc space-y-0.5 pl-5 text-sm">
        {ABSENCES.map(([a, d]) => (
          <li key={a}>
            {a} (−{d} person-days)
          </li>
        ))}
      </ul>
      <p>
        That leaves {CAPACITY} person-days. Pick one goal, then the items that serve it, and run the
        Sprint.
      </p>
      <p className="text-muted text-sm">
        The Scrum Guide: &ldquo;the more the Developers know about their past performance, their
        upcoming capacity, and their Definition of Done, the more confident they will be in their
        Sprint forecasts.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ What does the team commit to? --------------------------------------------------------------- */

export function CommitWhat() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What does the team commit to?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="commit-what"
            prompt="At the end of Sprint Planning, what do the Developers commit to, according to the 2020 Scrum Guide?"
            options={[
              {
                id: "goal",
                label:
                  "The Sprint Goal; the selected items are their forecast of what's needed to reach it",
                correct: true,
                feedback:
                  "Yes. “Although the Sprint Goal is a commitment by the Developers, it provides flexibility in terms of the exact work needed to achieve it.”",
              },
              {
                id: "all",
                label: "Delivering every selected item, no matter what",
                feedback:
                  "That was the 2010 wording. Since 2011 the selected work is a forecast, and since 2020 the commitment is the Sprint Goal.",
              },
              {
                id: "points",
                label: "A number of story points (their velocity)",
                feedback:
                  "Story points and velocity are optional practices; the Scrum Guide doesn't mention them.",
              },
              {
                id: "hours",
                label: "Working a fixed number of hours on the Sprint",
                feedback: "Scrum commits to outcomes (a goal), not hours.",
              },
            ]}
            explanation="History: in 2010 the team “committed to a Sprint Goal, and to these Product Backlog items”. The 2011 guide changed that: teams “do not commit to completing the work… The Development Team creates a forecast”."
          />
        </div>
      }
    >
      <p>
        Why it matters: a commitment to a goal lets the team drop or change items and still succeed.
        A commitment to every item turns every surprise into a failure.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Bigger than we thought ------------------------------------------------------------------------ */

export function BiggerThanThought() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Bigger than we thought"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="bigger"
            prompt="Day 4. Reading status from the department's system turns out to need twice the work planned. The Sprint Goal is status tracking. What should the Developers do?"
            options={[
              {
                id: "renegotiate",
                label:
                  "Talk to the Product Owner and drop or simplify other items, keeping the Sprint Goal intact",
                correct: true,
                feedback:
                  "Right: “they collaborate with the Product Owner to negotiate the scope of the Sprint Backlog within the Sprint without affecting the Sprint Goal.”",
              },
              {
                id: "overtime",
                label: "Work late every day to get everything done",
                feedback:
                  "Occasionally, maybe; as a plan, it breaks a sustainable pace and usually quality with it.",
              },
              {
                id: "skip",
                label: "Skip testing on the other items to save time",
                feedback: "“Quality does not decrease” during a Sprint.",
              },
              {
                id: "wait",
                label: "Carry on silently and report at the Sprint Review",
                feedback:
                  "That wastes the Daily Scrums that exist to replan, and surprises the Product Owner at the end.",
              },
            ]}
            explanation="Scope is flexible; the goal and quality aren't. That's the deal a Sprint Goal makes possible."
          />
        </div>
      }
    >
      <p>
        During a Sprint, per the guide: &ldquo;No changes are made that would endanger the Sprint
        Goal; Quality does not decrease; … Scope may be clarified and renegotiated with the Product
        Owner as more is learned.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "A goal, not a list",
    "The Sprint Goal is the commitment; items are a forecast of how to reach it.",
  ],
  [
    "Plan on reality",
    "Use what the team actually finished recently, minus holidays, leave and support duty.",
  ],
  ["Fewer, focused items", "Items that don't serve the goal spread the team thin."],
  [
    "Renegotiate scope, not quality",
    "When work grows, trim with the Product Owner; keep the goal and the Definition of Done.",
  ],
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
        About points: many teams size items in <Term id="story-points">story points</Term> and track{" "}
        <Term id="velocity">velocity</Term>. Both are optional; neither is in the Scrum Guide. Ron
        Jeffries, often credited with story points, wrote: &ldquo;I like to say that I may have
        invented story points, and if I did, I&apos;m sorry now.&rdquo;
      </p>
      <p className="text-muted text-sm">
        Planning on recent actuals is sometimes called &ldquo;yesterday&apos;s weather&rdquo;, a
        name Kent Beck and Martin Fowler gave it in Planning Extreme Programming (2000). The
        Estimation track goes deeper. Next: the Daily Scrum.
      </p>
    </StepLayout>
  );
}
