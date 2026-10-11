"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SCENES } from "./model";
import type { DisState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Referee() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The rulebook, the conversation and the referee"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Is it in the rulebook?", "Then the rulebook decides. No debate needed."],
            ["Not in the rulebook?", "The players talk it through face to face."],
            ["Still can't agree?", "The referee decides, and play goes on."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              style={{ marginLeft: `${i * 16}px` }}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Friendly football games still have arguments. They don&apos;t stop the match because
        there&apos;s an order for settling them: the rules first, then talking, then a referee.
      </p>
      <p>
        Review disagreements are normal and often useful. What hurts is a{" "}
        <Term id="review-thread">review thread</Term> that drags on for days. Teams need the same
        kind of ladder.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three disagreements ⭐ ----------------------------------------------------------------------- */

export function Three() {
  const [s, set] = useSceneState<DisState>();
  const done = SCENES.every(
    (sc) => SCENES.find((x) => x.id === sc.id)!.options.find((o) => o.id === s.picks[sc.id])?.best,
  );
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Settle three disagreements"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {SCENES.map((sc, i) => {
            const pick = sc.options.find((o) => o.id === s.picks[sc.id]);
            const unlocked =
              i === 0 ||
              SCENES[i - 1].options.find((o) => o.id === s.picks[SCENES[i - 1].id])?.best;
            if (!unlocked) return null;
            return (
              <motion.div
                key={sc.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="text-muted text-[10px] font-medium">
                  {i + 1}. {sc.kind}
                </p>
                <p className="font-semibold">{sc.title}</p>
                <div className="text-muted my-1 space-y-0.5 border-l-2 pl-2 text-[11px]">
                  {sc.thread.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
                <div className="grid gap-1">
                  {sc.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={pick?.id === o.id}
                      onClick={() => set({ picks: { ...s.picks, [sc.id]: o.id } })}
                      className={cn(
                        "rounded-md border px-2 py-1 text-left text-[11px]",
                        pick?.id === o.id
                          ? o.best
                            ? "border-good bg-good/15"
                            : "border-bad bg-bad/10"
                          : "border-line hover:border-line-strong",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-1 text-[11px]", pick.best ? "text-good" : "text-muted")}>
                    {pick.outcome}
                    {!pick.best && " Try another way."}
                  </p>
                )}
              </motion.div>
            );
          })}
          {done && (
            <p className="text-good text-xs">
              Rulebook, conversation, referee: each disagreement settled at the lowest level that
              works.
            </p>
          )}
        </div>
      }
    >
      <p>
        Three disagreements, each harder than the last. Choose how to handle each one; the next
        appears once you&apos;ve found a way forward.
      </p>
      <p>There&apos;s no penalty for exploring the other options to see where they lead.</p>
    </StepLayout>
  );
}

/* 3 ─ Facts, principles, preferences --------------------------------------------------------------- */

export function Ladder() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Facts, principles, preferences"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Facts and data",
              "Benchmarks, bug reports, measurements. These overrule opinions.",
              "border-good/50 bg-good/10",
            ],
            [
              "The style guide",
              "The final word on style. If it isn't covered, it's preference.",
              "border-line bg-surface",
            ],
            [
              "Engineering principles",
              "Simplicity, testability, consistency with nearby code.",
              "border-line bg-surface",
            ],
            [
              "Personal preference",
              "If both ways are valid, the author's choice usually stands.",
              "border-line bg-surface opacity-80",
            ],
          ].map(([t, b, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className={cn("rounded-lg border px-3 py-2 text-xs", c)}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Google&apos;s review guide ranks arguments: technical facts and data beat opinions; the
        style guide settles style; beyond that, you appeal to engineering principles. A
        reviewer&apos;s taste alone isn&apos;t enough to block a change.
      </p>
      <p>
        It also tells reviewers to start by asking whether the author is right. They are often
        closer to the code.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Commit --------------------------------------------------------------------------------------- */

export function Commit() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Disagree and commit, and don't defer the cleanup"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Disagree and commit</p>
            <p className="text-muted">
              Argue your case fully. Once a decision is made, back it completely, and don&apos;t
              reopen it in every later review.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">&ldquo;I&apos;ll clean it up later&rdquo;</p>
            <p className="text-muted">
              Google&apos;s guide warns that cleanup promised for later usually never happens. Ask
              for it now, or file a ticket assigned to the author.
            </p>
          </div>
        </div>
      }
    >
      <p>
        &ldquo;Disagree and commit&rdquo; is associated with Intel under Andy Grove and Sun
        Microsystems, and later became an Amazon leadership principle. It applies after a real
        discussion, not instead of one.
      </p>
      <p>
        Whatever you agree on a call, write it in the thread so later readers know why the code
        looks as it does.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DisCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Climb the ladder"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="review-disagreements"
            prompt="Put these steps for settling a disagreement in order, first to last."
            items={[
              { id: "guide", label: "Check facts, data and the style guide" },
              { id: "explain", label: "Explain your reasoning in the thread" },
              { id: "call", label: "Move to a short call and record the outcome" },
              { id: "lead", label: "Ask a tech lead or code owner to decide" },
              { id: "commit", label: "Both commit to the decision" },
            ]}
            explanation="Settle at the lowest level that works: rules first, then reasons, then a conversation, then someone with authority. Then commit and move on."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Disagreement is normal", "Long threads are the problem."],
        ["Facts beat opinions", "Style guide settles style."],
        ["Talk, don't type", "A short call, then write it down."],
        ["Escalate fairly", "A lead or code owner breaks ties."],
        ["Commit and move on", "Don't reopen it every review."],
      ]}
    >
      <p>Next: when a pull request isn&apos;t the only way to review.</p>
    </WrapStep>
  );
}
