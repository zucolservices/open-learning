"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Diff, parseDiff } from "../_shared/diff";
import { COMMENTS, DIFF, LIMIT } from "./model";
import type { LookState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Inspector() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The inspector who checked the paint"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Twelve notes on paint colour</p>
            <p className="text-muted">…and not a word about the cracked foundation.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Structure first</p>
            <p className="text-muted">
              Foundations, wiring, plumbing; then, if there&apos;s time, the paint.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A building inspector who fills a report with notes about paint but misses a cracked
        foundation has done a busy, useless job. Order of importance matters.
      </p>
      <p>
        Code review is the same. Google&apos;s published guidance lists what to look for roughly in
        order: design first, then whether it works, complexity and tests, and only then naming,
        comments and style. Most style points belong to tools, not people.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Prioritise ⭐ -------------------------------------------------------------------------------- */

export function Prioritise() {
  const [s, set] = useSceneState<LookState>();
  const toggle = (id: string) =>
    set({
      picked: s.picked.includes(id)
        ? s.picked.filter((x) => x !== id)
        : s.picked.length < LIMIT
          ? [...s.picked, id]
          : s.picked,
    });
  const chosen = COMMENTS.filter((c) => s.picked.includes(c.id));
  const missedBig = COMMENTS.filter((c) => c.weight >= 4 && !s.picked.includes(c.id));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="You have time for four comments. Which ones?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Diff path="checkout.js" lines={parseDiff(DIFF)} />
          <div className="grid gap-1">
            {COMMENTS.map((c) => {
              const on = s.picked.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(c.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    on ? "border-good/50 bg-good/10" : "border-line bg-surface",
                    !on && s.picked.length >= LIMIT && "opacity-50",
                  )}
                >
                  <span className="text-muted mr-1.5 text-[10px] font-medium uppercase">
                    {c.cat}
                  </span>
                  {c.text}
                </button>
              );
            })}
          </div>
          <p className="text-xs">
            Chosen {s.picked.length} of {LIMIT}.
          </p>
          {s.picked.length === LIMIT && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("text-xs", missedBig.length ? "text-bad" : "text-good")}
            >
              {missedBig.length
                ? `Not posted: ${missedBig.map((c) => c.cat.toLowerCase()).join(", ")}. ${chosen.some((c) => c.cat === "Style") ? "Style points went in while a bigger problem shipped; let a formatter handle style." : "Swap something smaller for it."}`
                : "Design, the bug and the missing test are covered, with room for one more. A review the author can act on."}
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        A teammate&apos;s pull request adds loyalty points to a café&apos;s checkout. You could
        leave eight comments, but you have time to write four well. Choose.
      </p>
      <p>
        Praise is allowed: Google&apos;s list ends with &ldquo;good things&rdquo;. What isn&apos;t a
        good use of a reviewer&apos;s attention is anything a formatter would fix.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The list ------------------------------------------------------------------------------------- */

export function TheList() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Google's list, in order"
      stage={
        <div className="grid flex-1 content-center gap-1 sm:grid-cols-2">
          {[
            ["Design", "Is this the right change, in the right place?"],
            ["Functionality", "Does it do what's intended, for users and other code?"],
            ["Complexity", "Could it be simpler? Will others understand it?"],
            ["Tests", "Correct, sensible tests that would fail if it broke?"],
            ["Naming", "Clear names for everything?"],
            ["Comments", "Do they explain why, not what?"],
            ["Style and consistency", "Follows the style guide (ideally enforced by tools)?"],
            ["Documentation", "Updated docs, READMEs, changelogs?"],
            ["Every line and context", "Read everything you're asked to; look at the wider file."],
            ["Good things", "Say what's done well."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted block">{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        This is the list from Google&apos;s public engineering-practices guide, widely used beyond
        Google. The order isn&apos;t a strict rule, but it&apos;s a good default: big questions
        first.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The standard --------------------------------------------------------------------------------- */

export function Standard() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When is it good enough?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 text-xs">
            “Reviewers should favor approving a CL once it is in a state where it definitely
            improves the overall code health of the system being worked on, even if the CL
            isn&apos;t perfect.”
            <span className="text-muted block text-[10px]">
              Google, “The Standard of Code Review” (CL = changelist, Google&apos;s word for a
              change)
            </span>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            “There is no such thing as ‘perfect’ code; there is only better code.”
          </div>
        </div>
      }
    >
      <p>
        Reviewers can always find something else. The bar isn&apos;t perfection; it&apos;s whether
        the <Term id="code-health">code health</Term> of the codebase is better with this change
        than without it.
      </p>
      <p>
        Small improvements can still be mentioned, marked as optional, so the author decides. The
        module on blocking issues and nits comes back to this.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function LookCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Biggest questions first"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="review-look"
            prompt="Drag these review questions from most to least important."
            items={[
              { id: "design", label: "Is this the right change, in the right place?" },
              { id: "works", label: "Does it work, including edge cases?" },
              { id: "tests", label: "Are there tests that would catch it breaking?" },
              { id: "names", label: "Are the names clear?" },
              { id: "style", label: "Does the formatting match the style guide?" },
            ]}
            explanation="Design and correctness first, then tests and clarity. Formatting last, and preferably checked by a tool rather than a person."
          />
        </div>
      }
    >
      <p>Drag the questions into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Design first", "Is this the right change?"],
        ["Then: does it work?", "Bugs, edge cases, tests."],
        ["Clarity next", "Complexity, names, comments."],
        ["Style is for tools", "Don't spend review on semicolons."],
        ["Better, not perfect", "Approve when code health improves."],
      ]}
    >
      <p>That&apos;s the foundations. Next chapter: making your own changes easy to review.</p>
    </WrapStep>
  );
}
