"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, X, type LucideIcon } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TEAMS, WAYS, type Fit, type Way } from "./teams";
import type { WayState } from "./state";

/* 1 ─ A banquet or a café? ---------------------------------------------------------------------- */

export function Kitchens() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A banquet or a café?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            {
              t: "A wedding banquet kitchen",
              d: "Plans the menu for the day, preps in batches, serves at set times, reviews afterwards. A rhythm with a clear goal.",
              w: "Like Scrum: Sprints, a goal, a review.",
            },
            {
              t: "A busy café counter",
              d: "Orders arrive whenever customers walk in, each made as it comes, with a limit on how many are in progress so none go cold.",
              w: "Like Kanban: continuous flow, limited work in progress.",
            },
          ].map((k, i) => (
            <motion.div
              key={k.t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-xl border p-4"
            >
              <p className="font-semibold">{k.t}</p>
              <p className="text-muted mt-1 text-sm">{k.d}</p>
              <p className="text-accent mt-2 text-xs font-medium">{k.w}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Both kitchens are well run; they just serve different kinds of demand. A café that plans its
        orders a fortnight ahead would fail, and so would a banquet cooked one dish at a time as
        guests arrive.
      </p>
      <p>
        Teams are the same. <Term id="sprint">Sprints</Term> suit goal-driven work;{" "}
        <Term id="kanban">Kanban</Term> suits a stream of varied requests. The right way of working
        depends on the work, not on fashion. And many teams combine the two.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Four teams, four choices ⭐ (branching scenario) -------------------------------------------- */

const FIT: Record<Fit, [string, string, LucideIcon]> = {
  good: ["Fits well", "border-good/50 bg-good/10", Check],
  care: ["Can work, with care", "border-line-strong bg-surface-2", AlertTriangle],
  poor: ["Poor fit", "border-bad/50 bg-bad/10", X],
};

export function FourTeams() {
  const [s, set] = useSceneState<WayState>();
  const at = Math.min(s.at, TEAMS.length - 1);
  const team = TEAMS[at];
  const way = s.choices[team.id] as Way | undefined;
  const out = way ? team.outcomes[way] : null;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Four teams, four choices"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TEAMS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => set({ at: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  i === at ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {t.name.replace("The ", "")}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-2"
            >
              <p className="text-sm font-semibold">{team.name}</p>
              <p className="text-muted text-xs">{team.work}</p>
              <div className="grid gap-1.5 sm:grid-cols-3">
                {WAYS.map(([id, name, desc]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={way === id}
                    onClick={() => set({ choices: { ...s.choices, [team.id]: id } })}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left",
                      way === id
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <span className="block text-xs font-semibold">{name}</span>
                    <span className="text-muted block text-[10px] leading-snug">{desc}</span>
                  </button>
                ))}
              </div>
              {out && (
                <motion.div
                  key={way}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("rounded-xl border px-3 py-2 text-xs", FIT[out.fit][1])}
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    {(() => {
                      const Icon = FIT[out.fit][2];
                      return <Icon className="size-3.5" />;
                    })()}
                    {FIT[out.fit][0]}
                  </p>
                  <p className="mt-1">{out.text}</p>
                  <p className="text-muted mt-2">
                    Other options:{" "}
                    {WAYS.filter(([id]) => id !== way)
                      .map(
                        ([id, name]) => `${name}: ${FIT[team.outcomes[id].fit][0].toLowerCase()}`,
                      )
                      .join(" · ")}
                  </p>
                </motion.div>
              )}
              {out && at < TEAMS.length - 1 && (
                <button
                  type="button"
                  onClick={() => set({ at: at + 1 })}
                  className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
                >
                  Next team
                </button>
              )}
            </motion.div>
          </AnimatePresence>
          {TEAMS.every((t) => s.choices[t.id]) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-line mt-auto border-t pt-3 text-xs"
            >
              <p className="font-semibold">Your four choices</p>
              <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
                {TEAMS.map((t) => {
                  const w = s.choices[t.id] as Way;
                  const f = t.outcomes[w].fit;
                  const Icon = FIT[f][2];
                  return (
                    <li key={t.id} className="flex items-center gap-1.5">
                      <Icon
                        className={cn(
                          "size-3.5 shrink-0",
                          f === "good" ? "text-good" : f === "poor" ? "text-bad" : "text-muted",
                        )}
                      />
                      <span>
                        {t.name.replace("The ", "")}: {WAYS.find(([id]) => id === w)?.[1]}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-muted mt-2">
                The same company, four answers. The work decides, and a team can change its mind as
                it learns.
              </p>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Four teams at the same company. For each, choose a way of working and see how it&apos;s
        likely to go. There&apos;s often more than one reasonable answer.
      </p>
      <p className="text-muted text-sm">
        Scrum.org&apos;s Kanban Guide for Scrum Teams adds flow practices to Scrum and &ldquo;does
        not replace or discount any part of The Scrum Guide&rdquo;. Kanban University&apos;s view is
        that Kanban is added to whatever you already do.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Myths ------------------------------------------------------------------------------------------ */

export function WayMyths() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Scrum, Kanban and myths"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="way-myths"
            prompt="Sort each statement."
            categories={[
              { id: "true", label: "True" },
              { id: "myth", label: "Myth" },
            ]}
            items={[
              {
                id: "noplan",
                label: "Kanban teams don't plan",
                category: "myth",
                why: "Kanban cadences include replenishment and delivery-planning meetings.",
              },
              {
                id: "wip",
                label: "A Scrum team can use WIP limits",
                category: "true",
                why: "The Kanban Guide for Scrum Teams makes them part of flow-based Scrum.",
              },
              {
                id: "maint",
                label: "Kanban is only for maintenance work",
                category: "myth",
                why: "The Kanban Guide says it is “not limited to any specific industry or context”.",
              },
              {
                id: "forever",
                label: "Teams can change how they work as they learn",
                category: "true",
                why: "“Start with what you do now” and evolve: a Kanban principle, and the spirit of inspect and adapt.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        <Term id="scrumban">Scrumban</Term> started as Corey Ladas&apos;s essays (2008–09) on moving
        a Scrum team gradually towards pull and <Term id="wip">WIP</Term> limits. Today it names a
        family of hybrids, not an official framework.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Match the work", "Goal-driven product work suits Sprints; unpredictable requests suit flow."],
  ["Combine freely", "Scrum with Kanban practices is common and officially described."],
  [
    "Kanban has rhythms too",
    "Replenishment, delivery planning and service reviews are its cadences.",
  ],
  ["Start where you are", "Change how you work step by step, from evidence."],
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
        Kanban University&apos;s change principles: &ldquo;Start with what you do now&rdquo;,
        &ldquo;Agree to pursue improvement through evolutionary change&rdquo; and &ldquo;Encourage
        acts of leadership at all levels&rdquo;. Good advice whichever way you work.
      </p>
      <p>
        That completes the flow chapter. Next: the{" "}
        <Term id="definition-of-done">Definition of Done</Term> and the engineering that makes agile
        work.
      </p>
    </StepLayout>
  );
}
