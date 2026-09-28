"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, X, type LucideIcon } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ScrumGuideCredit } from "../_shared/scrum-guide-credit";
import { DECISIONS, type Verdict } from "./scenario";
import type { ReviewState } from "./state";

/* 1 ─ Two kinds of looking back ------------------------------------------------------------------ */

export function TwoEvents() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Two kinds of looking back"
      stage={
        <div className="grid flex-1 content-start gap-3 sm:grid-cols-2">
          {[
            {
              name: "Sprint Review",
              when: "Second to last event. At most 4 hours for a one-month Sprint.",
              who: "The Scrum Team and key stakeholders",
              quotes: [
                "The purpose of the Sprint Review is to inspect the outcome of the Sprint and determine future adaptations.",
                "The Sprint Review is a working session and the Scrum Team should avoid limiting it to a presentation.",
              ],
            },
            {
              name: "Sprint Retrospective",
              when: "Concludes the Sprint. At most 3 hours for a one-month Sprint.",
              who: "The Scrum Team: Developers, Product Owner and Scrum Master",
              quotes: [
                "The purpose of the Sprint Retrospective is to plan ways to increase quality and effectiveness.",
                "The Scrum Team inspects how the last Sprint went with regards to individuals, interactions, processes, tools, and their Definition of Done.",
              ],
            },
          ].map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-xl border p-4"
            >
              <p className="font-semibold">{e.name}</p>
              <p className="text-muted mt-0.5 text-xs">{e.when}</p>
              <p className="text-muted text-xs">Who: {e.who}</p>
              {e.quotes.map((q) => (
                <p key={q} className="mt-2 text-sm">
                  &ldquo;{q}&rdquo;
                </p>
              ))}
            </motion.div>
          ))}
          <div className="sm:col-span-2">
            <ScrumGuideCredit />
          </div>
        </div>
      }
    >
      <p>
        After a family wedding, two things happen. Everyone looks at the photos together and says
        what they loved and what they&apos;d want next time. Later, the organisers sit down alone:
        how did <em>we</em> work? What will we do differently?
      </p>
      <p>
        Scrum has both. The <Term id="sprint-review">Sprint Review</Term> looks at the product with
        the people it&apos;s for. The <Term id="retrospective">Retrospective</Term> looks at how the
        team worked.
      </p>
    </StepLayout>
  );
}

/* 2 ─ End of Sprint 4 ⭐ (branching scenario) --------------------------------------------------- */

const VERDICT: Record<Verdict, [string, string, LucideIcon]> = {
  good: ["Helps", "border-good/50 bg-good/10", Check],
  risky: ["Partly", "border-line-strong bg-surface-2", AlertTriangle],
  harm: ["Backfires", "border-bad/50 bg-bad/10", X],
};

export function Scenario() {
  const [s, set] = useSceneState<ReviewState>();
  const at = Math.min(s.at, DECISIONS.length - 1);
  const d = DECISIONS[at];
  const chosen = d.choices.find((c) => c.id === s.choices[d.id]);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="End of Sprint 4"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1">
            {DECISIONS.map((x, i) => {
              const c = x.choices.find((o) => o.id === s.choices[x.id]);
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ at: i })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]",
                    i === at ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                    i === 3 && "ml-2",
                  )}
                >
                  {c && (
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        c.verdict === "good"
                          ? "bg-good"
                          : c.verdict === "harm"
                            ? "bg-bad"
                            : "bg-muted",
                      )}
                    />
                  )}
                  {x.event === "Review" ? "Review" : "Retro"} {i < 3 ? i + 1 : i - 2}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-2"
            >
              <p className="text-accent text-[11px] font-semibold tracking-wide uppercase">
                Sprint {d.event}
              </p>
              <p className="text-sm font-semibold">{d.question}</p>
              <p className="text-muted text-xs">{d.context}</p>
              <div className="grid gap-1.5">
                {d.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={c.id === chosen?.id}
                    onClick={() => set({ choices: { ...s.choices, [d.id]: c.id } })}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-xs",
                      c.id === chosen?.id
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {chosen && (
                <motion.div
                  key={chosen.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("rounded-xl border px-3 py-2 text-xs", VERDICT[chosen.verdict][1])}
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    {(() => {
                      const Icon = VERDICT[chosen.verdict][2];
                      return <Icon className="size-3.5" />;
                    })()}
                    {VERDICT[chosen.verdict][0]}
                  </p>
                  <p className="mt-1">{chosen.consequence}</p>
                </motion.div>
              )}
              {chosen && at < DECISIONS.length - 1 && (
                <button
                  type="button"
                  onClick={() => set({ at: at + 1 })}
                  className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
                >
                  {at === 2 ? "On to the Retrospective" : "Next"}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Last day of Sprint 4 on the citizen portal. First the Sprint Review with the Revenue
        Department, then the team&apos;s Retrospective. Six decisions, each with consequences.
      </p>
      <p className="text-muted text-sm">
        There are no points. Change your mind as often as you like and see what changes.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What the team learned --------------------------------------------------------------------- */

export function Learned() {
  const [s] = useSceneState<ReviewState>();
  return (
    <StepLayout
      eyebrow="Consequences"
      title="What the team learned"
      stage={
        <div className="flex flex-1 flex-col gap-1.5">
          {DECISIONS.map((d) => {
            const c = d.choices.find((o) => o.id === s.choices[d.id]);
            const [label, cls] = c ? VERDICT[c.verdict] : ["Not decided", "border-line"];
            return (
              <div
                key={d.id}
                className={cn(
                  "grid gap-1 rounded-xl border px-3 py-2 text-xs sm:grid-cols-[6.5rem_1fr_5rem]",
                  cls,
                )}
              >
                <span className="font-semibold">{d.event}</span>
                <span className={cn(!c && "text-muted")}>
                  {c ? c.learned : "Go back and choose."}
                </span>
                <span className="text-muted sm:text-right">{label}</span>
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        A Review is worth what the team learns about the product; a Retrospective is worth the one
        or two changes that actually happen. Here&apos;s what your choices produced.
      </p>
      <p className="text-muted text-sm">
        Change a decision in the previous step and come back to compare.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Guide or myth? --------------------------------------------------------------------------- */

export function Myths() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Guide or myth?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-myths"
            prompt="Sort each statement about the Review and Retrospective."
            categories={[
              { id: "guide", label: "The Scrum Guide says so" },
              { id: "myth", label: "Myth" },
            ]}
            items={[
              {
                id: "signoff",
                label: "The Sprint Review is where stakeholders sign off the work",
                category: "myth",
                why: "It's “a working session”, and “should never be considered a gate to releasing value”.",
              },
              {
                id: "undone",
                label:
                  "Work that doesn't meet the Definition of Done can't be presented at the Review",
                category: "guide",
                why: "“it cannot be released or even presented at the Sprint Review.” Saying openly that it isn't done is fine.",
              },
              {
                id: "po",
                label: "The Product Owner stays out of the Retrospective",
                category: "myth",
                why: "The Retrospective is for the Scrum Team, and the Product Owner is part of it.",
              },
              {
                id: "optional",
                label: "The Retrospective can be skipped when a Sprint goes well",
                category: "myth",
                why: "It concludes every Sprint. Good Sprints have lessons too.",
              },
              {
                id: "backlog",
                label:
                  "Improvements from the Retrospective may be added to the next Sprint Backlog",
                category: "guide",
                why: "“They may even be added to the Sprint Backlog for the next Sprint.” (The 2017 guide required one; 2020 softened it.)",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        The guide also says of the Retrospective: &ldquo;Assumptions that led them astray are
        identified and their origins explored.&rdquo;
      </p>
      <ScrumGuideCredit />
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Review: a working session",
                "Stakeholders use the product; together you decide what's next.",
              ],
              [
                "Only Done work is shown",
                "Be open about what isn't finished; don't demo it as if it were.",
              ],
              [
                "Retro: safety first",
                "Just the Scrum Team; look at the system, not for someone to blame.",
              ],
              ["One real change", "Pick the most helpful improvement and act on it soon."],
            ].map(([t, d], i) => (
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
          <div className="border-line bg-surface-2 rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Running a Retrospective</p>
            <p className="text-muted mt-1">
              Esther Derby and Diana Larsen&apos;s five phases (Agile Retrospectives, 2006; second
              edition 2024): Set the Stage, Gather Data, Generate Insights, Decide What to Do, Close
              the Retrospective. Popular activities include the 4Ls (Liked, Learned, Lacked, Longed
              for; by Mary Gorman and Ellen Gottesdiener) and the Speed Boat (from Luke
              Hohmann&apos;s Innovation Games). Retromat, by Corinna Baldauf, collects well over a
              hundred more.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Honest Retrospectives need <Term id="psychological-safety">psychological safety</Term>: Amy
        Edmondson&apos;s &ldquo;shared belief held by members of a team that the team is safe for
        interpersonal risk taking&rdquo;. Norm Kerth&apos;s Prime Directive, often read at the
        start, sets that tone.
      </p>
      <p>Next: the three artifacts and what each one commits to.</p>
    </StepLayout>
  );
}
