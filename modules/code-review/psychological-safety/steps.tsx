"use client";

import { motion } from "motion/react";
import { MessageCircle, MicOff } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HABITS, PEOPLE } from "./model";
import type { SafetyState } from "./state";

/* 2 ─ Habits --------------------------------------------------------------------------------------- */

export function Habits() {
  const [s, set] = useSceneState<SafetyState>();
  const n = s.habits.length;
  const toggle = (id: string) =>
    set({ habits: s.habits.includes(id) ? s.habits.filter((x) => x !== id) : [...s.habits, id] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Who speaks up in the next review?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1">
            {HABITS.map((h) => (
              <label
                key={h.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  s.habits.includes(h.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s.habits.includes(h.id)}
                  onChange={() => toggle(h.id)}
                  className="accent-current"
                />
                {h.label}
              </label>
            ))}
          </div>
          <div className="grid gap-1.5">
            {PEOPLE.map((p) => {
              const speaks = n >= p.needs;
              return (
                <motion.div
                  key={p.name}
                  layout
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
                    speaks ? "border-good/40 bg-good/10" : "border-line bg-surface opacity-70",
                  )}
                >
                  {speaks ? (
                    <MessageCircle className="text-good mt-px size-3.5 shrink-0" />
                  ) : (
                    <MicOff className="text-muted mt-px size-3.5 shrink-0" />
                  )}
                  <span>
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-muted"> ({p.role}): </span>
                    {speaks ? p.says : "Notices something, says nothing."}
                  </span>
                </motion.div>
              );
            })}
          </div>
          {n === HABITS.length && (
            <p className="text-good text-xs">
              With every habit in place, the newest person speaks up, and theirs was the most
              important comment.
            </p>
          )}
        </div>
      }
    >
      <p>
        Three people will look at the next pull request. Each noticed something. Whether they say it
        depends on the team&apos;s <Term id="psychological-safety">psychological safety</Term>, and
        that comes from habits.
      </p>
      <p>
        Switch habits on and see who speaks. It&apos;s a simplification, but a familiar pattern: the
        most senior speak regardless; the newest need the most safety, and often see what others
        have stopped noticing.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Research ------------------------------------------------------------------------------------- */

export function Research() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tone and power in review"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Google's team study",
              "Of five dynamics in effective teams, psychological safety mattered most (internal research, published 2015, not peer-reviewed).",
            ],
            [
              "Pushback isn't equal",
              "At Google, authors who were women, Black, Hispanic or Latinx, Asian, or older received measurably more pushback in review, costing an estimated 1,000+ engineer-hours a day (2022).",
            ],
            [
              "Destructive criticism",
              "Vague or inconsiderate feedback; in one survey of 93 developers, women rated it less appropriate and felt less motivated after it (2022).",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Review carries power: a reviewer can block someone&apos;s work. That makes tone matter more,
        and it means unfairness can creep in without anyone intending it.
      </p>
      <p>
        The survey is small and scenario-based, so it suggests rather than proves. The pattern is
        consistent, though: specific, considerate feedback keeps people contributing.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Safety and standards ------------------------------------------------------------------------- */

export function Zones() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Safety and standards together"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              [
                "Comfort zone",
                "High safety, low standards: pleasant, little learning.",
                "border-line bg-surface",
              ],
              [
                "Learning zone",
                "High safety, high standards: people stretch and speak up.",
                "border-good/50 bg-good/10",
              ],
              ["Apathy zone", "Low safety, low standards: nobody cares.", "border-line bg-surface"],
              [
                "Anxiety zone",
                "Low safety, high standards: people hide mistakes.",
                "border-bad/40 bg-bad/10",
              ],
            ].map(([t, b, c]) => (
              <div key={t} className={cn("rounded-lg border px-3 py-2", c)}>
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{b}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle mt-2 text-[10px]">
            Top row: high safety. Right column: high standards. After Amy Edmondson.
          </p>
        </div>
      }
    >
      <p>
        Edmondson describes safety and standards as two separate dials. Good review cultures turn
        both up: they expect high-quality code and make it safe to admit you&apos;re unsure.
      </p>
      <p>
        Practical moves: review the code, not the person; be specific; explain why; label optional
        points; and review seniors&apos; code as carefully as juniors&apos;.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SafetyCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Builds or erodes?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-safety"
            prompt="Does each habit build or erode psychological safety?"
            categories={[
              { id: "build", label: "Builds it" },
              { id: "erode", label: "Erodes it" },
            ]}
            items={[
              {
                id: "q",
                label: "“What made you choose this approach?”",
                category: "build",
                why: "A real question, not a verdict.",
              },
              {
                id: "obv",
                label: "“Obviously this is wrong.”",
                category: "erode",
                why: "Judges the person, explains nothing.",
              },
              {
                id: "senior",
                label: "The tech lead's changes skip review",
                category: "erode",
                why: "Signals that review is for juniors.",
              },
              {
                id: "thank",
                label: "Thanking a reviewer who found your bug",
                category: "build",
                why: "Makes finding problems welcome.",
              },
              {
                id: "lower",
                label: "Approving anything to keep people happy",
                category: "erode",
                why: "Safety needs standards too; this teaches nothing.",
              },
            ]}
            explanation="Safety comes from questions, specifics, thanks and equal treatment, with standards kept high. Judgement, special treatment and empty approvals all erode it."
          />
        </div>
      }
    >
      <p>Sort each habit.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Safety finds bugs", "People share doubts when it's safe."],
        ["Safe isn't soft", "Keep standards high."],
        ["Tone carries power", "Reviewers can block; choose words carefully."],
        ["Watch for unequal pushback", "Treat everyone's code the same."],
        ["Habits build it", "Questions, specifics, thanks."],
      ]}
    >
      <p>Next: what to do when author and reviewer simply disagree.</p>
    </WrapStep>
  );
}
