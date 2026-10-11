"use client";

import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { THREADS } from "./model";
import type { RespondState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Tasting() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Feedback on the new recipe"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“Too salty.”</p>
            <p className="text-muted">
              The new cook can sulk, argue, or ask how much less salt, and try again.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The aim is the dish</p>
            <p className="text-muted">
              The head chef isn&apos;t judging the cook. Both want the same thing: food customers
              love.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        When the head chef tastes a new cook&apos;s dish and says it&apos;s too salty, that&apos;s
        about the dish, not the cook. Cooks who treat feedback as information improve fastest.
      </p>
      <p>
        Review comments are the same. Google&apos;s guide for authors opens with &ldquo;Don&apos;t
        take it personally&rdquo;: the goal is the quality of the code and the product. Your reply
        decides whether a <Term id="review-thread">review thread</Term> ends in a better change or
        an argument.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Reply ⭐ ------------------------------------------------------------------------------------- */

export function Reply() {
  const [s, set] = useSceneState<RespondState>();
  const answered = THREADS.filter((t) => s.replies[t.id] !== undefined);
  const good = answered.filter((t) => t.replies[s.replies[t.id]].good).length;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Answer the review on your pull request"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {THREADS.map((t) => {
            const pick = s.replies[t.id];
            return (
              <div
                key={t.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="flex items-start gap-1.5">
                  <MessageSquare className="text-muted mt-0.5 size-3 shrink-0" />
                  <span>
                    <span className="text-muted text-[10px] uppercase">{t.kind}</span> {t.comment}
                  </span>
                </p>
                <div className="mt-1 grid gap-1 pl-4">
                  {t.replies.map((r, i) => (
                    <button
                      key={r.text}
                      type="button"
                      aria-pressed={pick === i}
                      onClick={() => set({ replies: { ...s.replies, [t.id]: i } })}
                      className={cn(
                        "rounded border px-2 py-1 text-left text-[11px]",
                        pick === i
                          ? r.good
                            ? "border-good bg-good/15"
                            : "border-bad bg-bad/10"
                          : "border-line text-muted",
                      )}
                    >
                      {r.text}
                    </button>
                  ))}
                </div>
                {pick !== undefined && (
                  <p
                    className={cn(
                      "mt-1 pl-4 text-[10px]",
                      t.replies[pick].good ? "text-good" : "text-muted",
                    )}
                  >
                    {t.replies[pick].why}
                  </p>
                )}
              </div>
            );
          })}
          {answered.length === THREADS.length && (
            <p className="text-xs">
              {good === THREADS.length
                ? "Every thread ends with a better change and a colleague who'd happily review for you again."
                : `${good} of ${THREADS.length} replies move things forward. Try the others again.`}
            </p>
          )}
        </div>
      }
    >
      <p>
        Your pull request adds bill-splitting to a café app. Five comments are waiting. Pick a reply
        for each and see how it lands.
      </p>
      <p>
        Notice the difference between kinds of comment: a blocking bug, a question, a confused
        reader, a vague complaint and a nit. Good replies differ for each, but none of them are
        defensive.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Four habits ---------------------------------------------------------------------------------- */

export function Habits() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four habits from Google's guide for authors"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Don't take it personally",
              "“Never respond in anger to code review comments.” The goal is the code and the product.",
            ],
            [
              "Fix the code",
              "If a reviewer doesn't understand something, clarify the code itself, so future readers won't be confused either.",
            ],
            [
              "Think collaboratively",
              "First ask yourself: “Do I understand what the reviewer is asking for?” Then assume they might be right.",
            ],
            [
              "Resolve conflicts",
              "Try to reach agreement with the reviewer first; if that fails, talk it through, then escalate fairly.",
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
        Google publishes its code review guidance as &ldquo;engineering practices&rdquo;, one of the
        most widely read guides on the subject. Its advice for authors fits on one screen.
      </p>
      <p>You&apos;ll meet disagreements again in the culture chapter.</p>
    </StepLayout>
  );
}

/* 4 ─ Closing the loop ----------------------------------------------------------------------------- */

export function CloseLoop() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Closing the loop"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Reply to every comment", "Even “Done” tells the reviewer you saw it and acted."],
            [
              "Push fixes as new commits during review",
              "The reviewer can see exactly what changed since last time.",
            ],
            [
              "Resolve threads",
              "On GitHub the author or anyone with write access can resolve a conversation; teams agree who usually does.",
            ],
            [
              "Ask for another look",
              "Re-request review when you're ready, rather than leaving the reviewer to guess.",
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
        Reviews stall when nobody knows whose turn it is. Small habits keep the ball visibly in
        someone&apos;s court, and get the change merged sooner.
      </p>
      <p>
        The same rules apply to comments from automated and AI reviewers: understand them, act or
        explain, then resolve.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function RespondCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Helpful reply or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-responding"
            prompt="Sort each reply to a review comment."
            categories={[
              { id: "good", label: "Moves it forward" },
              { id: "bad", label: "Stalls it" },
            ]}
            items={[
              {
                id: "thanks",
                label: "“Good catch, fixed in the latest commit.”",
                category: "good",
                why: "Acknowledges and closes the loop.",
              },
              {
                id: "obvious",
                label: "“It's obvious if you read it properly.”",
                category: "bad",
                why: "Defensive; clarify the code instead.",
              },
              {
                id: "explain",
                label: "“I kept it because the API requires it; added a comment saying so.”",
                category: "good",
                why: "Explains, and helps the next reader.",
              },
              {
                id: "silent",
                label: "Silently ignoring a blocking comment",
                category: "bad",
                why: "Unresolved concerns come back.",
              },
              {
                id: "call",
                label: "“This thread is long; shall we talk for five minutes?”",
                category: "good",
                why: "Moving to a conversation settles things faster.",
              },
            ]}
            explanation="Good replies assume good intent, fix or explain, help the next reader, and make it clear the ball is back with the reviewer."
          />
        </div>
      }
    >
      <p>Sort each reply.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["About the code, not you", "Assume good intent."],
        ["Fix the code, not just the thread", "Clarify for every future reader."],
        ["Thank, fix, or explain", "Every comment gets a reply."],
        ["Nits are optional", "Change them or decline briefly."],
        ["Close the loop", "Resolve threads, re-request review."],
      ]}
    >
      <p>That&apos;s the authoring chapter. Next: reviewing, starting with how to read a diff.</p>
    </WrapStep>
  );
}
