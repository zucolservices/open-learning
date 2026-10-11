"use client";

import { motion } from "motion/react";
import { Check, CircleHelp, Eye } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SECTIONS, SELF_REVIEW } from "./model";
import type { DescState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Handover() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The shift handover note"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“Changed the fryer stuff.”</p>
            <p className="text-muted">
              The evening cook has to work out what changed, and why, mid-service.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">
              “Fryer now at 170°C, not 180°C: the new oil smokes at 180. Check the first batch is
              golden.”
            </p>
            <p className="text-muted">What, why, and how to check, in two lines.</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A good handover note tells the next shift what changed, why, and what to watch. Thirty
        seconds of writing saves the next person half an hour of guessing.
      </p>
      <p>
        A pull request description is the same note for your reviewer, and for anyone reading the
        history later. The diff shows <em>what</em> changed; only you know <em>why</em>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build the description ⭐ --------------------------------------------------------------------- */

export function Build() {
  const [s, set] = useSceneState<DescState>();
  const pick = (id: string, i: number) => set({ picks: { ...s.picks, [id]: i } });
  return (
    <StepLayout
      eyebrow="Build"
      title="Write the description, one section at a time"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5">
            {SECTIONS.map((sec) => {
              const p = s.picks[sec.id];
              return (
                <div
                  key={sec.id}
                  className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
                >
                  <p className="font-semibold">{sec.label}</p>
                  <div className="mt-1 grid gap-1">
                    {sec.options.map((o, i) => (
                      <button
                        key={o.text}
                        type="button"
                        aria-pressed={p === i}
                        onClick={() => pick(sec.id, i)}
                        className={cn(
                          "rounded border px-2 py-1 text-left text-[11px]",
                          p === i
                            ? o.good
                              ? "border-good bg-good/15"
                              : "border-bad bg-bad/10"
                            : "border-line text-muted",
                        )}
                      >
                        {o.text}
                      </button>
                    ))}
                  </div>
                  {p !== undefined && (
                    <p
                      className={cn(
                        "mt-0.5 text-[10px]",
                        sec.options[p].good ? "text-good" : "text-muted",
                      )}
                    >
                      {sec.options[p].why}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted mb-1 text-[10px] font-medium">The reviewer&apos;s questions</p>
            {SECTIONS.map((sec) => {
              const ok = s.picks[sec.id] !== undefined && sec.options[s.picks[sec.id]].good;
              return (
                <p
                  key={sec.id}
                  className={cn("flex items-center gap-1.5", ok && "text-muted line-through")}
                >
                  {ok ? (
                    <Check className="text-good size-3" />
                  ) : (
                    <CircleHelp className="text-muted size-3" />
                  )}
                  {sec.question}
                </p>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        Your fix for a café&apos;s pricing bug is ready. Build its description by choosing one
        sentence for each section, and watch which of the reviewer&apos;s questions get answered
        before they ask.
      </p>
      <p>
        A good description is short. Five clear sentences beat a page, and beat &ldquo;Fix
        bug&rdquo; by a mile.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Self-review ---------------------------------------------------------------------------------- */

export function SelfReview() {
  const [s, set] = useSceneState<DescState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Review it yourself first"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <button
            type="button"
            onClick={() => set({ selfReviewed: true })}
            className="bg-accent text-accent-fg flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          >
            <Eye className="size-3" /> Read your own diff before asking
          </button>
          {s.selfReviewed &&
            SELF_REVIEW.map((x, i) => (
              <motion.p
                key={x}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                Found and fixed: {x}
              </motion.p>
            ))}
          {s.selfReviewed && (
            <p className="text-good text-xs">
              Three things your reviewer won&apos;t have to point out.
            </p>
          )}
        </div>
      }
    >
      <p>
        Reading your own diff in the review tool, as a reviewer would, catches leftovers you never
        notice in your editor: debug output, files changed by accident, unexplained TODOs.
      </p>
      <p>
        It&apos;s a widely recommended habit rather than a formal rule, and it respects your
        reviewer&apos;s time. Re-read the description too before merging: changes drift during
        review.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Links ---------------------------------------------------------------------------------------- */

export function Links() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Connect it to the rest of the work"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Link the issue",
              "“Closes #482” in the description closes the issue automatically when the PR merges into the default branch, on GitHub and GitLab.",
            ],
            [
              "Link decisions",
              "If the change follows a design document or decision record, link it.",
            ],
            [
              "Link the alternative",
              "If you tried something else first, a sentence saves the reviewer suggesting it.",
            ],
            [
              "Write for the future",
              "The description stays in history; someone will read it while hunting a bug next year.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Google&apos;s guide asks for a first line that is a short, complete sentence in the
        imperative (&ldquo;Delete the FizzBuzz RPC&rdquo;), then a body with the problem, why this
        approach, and any shortcomings. It lists &ldquo;Fix bug&rdquo; and &ldquo;Phase 1&rdquo; as
        examples of what not to write.
      </p>
      <p>
        That first line often becomes the <Term id="commit-message">commit message</Term> summary,
        so it lives in the history for good.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DescCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Choose the first line"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="review-describing"
            prompt="Which is the best first line for a pull request description?"
            options={[
              { id: "a", label: "Updates", feedback: "Says nothing about what or why." },
              {
                id: "b",
                label: "Show loyalty points on the receipt screen",
                correct: true,
                feedback: "Short, imperative, and makes sense alone.",
              },
              {
                id: "c",
                label: "Phase 2 of the work we discussed",
                feedback: "Only meaningful to people who were in the discussion.",
              },
              {
                id: "d",
                label: "Changed Receipt.tsx and added two props",
                feedback: "Describes files, not purpose.",
              },
            ]}
            explanation="A good first line is a short, complete sentence in the imperative that makes sense to someone skimming history with no other context."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["The diff shows what; you explain why", "Problem, approach, evidence."],
        ["A first line that stands alone", "Short, imperative, specific."],
        ["Say how to check it", "Tests and a quick manual check."],
        ["Name the risks", "And how to roll back."],
        ["Review your own diff first", "Catch leftovers before anyone else does."],
      ]}
    >
      <p>Next: replying to the review you get back.</p>
    </WrapStep>
  );
}
