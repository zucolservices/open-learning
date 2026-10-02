"use client";

import { motion } from "motion/react";
import { Flame, Megaphone, NotebookPen, RotateCcw, Wrench } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, SEVERITIES } from "./model";
import type { IncState } from "./state";

/* 1 ─ Borrowed from firefighters ------------------------------------------------------------------ */

const ROLES = [
  {
    icon: Flame,
    t: "Incident commander",
    d: "Holds the big picture and decides. Any role not handed out stays with them.",
  },
  {
    icon: Wrench,
    t: "Ops lead",
    d: "Runs the technical response. Only this group changes the system during the incident.",
  },
  {
    icon: Megaphone,
    t: "Communications",
    d: "Keeps customers, support and leadership updated on a regular rhythm.",
  },
  {
    icon: NotebookPen,
    t: "Scribe",
    d: "Records the timeline: what was seen, decided and changed, and when.",
  },
];

export function Firefighters() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Borrowed from firefighters"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {ROLES.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In 1970, wildfires in Southern California burned for 13 days, killing 16 people. Crews from
        many agencies struggled to work together. Out of that came FIRESCOPE and its Incident
        Command System: clear roles, one person in charge, a common language.
      </p>
      <p>
        Software teams borrowed it. Google&apos;s SRE book describes the same roles for{" "}
        <Term id="incident">incidents</Term>, led by an{" "}
        <Term id="incident-commander">incident commander</Term>: &ldquo;the commander holds all
        positions that they have not delegated.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Friday, 19:30 ⭐ ---------------------------------------------------------------------------- */

export function FridayNight() {
  const [s, set] = useSceneState<IncState>();
  const picks = s.picks ?? [];
  const step = picks.length;
  const done = step >= DECISIONS.length;
  const d = DECISIONS[Math.min(step, DECISIONS.length - 1)];
  const chosen = picks
    .map((id, i) => DECISIONS[i].choices.find((c) => c.id === id)!)
    .filter(Boolean);
  const last = chosen[chosen.length - 1];
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Friday, 19:30"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="bg-surface-2 rounded-xl px-3 py-2 font-mono text-[10px] leading-relaxed">
            <p className="text-muted">incident document</p>
            {chosen.length === 0 && <p className="text-subtle">(empty)</p>}
            {chosen.map((c) => (
              <p key={c.id} className={c.good ? "text-fg" : "text-bad"}>
                {c.log}
              </p>
            ))}
          </div>
          {last && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                last.good ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              {last.outcome}
            </motion.div>
          )}
          {!done ? (
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-accent font-mono text-xs">{d.time}</p>
              <p className="mt-1 text-sm font-semibold">{d.prompt}</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {d.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set({ picks: [...picks, c.id] })}
                    className="border-line hover:bg-surface-2 rounded-lg border px-3 py-1.5 text-left text-xs"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted text-sm">
                {chosen.every((c) => c.good)
                  ? "A calm, well-run incident: users suffered under an hour and everyone knew their job."
                  : "Go back and try the other choices: each one changes how the evening goes."}
              </p>
              <button
                type="button"
                onClick={() => set({ picks: [] })}
                className="text-muted flex shrink-0 items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Replay
              </button>
            </div>
          )}
        </div>
      }
    >
      <p>
        UPI payments start failing on a Friday evening. You&apos;re the incident commander. Make
        five decisions and watch the incident document fill up.
      </p>
      <p>
        The SRE book&apos;s advice on the first one: &ldquo;It is better to declare an incident
        early and then find a simple fix and close out the incident than to have to spin up the
        incident management framework hours into a burgeoning problem.&rdquo; Declare if you need a
        second team, customers can see it, or an hour&apos;s concentrated work hasn&apos;t solved
        it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How bad is it? ------------------------------------------------------------------------------ */

export function Severity() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How bad is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SEVERITIES.map(([k, d], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className={cn(
                "grid grid-cols-[4rem_1fr] items-center gap-2 rounded-lg border px-3 py-2",
                i < 2 ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <span className="font-mono text-sm font-semibold">{k}</span>
              <span className="text-muted text-xs">{d}</span>
            </motion.div>
          ))}
          <p className="text-muted text-xs">SEV-1 and SEV-2 are treated as major incidents.</p>
        </div>
      }
    >
      <p>
        <Term id="severity">Severity levels</Term> decide who gets pulled in and how fast. These are
        PagerDuty&apos;s published definitions, a common starting point; lower numbers are more
        urgent. Its rule for doubt: &ldquo;treat it as the higher one.&rdquo;
      </p>
      <p>
        Some incidents also start a regulatory clock. In India, CERT-In&apos;s 2022 directions
        require reporting listed cyber security incidents within six hours, and RBI&apos;s 2024
        directions for non-bank payment operators require reporting unusual incidents, including
        outages of critical systems, within six hours of detection.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Whose job is it? ---------------------------------------------------------------------------- */

export function WhoseJob() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Whose job is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="whose-job"
            prompt="Which role does each task belong to?"
            categories={[
              { id: "ic", label: "Commander" },
              { id: "ops", label: "Ops lead" },
              { id: "comms", label: "Comms" },
              { id: "scribe", label: "Scribe" },
            ]}
            items={[
              {
                id: "decide",
                label: "Decides whether to roll back or wait for a fix",
                category: "ic",
                why: "The commander makes the calls, with advice from the ops lead.",
              },
              {
                id: "rollback",
                label: "Runs the rollback",
                category: "ops",
                why: "Only the operations group changes the system during an incident.",
              },
              {
                id: "status",
                label: "Updates the status page and briefs support",
                category: "comms",
                why: "A dedicated person keeps the rhythm of updates going.",
              },
              {
                id: "timeline",
                label: "Notes that the rollback started at 20:14",
                category: "scribe",
                why: "Times and decisions, recorded as they happen, for the postmortem.",
              },
            ]}
            explanation="Separate roles let each person focus: one decides, one fixes, one talks, one records."
          />
        </div>
      }
    >
      <p>One person, one job, during the most stressful hour of the month.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Declare early", "Closing a small incident is cheap; starting late is expensive."],
  ["Clear roles", "Commander, ops lead, communications, scribe."],
  ["One group changes things", "Every change known and logged."],
  ["Talk on a rhythm", "Say what's affected, and when the next update comes."],
  ["Mitigate, watch, close", "Then hand over and book the postmortem."],
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
        PagerDuty publishes its whole incident response guide openly, with extra roles for bigger
        incidents (a deputy, subject-matter experts, customer and internal liaisons). Next: what
        happens on Monday, the postmortem.
      </p>
    </StepLayout>
  );
}
