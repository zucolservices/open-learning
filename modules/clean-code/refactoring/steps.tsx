"use client";

import { motion } from "motion/react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { LEAP, SMALL, runAll } from "./model";
import type { RefactorState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Rearranging() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Rearranging the kitchen during service"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">All at once</p>
            <p className="text-muted">
              Move every shelf on Saturday night. Orders back up, nobody can find the salt, and
              nobody knows which move caused the chaos.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">One shelf at a time</p>
            <p className="text-muted">
              Move one shelf, check service still runs, move the next. If something breaks, it was
              the last move.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A kitchen can be completely reorganised without closing, if it&apos;s done one small move at
        a time with a check after each.
      </p>
      <p>
        That&apos;s <Term id="refactoring">refactoring</Term>: improving the structure of code
        without changing what it does, in small steps, running the tests after each one. If a test
        fails, the culprit is the step you just took.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Small steps vs a big leap ⭐ ----------------------------------------------------------------- */

export function Steps() {
  const [s, set] = useSceneState<RefactorState>();
  const v = s.mode === "small" ? SMALL[s.step] : s.leapt ? LEAP : SMALL[0];
  const results = runAll(v.fn);
  const allOk = results.every((r) => r.ok);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Refactor in small steps, or one big leap"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {(["small", "leap"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.mode === m}
                onClick={() => set({ mode: m, step: 0, leapt: false })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.mode === m
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {m === "small" ? "Small steps" : "One big leap"}
              </button>
            ))}
          </div>
          {s.mode === "small" ? (
            <div className="flex flex-wrap items-center gap-2">
              {s.step < SMALL.length - 1 ? (
                <button
                  type="button"
                  onClick={() => set({ step: s.step + 1 })}
                  className="bg-accent text-accent-fg flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                >
                  Next: {SMALL[s.step + 1].name} <ArrowRight className="size-3" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => set({ step: 0 })}
                  className="border-line-strong flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
                >
                  <RotateCcw className="size-3" /> Start again
                </button>
              )}
              <span className="text-muted text-xs">
                Step {s.step} of {SMALL.length - 1}: {v.name}
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={s.leapt}
                onClick={() => set({ leapt: true })}
                className="bg-accent text-accent-fg rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40"
              >
                Rewrite it all at once
              </button>
              {s.leapt && (
                <button
                  type="button"
                  onClick={() => set({ leapt: false })}
                  className="border-line-strong flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
                >
                  <RotateCcw className="size-3" /> Undo
                </button>
              )}
            </div>
          )}
          <Code key={`${s.mode}-${s.step}-${s.leapt}`} lines={v.code} title="bill.js" />
          <div
            className={cn(
              "rounded-lg border px-3 py-2 font-mono text-[10.5px]",
              allOk ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            {results.map((r) => (
              <p key={r.name} className={cn("flex items-start gap-1.5", !r.ok && "text-bad")}>
                {r.ok ? (
                  <Check className="text-good mt-0.5 size-3 shrink-0" />
                ) : (
                  <X className="mt-0.5 size-3 shrink-0" />
                )}
                {r.name}
                {!r.ok && (
                  <span className="text-muted"> · got {Math.round(r.got * 10000) / 10000}</span>
                )}
              </p>
            ))}
          </div>
          {s.mode === "leap" && s.leapt && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs">
              Two tests fail, and the rewrite changed everything at once. Was it the discount? The
              rounding? The loop? You&apos;re now debugging, not refactoring.
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        The same messy function, two ways to clean it up. In small-steps mode, each click applies
        one named refactoring and the four tests run again, really. They stay green the whole way.
      </p>
      <p>
        Then try the big leap: a tidy-looking rewrite that quietly changed two behaviours. With
        every line different, the failing tests can&apos;t tell you which change is to blame.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two hats ------------------------------------------------------------------------------------- */

export function TwoHats() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two hats, and making the change easy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Refactoring hat</p>
              <p className="text-muted">
                Change structure only. Tests should stay green throughout.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Feature hat</p>
              <p className="text-muted">Change behaviour. Add or change tests first.</p>
            </div>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            “For each desired change, make the change easy (warning: this may be hard), then make
            the easy change.”
            <span className="text-muted block text-[10px]">Kent Beck, 2012</span>
          </div>
        </div>
      }
    >
      <p>
        Fowler, crediting Kent Beck, describes two hats: when refactoring you don&apos;t change
        behaviour, and when adding features you don&apos;t restructure. Wear one at a time, and
        commit them separately.
      </p>
      <p>
        Beck&apos;s line explains when to refactor: just before a change, to make that change
        simple. The &ldquo;warning&rdquo; is the honest part; preparing the ground can be the hard
        work.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Catalogue and tools -------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Named moves, done by tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Definition",
              "“A change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behavior.” (Martin Fowler)",
            ],
            [
              "The catalogue",
              "Fowler's Refactoring (1999; 2nd ed. 2018, in JavaScript) names over 60 moves, each with step-by-step mechanics.",
            ],
            [
              "History",
              "The word first appeared in print in 1990 (Opdyke and Johnson); William Opdyke's 1992 thesis was the first full study.",
            ],
            [
              "Tools",
              "Editors and IDEs automate the common moves (rename, extract function, move, inline) safely across a whole codebase.",
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
        Naming the moves matters for the same reason smell names do: &ldquo;extract function, then
        inline variable&rdquo; is a precise plan. Let the editor do mechanical moves; it&apos;s
        faster and makes fewer mistakes than hand edits.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function RefactorCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="One refactoring, in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="clean-refactoring"
            prompt="Drag the steps of a safe refactoring into order."
            items={[
              { id: "green", label: "Check the tests pass before you start" },
              { id: "one", label: "Make one small structural change" },
              { id: "run", label: "Run the tests" },
              { id: "commit", label: "Commit while green" },
              { id: "next", label: "Pick the next small change" },
            ]}
            explanation="Start green, change one thing, run the tests, commit, repeat. If a test fails, undo the last step rather than debugging a big change."
          />
        </div>
      }
    >
      <p>Drag the steps into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Same behaviour, better structure", "That's the definition."],
        ["Small steps, tests after each", "Failures point at the last step."],
        ["Two hats", "Refactor or add features, never both at once."],
        ["Make the change easy first", "Then make the easy change."],
        ["Let tools do mechanical moves", "Rename, extract, move, inline."],
      ]}
    >
      <p>Next: technical debt, and how shortcuts compound.</p>
    </WrapStep>
  );
}
