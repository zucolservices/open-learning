"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ITEMS } from "./model";
import type { FeedbackState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Coach() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Two cricket coaches"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“That was terrible.”</p>
            <p className="text-muted">
              The batter knows something went wrong, not what, and now dreads the nets.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">
              “Your front foot is landing outside the line, so you&apos;re chasing wide balls. Try
              planting it straighter.”
            </p>
            <p className="text-muted">What, why, and what to try next.</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Two coaches watch the same mistake. One says &ldquo;terrible&rdquo;; the other says what
        happened, why it matters and what to try. Only one makes the batter better.
      </p>
      <p>
        Review comments are coaching. Useful <Term id="review-comment">comments</Term> are specific,
        explain why, suggest a way forward, and are about the code rather than the person.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rewrite ⭐ ----------------------------------------------------------------------------------- */

export function Rewrite() {
  const [s, set] = useSceneState<FeedbackState>();
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Rewrite five unhelpful comments"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ITEMS.map((it) => {
            const p = s.picks[it.id];
            const o = p !== undefined ? it.options[p] : null;
            return (
              <div
                key={it.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="text-bad flex items-center gap-1.5 line-through decoration-1">
                  <X className="size-3 shrink-0" />
                  {it.bad}
                </p>
                <div className="mt-1 grid gap-1">
                  {it.options.map((op, i) => (
                    <button
                      key={op.text}
                      type="button"
                      aria-pressed={p === i}
                      onClick={() => set({ picks: { ...s.picks, [it.id]: i } })}
                      className={cn(
                        "rounded border px-2 py-1 text-left text-[11px]",
                        p === i
                          ? op.kind === "good"
                            ? "border-good bg-good/15"
                            : "border-bad bg-bad/10"
                          : "border-line text-muted",
                      )}
                    >
                      {op.text}
                    </button>
                  ))}
                </div>
                {o && (
                  <p
                    className={cn(
                      "mt-0.5 text-[10px]",
                      o.kind === "good" ? "text-good" : "text-muted",
                    )}
                  >
                    {o.kind === "good"
                      ? it.why
                      : o.kind === "vague"
                        ? "Polite, but the author still doesn't know what to change or why."
                        : "Still about the person, not the code."}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        A reviewer left these five comments on a teammate&apos;s pull request. For each, choose the
        rewrite you&apos;d want to receive.
      </p>
      <p>
        Watch for the two ways to get it wrong: harsh comments that attack, and vague ones that are
        polite but give the author nothing to act on.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Google's advice ------------------------------------------------------------------------------ */

export function Advice() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four habits for comments"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Be kind",
              "Comment on the code, never the developer. Courteous and clear can go together.",
            ],
            [
              "Explain your reasoning",
              "Why it matters: performance, correctness, readability, team convention.",
            ],
            [
              "Balance directions and questions",
              "Sometimes say exactly what to do; sometimes point out the problem and let the author decide.",
            ],
            [
              "Ask for clearer code, not explanations",
              "If you're confused, the fix is usually clearer code or a code comment; explanations in the review tool don't help future readers.",
            ],
            [
              "Say what's good",
              "Telling someone what they did well is sometimes even more valuable.",
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
        These come from Google&apos;s guide &ldquo;How to write code review comments&rdquo;.
        They&apos;re simple, and easy to forget at the end of a long day.
      </p>
      <p>Before posting, reread your comment as if you were the author receiving it.</p>
    </StepLayout>
  );
}

/* 4 ─ Why tone matters ----------------------------------------------------------------------------- */

export function Tone() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why tone matters"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Destructive criticism</p>
            <p className="text-muted">
              Vague or inconsiderate negative feedback. In a 2022 study of 93 software professionals
              shown example review comments, women rated it as less appropriate and were less
              willing to keep working with that person. The authors suggest this could contribute to
              low gender diversity in software teams.
            </p>
          </div>
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 text-xs">
            Specific, kind, actionable comments cost a few extra words and keep people learning and
            speaking up.
          </div>
        </div>
      }
    >
      <p>
        A harsh comment doesn&apos;t just sting; it affects who stays on a team and who feels able
        to ask questions. The research is early and based on hypothetical scenarios, but it points
        the same way as common sense.
      </p>
      <p>The culture chapter returns to this with psychological safety.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function FeedbackCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Useful or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-feedback"
            prompt="Is each comment useful as written?"
            categories={[
              { id: "useful", label: "Useful" },
              { id: "not", label: "Needs rewriting" },
            ]}
            items={[
              {
                id: "why",
                label:
                  "“This catches every error, including the timeout we want to retry. Could it catch only PaymentDeclined?”",
                category: "useful",
                why: "Specific, explains why, suggests.",
              },
              {
                id: "vague",
                label: "“Hmm, not sure about this.”",
                category: "not",
                why: "What's the concern?",
              },
              {
                id: "person",
                label: "“You always overcomplicate things.”",
                category: "not",
                why: "About the person, not the code.",
              },
              {
                id: "praise",
                label: "“The new test names read like the spec. Great.”",
                category: "useful",
                why: "Specific praise.",
              },
              {
                id: "q",
                label: "“What happens if two staff refund the same order at once?”",
                category: "useful",
                why: "A genuine, specific question.",
              },
            ]}
            explanation="Useful comments are specific, about the code, explain why or ask a real question, and often suggest a next step. Praise counts when it's specific."
          />
        </div>
      }
    >
      <p>Sort each comment.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["About the code, not the person", "Always."],
        ["Specific", "Which line, what problem."],
        ["Explain why", "And suggest a way forward."],
        ["Neither harsh nor vague", "Kind and clear together."],
        ["Praise specifically", "Say what to keep doing."],
      ]}
    >
      <p>Next: telling the author how much each comment matters.</p>
    </WrapStep>
  );
}
