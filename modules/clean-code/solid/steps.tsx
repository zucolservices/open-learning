"use client";

import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { PRINCIPLES } from "./model";
import type { SolidState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Proverbs() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Proverbs, not laws"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“Too many cooks spoil the broth.”</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“Many hands make light work.”</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Both proverbs are true, sometimes. Wisdom is knowing which one applies to the job in front
        of you.
      </p>
      <p>
        <Term id="solid">SOLID</Term> is five widely taught principles for designing classes and
        modules. They capture real lessons, and they&apos;re also argued about. This module shows
        what each is for, then asks you to decide when it&apos;s worth applying.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------- */

export function FivePrinciples() {
  const [s, set] = useSceneState<SolidState>();
  const p = PRINCIPLES[s.step];
  const ans = s.answers[p.letter];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Five principles, five judgement calls"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-1">
            {PRINCIPLES.map((x, i) => (
              <button
                key={x.letter}
                type="button"
                aria-label={x.name}
                aria-pressed={s.step === i}
                onClick={() => set({ step: i })}
                className={cn(
                  "size-8 rounded-lg border font-mono text-sm font-bold",
                  s.step === i
                    ? "border-accent bg-accent text-accent-fg"
                    : s.answers[x.letter] !== undefined
                      ? "border-line-strong bg-surface-2"
                      : "border-line text-muted",
                )}
              >
                {x.letter}
              </button>
            ))}
            <span className="ml-auto flex gap-1">
              <button
                type="button"
                aria-label="Previous principle"
                disabled={s.step === 0}
                onClick={() => set({ step: s.step - 1 })}
                className="border-line-strong rounded-full border p-1 disabled:opacity-30"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Next principle"
                disabled={s.step === PRINCIPLES.length - 1}
                onClick={() => set({ step: s.step + 1 })}
                className="border-line-strong rounded-full border p-1 disabled:opacity-30"
              >
                <ArrowRight className="size-3.5" />
              </button>
            </span>
          </div>
          <motion.div
            key={p.letter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-2"
          >
            <p className="text-sm font-semibold">
              {p.name} <span className="text-muted font-normal">· {p.short}</span>
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Code lines={p.before} title="Before" numbers={false} />
              <Code lines={p.after} title="After" numbers={false} />
            </div>
            <div className="grid gap-2 text-xs sm:grid-cols-2">
              <p className="border-good/40 bg-good/10 rounded-lg border px-3 py-1.5">
                <span className="font-semibold">Helps when: </span>
                {p.helps}
              </p>
              <p className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <span className="font-semibold">Ceremony when: </span>
                {p.ceremony}
              </p>
            </div>
            <div className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs">
              <p>{p.scenario}</p>
              <div className="mt-1.5 flex gap-1">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    aria-pressed={ans === v}
                    onClick={() => set({ answers: { ...s.answers, [p.letter]: v } })}
                    className={cn(
                      "rounded-full border px-3 py-0.5",
                      ans === v
                        ? v === p.worth
                          ? "border-good bg-good/20"
                          : "border-bad bg-bad/15"
                        : "border-line-strong",
                    )}
                  >
                    {v ? "Worth applying" : "Not yet"}
                  </button>
                ))}
              </div>
              {ans !== undefined && (
                <p className={cn("mt-1 text-[11px]", ans === p.worth ? "text-good" : "text-muted")}>
                  {p.why}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      }
    >
      <p>
        For each letter, compare the before and after, then judge the scenario: is the principle
        worth applying here, or would it just add ceremony?
      </p>
      <p>
        One of the five scenarios is a &ldquo;not yet&rdquo;. Principles help most when they solve a
        problem you actually have.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Origins -------------------------------------------------------------------------------------- */

export function Origins() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where the five came from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "1987",
              "Barbara Liskov's keynote on subtypes; formalised with Jeannette Wing in 1994.",
            ],
            ["1988", "Bertrand Meyer: modules open for extension, closed for modification."],
            [
              "1995–2002",
              "Robert C. Martin gathered the principles in articles and books; single responsibility appeared in Martin's 2002 book.",
            ],
            ["~2004", "Michael Feathers is credited with arranging them into the acronym SOLID."],
            [
              "2017",
              "Martin restated single responsibility: responsible to one, and only one, actor (a group of people who want changes).",
            ],
          ].map(([y, b], i) => (
            <motion.div
              key={y}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent w-16 shrink-0 font-mono">{y}</span>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        SOLID collects ideas from different people and decades. Note the 2017 restatement: single
        responsibility is about <em>who</em> asks for changes, not &ldquo;a class does one
        thing&rdquo;, which is a different, function-level rule.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Critics -------------------------------------------------------------------------------------- */

export function Critics() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The critics, and an alternative"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">The complaints</p>
            <p className="text-muted">
              Vague wording that people read differently; designed around class hierarchies; applied
              rigidly, it multiplies interfaces and tiny classes.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">CUPID (Dan North, 2022): properties, not rules</p>
            <div className="mt-1 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
              {[
                ["Composable", "plays well with others"],
                ["Unix philosophy", "does one thing well"],
                ["Predictable", "does what you expect"],
                ["Idiomatic", "feels natural in its language"],
                ["Domain-based", "uses the problem's words and shape"],
              ].map(([t, b]) => (
                <p key={t}>
                  <span className="font-medium">{t}</span> <span className="text-muted">· {b}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Dan North began with a cheeky talk, &ldquo;Why Every Single Element of SOLID Is
        Wrong&rdquo;, and later proposed CUPID: qualities to aim for rather than rules to obey. John
        Ousterhout has also argued that over-applied principles produce too many shallow pieces.
      </p>
      <p>
        The useful takeaway from both sides: know the problem each principle solves, and apply it
        when you have that problem.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SolidCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which principle?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-solid"
            prompt="Which principle does each problem break?"
            categories={[
              { id: "s", label: "S" },
              { id: "l", label: "L" },
              { id: "i", label: "I" },
              { id: "d", label: "D" },
            ]}
            items={[
              {
                id: "throw",
                label: "A subclass throws where its parent returns a value",
                category: "l",
                why: "Callers can't safely substitute it.",
              },
              {
                id: "two",
                label: "Finance's and marketing's rules live in one class and keep colliding",
                category: "s",
                why: "Two actors, one module.",
              },
              {
                id: "fake",
                label: "Classes implement methods they can't support, just to throw",
                category: "i",
                why: "The interface is too big.",
              },
              {
                id: "new",
                label: "Business logic creates its own database connection inside",
                category: "d",
                why: "Depends on a concrete detail; hard to test.",
              },
            ]}
            explanation="S: one actor per module. L: subtypes keep their parent's promises. I: small interfaces. D: depend on abstractions you can swap."
          />
        </div>
      }
    >
      <p>Sort each problem.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["S: one actor per module", "Different people's rules, different places."],
        ["O: extend without editing", "When variants arrive often."],
        ["L: keep the parent's promises", "Always worth it."],
        ["I and D: small interfaces, swappable details", "Easier tests and changes."],
        ["Judgement over rules", "Apply a principle to a problem you have."],
      ]}
    >
      <p>Next: composition, and why many designs avoid deep inheritance.</p>
    </WrapStep>
  );
}
