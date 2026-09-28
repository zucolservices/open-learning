"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ScrumGuideCredit } from "../_shared/scrum-guide-credit";
import { IF, SITUATIONS, WHO, type Who } from "./situations";
import type { DecideState } from "./state";

const WHO_LABEL = Object.fromEntries(WHO) as Record<Who, string>;

/* 1 ─ Three accountabilities (analogy) ------------------------------------------------------------ */

const ACC: {
  id: string;
  name: string;
  kitchen: string;
  intro: string;
  lead: string;
  items: string[];
}[] = [
  {
    id: "po",
    name: "Product Owner",
    intro: "The Product Owner is",
    kitchen: "Decides what goes on the menu, and in what order.",
    lead: "accountable for maximizing the value of the product resulting from the work of the Scrum Team … also accountable for effective Product Backlog management, which includes:",
    items: [
      "Developing and explicitly communicating the Product Goal;",
      "Creating and clearly communicating Product Backlog items;",
      "Ordering Product Backlog items; and,",
      "Ensuring that the Product Backlog is transparent, visible and understood.",
    ],
  },
  {
    id: "dev",
    name: "Developers",
    intro: "The Developers are",
    kitchen: "The cooks: they decide how each dish is made, and who makes what.",
    lead: "always accountable for:",
    items: [
      "Creating a plan for the Sprint, the Sprint Backlog;",
      "Instilling quality by adhering to a Definition of Done;",
      "Adapting their plan each day toward the Sprint Goal; and,",
      "Holding each other accountable as professionals.",
    ],
  },
  {
    id: "sm",
    name: "Scrum Master",
    intro: "The Scrum Master",
    kitchen:
      "Keeps the kitchen working well: clears blockages, coaches, improves the way it runs. Doesn't cook or set the menu.",
    lead: "serves the Scrum Team in several ways, including:",
    items: [
      "Coaching the team members in self-management and cross-functionality;",
      "Helping the Scrum Team focus on creating high-value Increments that meet the Definition of Done;",
      "Causing the removal of impediments to the Scrum Team's progress; and,",
      "Ensuring that all Scrum events take place and are positive, productive, and kept within the timebox.",
    ],
  },
];

export function Kitchen() {
  const [s, set] = useSceneState<DecideState>();
  const a = ACC.find((x) => x.id === s.who) ?? ACC[0];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Three accountabilities"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {ACC.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === a.id}
                onClick={() => set({ who: x.id })}
                className={cn(
                  "rounded-xl border px-2 py-3 text-center text-xs font-semibold sm:text-sm",
                  x.id === a.id
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              <p className="border-line bg-surface-2 rounded-xl border px-3 py-2 text-sm">
                <span className="text-muted">In the kitchen: </span>
                {a.kitchen}
              </p>
              <div className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
                <p>
                  {a.intro} &ldquo;{a.lead}&rdquo;
                </p>
                <ul className="mt-2 grid gap-1">
                  {a.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>&ldquo;{it}&rdquo;</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
          <ScrumGuideCredit />
        </div>
      }
    >
      <p>
        Picture a busy restaurant kitchen. The owner decides the menu. The cooks decide how to cook.
        Someone keeps the kitchen running smoothly. Mix those up and dinner is late.
      </p>
      <p>
        Scrum gives one team three <Term id="accountability">accountabilities</Term>: the{" "}
        <Term id="product-owner">Product Owner</Term>, the <Term id="developers">Developers</Term>{" "}
        and the <Term id="scrum-master">Scrum Master</Term>. They aren&apos;t job titles or ranks:
        &ldquo;Within a Scrum Team, there are no sub-teams or hierarchies.&rdquo;
      </p>
      <p className="text-muted text-sm">
        The team is <Term id="self-managing">self-managing</Term>: &ldquo;they internally decide who
        does what, when, and how.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Who decides? ⭐ (branching scenario) --------------------------------------------------------- */

export function Situations() {
  const [s, set] = useSceneState<DecideState>();
  const at = Math.min(s.at, SITUATIONS.length - 1);
  const sit = SITUATIONS[at];
  const answer = s.answers[sit.id] as Who | undefined;
  const right = answer === sit.who;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Who decides?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1">
            {SITUATIONS.map((x, i) => {
              const a = s.answers[x.id];
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ at: i })}
                  aria-label={`Situation ${i + 1}`}
                  className={cn(
                    "grid size-7 place-items-center rounded-full border font-mono text-[11px]",
                    i === at ? "border-accent bg-accent-soft" : "border-line",
                    a && (a === x.who ? "text-good" : "text-bad"),
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={sit.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-3"
            >
              <p className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
                {sit.story}
              </p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {WHO.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={answer === id}
                    onClick={() => set({ answers: { ...s.answers, [sit.id]: id } })}
                    className={cn(
                      "rounded-xl border px-2.5 py-2 text-xs",
                      answer === id
                        ? right
                          ? "border-good bg-good/10"
                          : "border-bad bg-bad/10"
                        : answer && id === sit.who
                          ? "border-good/60"
                          : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {answer && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2"
                >
                  {!right && (
                    <p className="border-bad/40 bg-bad/5 flex gap-2 rounded-xl border px-3 py-2 text-xs">
                      <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                      <span>
                        <span className="font-semibold">{IF[answer]}: </span>
                        {sit.wrong}
                      </span>
                    </p>
                  )}
                  <div className="border-good/40 bg-good/5 rounded-xl border px-3 py-2 text-xs">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <Check className="text-good size-3.5" /> {WHO_LABEL[sit.who]}
                    </p>
                    <p className="mt-1">
                      &ldquo;{sit.quote}&rdquo;{" "}
                      <span className="text-muted">(Scrum Guide, {sit.section})</span>
                    </p>
                    <p className="text-muted mt-1">{sit.why}</p>
                  </div>
                  {at < SITUATIONS.length - 1 && (
                    <button
                      type="button"
                      onClick={() => set({ at: at + 1 })}
                      className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
                    >
                      Next situation
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          <ScrumGuideCredit />
        </div>
      }
    >
      <p>
        A services company is building a citizen portal for a state Revenue Department. Things
        happen. For each one: who should decide?
      </p>
      <p className="text-muted text-sm">
        Choose, see what the Scrum Guide says, and what tends to go wrong when someone else decides.
        Change your answers as often as you like.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Summary -------------------------------------------------------------------------------------- */

export function Summary() {
  const groups: Who[] = ["po", "dev", "team", "sm", "outside", "noone"];
  return (
    <StepLayout
      eyebrow="Summary"
      title="Who decides what, at a glance"
      stage={
        <div className="grid flex-1 content-start gap-2 sm:grid-cols-2">
          {groups.map((g, i) => {
            const list = SITUATIONS.filter((x) => x.who === g);
            if (!list.length) return null;
            return (
              <motion.div
                key={g}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="border-line bg-surface rounded-xl border px-4 py-3"
              >
                <p className="text-sm font-semibold">{WHO_LABEL[g]}</p>
                <ul className="text-muted mt-1 grid gap-1 text-xs">
                  {list.map((x) => (
                    <li key={x.id}>• {x.short}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      }
    >
      <p>
        The pattern: the Product Owner decides what and in what order; the Developers decide how and
        how much; the Scrum Master makes the system work.
      </p>
      <p className="text-muted text-sm">
        Decisions like budgets, contracts and staffing sit with the client and the company, not with
        Scrum. The guide only says teams are &ldquo;structured and empowered by the organization to
        manage their own work.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: is the Scrum Master the boss? ---------------------------------------------------- */

export function NotTheBoss() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Is the Scrum Master the boss?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="not-the-boss"
            prompt="A company renames its project managers “Scrum Masters”. They keep assigning tasks and chasing individuals for status. What's wrong?"
            options={[
              {
                id: "serve",
                label:
                  "In Scrum the Developers decide who does what and how; the Scrum Master serves and coaches the team, removing impediments, rather than directing the work",
                correct: true,
                feedback:
                  "Yes. The guide gives the Scrum Master no authority over the work: “How this is done is at the sole discretion of the Developers.”",
              },
              {
                id: "fine",
                label: "Nothing: the Scrum Master is the team's manager in Scrum",
                feedback:
                  "The guide says “no sub-teams or hierarchies”, and describes Scrum Masters as “true leaders who serve”, not managers.",
              },
              {
                id: "po",
                label: "Assigning tasks is the Product Owner's job, not the Scrum Master's",
                feedback:
                  "The Product Owner orders the backlog but doesn't assign tasks either. The Developers self-manage.",
              },
              {
                id: "name",
                label: "Only the title: they should be called “Agile Coaches”",
                feedback: "The name isn't the problem; directing the team is.",
              },
            ]}
            explanation="The guide doesn't mention reporting lines, so a Scrum Master may happen to be someone's line manager in some companies. But within Scrum, they don't direct the work."
          />
        </div>
      }
    >
      <p>
        The idea of leaders who serve goes back to Robert K. Greenleaf&apos;s essay &ldquo;The
        Servant as Leader&rdquo; (1970).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Product Owner: what and in what order", "One person orders the backlog; others persuade them."],
  [
    "Developers: how, and how much",
    "They plan the Sprint, size the work and decide who does what.",
  ],
  [
    "Scrum Master: makes it work",
    "Coaches, removes impediments, keeps events useful. Serves, doesn't direct.",
  ],
  [
    "Some things nobody trades",
    "Quality and the Definition of Done aren't negotiable under pressure.",
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
      <p>Most friction on Scrum teams comes from blurring these lines, not from the events.</p>
      <p>Next: the Sprint itself, and how a team plans one.</p>
    </StepLayout>
  );
}
