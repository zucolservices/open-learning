"use client";

import { motion } from "motion/react";
import { Check, Lock, Play, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LEGACY_CODE, PROBES, REFACTORS, TAGS, describe, legacy } from "./model";
import type { LegacyState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function OldHouse() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Rewiring an old house"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="grid grid-cols-4 gap-1.5 text-[10px]">
            {["kitchen", "hall", "bed 1", "bed 2", "bath", "porch", "attic", "garage"].map(
              (r, i) => (
                <motion.div
                  key={r}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="border-line bg-surface flex size-16 flex-col items-center justify-center rounded border"
                >
                  <span>{r}</span>
                  <span className="text-muted">
                    {
                      [
                        "lights",
                        "porch lamp?",
                        "socket",
                        "lights",
                        "fan",
                        "doorbell",
                        "nothing?",
                        "kitchen?",
                      ][i]
                    }
                  </span>
                </motion.div>
              ),
            )}
          </div>
        </div>
      }
    >
      <p>
        An electrician rewiring an old house first labels what every switch actually does today,
        including the odd ones: the hall switch that also turns on the porch lamp. Only then do they
        change anything, checking the labels as they go.
      </p>
      <p>
        Michael Feathers put it simply: &ldquo;To me, legacy code is simply code without
        tests.&rdquo; Before changing it, write{" "}
        <Term id="characterisation-test">characterisation tests</Term> that record what it does now,
        quirks and all.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pin it down ⭐ -------------------------------------------------------------------------------- */

export function PinDown() {
  const [s, set] = useSceneState<LegacyState>();
  const covered = new Set(PROBES.filter((p) => s.locked.includes(p.id)).flatMap((p) => p.tags));
  const ref = REFACTORS.find((r) => r.id === s.refactor);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Record what it does, then refactor safely"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            <p className="text-muted mb-1 font-sans text-[10px]">
              invoice.js · no tests, written years ago
            </p>
            {LEGACY_CODE.map((l, i) => (
              <pre key={i} className="whitespace-pre">
                {l}
              </pre>
            ))}
          </div>
          <div className="grid gap-1">
            {PROBES.map((p) => {
              const ran = s.run.includes(p.id);
              const locked = s.locked.includes(p.id);
              const out = legacy(p.items, p.kind, p.coupon);
              const after = ref && locked ? ref.impl(p.items, p.kind, p.coupon) : null;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "flex flex-wrap items-center gap-2 rounded-lg border px-2.5 py-1 font-mono text-[10.5px]",
                    after !== null && after !== out
                      ? "border-bad/50 bg-bad/10"
                      : locked
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface",
                  )}
                >
                  <span className="flex-1">{describe(p)}</span>
                  {ran ? (
                    <span>→ {out}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => set({ run: [...s.run, p.id] })}
                      className="border-line-strong flex items-center gap-1 rounded-full border px-2 font-sans text-[10px]"
                    >
                      <Play className="size-2.5" /> Run
                    </button>
                  )}
                  {ran && !locked && (
                    <button
                      type="button"
                      onClick={() => set({ locked: [...s.locked, p.id] })}
                      className="border-line-strong flex items-center gap-1 rounded-full border px-2 font-sans text-[10px]"
                    >
                      <Lock className="size-2.5" /> Lock in
                    </button>
                  )}
                  {after !== null &&
                    (after === out ? (
                      <Check className="text-good size-3.5" />
                    ) : (
                      <span className="text-bad flex items-center gap-1 font-sans text-[10px]">
                        <X className="size-3" /> now {after}
                      </span>
                    ))}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1">
            {TAGS.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px]",
                  covered.has(t) ? "border-viz-data bg-viz-data/15" : "border-line text-muted",
                )}
              >
                {t}
              </span>
            ))}
          </div>
          {s.locked.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-1"
            >
              <p className="text-xs font-semibold">
                Now refactor. Which version keeps the locked-in behaviour?
              </p>
              <div className="grid gap-1 sm:grid-cols-2">
                {REFACTORS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={s.refactor === r.id}
                    onClick={() => set({ refactor: r.id })}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-left text-xs",
                      s.refactor === r.id
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface",
                    )}
                  >
                    <p className="font-medium">{r.label}</p>
                    <p className="text-muted text-[10px]">{r.blurb}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Run each probe against the old function, then lock in its current answer as a test, even if
        it looks wrong. An empty basket with a coupon costs <em>minus</em> ten rupees today. Record
        it anyway: you&apos;re capturing behaviour, not judging it.
      </p>
      <p>
        With three or more locked in, try both refactors. The tidy rewrite changes behaviour in
        places customers may rely on. The careful extraction keeps every answer. Behaviour changes
        should be deliberate decisions, made one at a time.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The recipe ------------------------------------------------------------------------------------ */

export function Recipe() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Feathers' recipe, and seams"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            <p className="text-muted mb-1 font-sans text-[10px]">
              Hard to test: reads the real clock
            </p>
            <pre className="whitespace-pre-wrap">{`function surcharge(total) {
  return new Date().getDay() === 0 ? total * 1.05 : total;
}`}</pre>
          </div>
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            <p className="text-muted mb-1 font-sans text-[10px]">
              With a seam: the test can pass in Sunday
            </p>
            <pre className="whitespace-pre-wrap">{`function surcharge(total, today = new Date()) {
  return today.getDay() === 0 ? total * 1.05 : total;
}`}</pre>
          </div>
        </div>
      }
    >
      <p>
        Feathers&apos; book <em>Working Effectively with Legacy Code</em> (2004) gives a recipe:
        find where you need to change; find where you can test; break the dependencies that get in
        the way; write the tests; then change and refactor.
      </p>
      <p>
        A <Term id="seam">seam</Term> is a place where you can change behaviour for a test without
        editing the code around it, such as a parameter for the clock. Adding one is often the
        smallest, safest first edit.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Golden masters -------------------------------------------------------------------------------- */

export function GoldenMaster() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Approval tests and golden masters"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Golden master",
              "Run the code over many inputs, save all the outputs, and compare future runs against that saved file.",
            ],
            [
              "Approval tests",
              "Libraries like ApprovalTests (by Llewellyn Falco) show you a diff of the new output; you approve it or fix the code.",
            ],
            [
              "The catch",
              "They lock in today's behaviour, bugs included. They tell you something changed, not whether it's right.",
            ],
            [
              "Practise",
              "The Gilded Rose kata, a deliberately messy shop inventory, exists in many languages for exactly this.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 2 ? "border-line-strong bg-surface-2" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        When code is too tangled to test piece by piece, test it whole: record its outputs for lots
        of inputs, and treat any difference as a question to answer.
      </p>
      <p>
        Once the safety net is in, you can refactor towards smaller pieces with ordinary unit tests,
        and retire the golden master.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function LegacyCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the recipe in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="testing-legacy"
            prompt="Drag the steps for changing untested code into order."
            items={[
              { id: "where", label: "Find the code you need to change" },
              { id: "test", label: "Find where you can observe its behaviour" },
              { id: "seam", label: "Break a dependency that gets in the way (add a seam)" },
              { id: "char", label: "Write characterisation tests for what it does now" },
              { id: "change", label: "Make the change, refactoring in small steps" },
            ]}
            explanation="Tests first, then change. The first edit is the smallest one that makes testing possible."
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
        ["Legacy means untested", "Not necessarily old."],
        ["Record, don't judge", "Characterisation tests capture today's behaviour."],
        ["Seams make testing possible", "A small, safe first edit."],
        ["Refactor in small steps", "Behaviour changes are separate decisions."],
        ["Golden masters lock in bugs", "They detect change, not correctness."],
      ]}
    >
      <p>
        That&apos;s the chapter on advanced techniques. Next: testing as part of the team&apos;s
        daily flow.
      </p>
    </WrapStep>
  );
}
