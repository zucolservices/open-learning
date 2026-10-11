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
import { STAGES } from "./model";
import type { DupState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Uniform() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One uniform for everyone"
      stage={
        <div className="flex flex-1 items-center justify-center gap-3">
          {["chef", "waiter", "cashier", "delivery"].map((r, i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex w-16 flex-col items-center rounded-lg border px-2 py-2 text-[10px]"
            >
              <span className="bg-viz-idle/50 mb-1 size-6 rounded-full" />
              {r}
              <span className="text-muted mt-1 text-[9px]">
                {["+ apron", "+ pockets", "+ name tag", "+ rain jacket"][i]}
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A café orders one uniform for all staff to keep things simple. Then the chef needs an apron,
        the waiter pockets, the rider a rain jacket. Soon the &ldquo;one&rdquo; uniform has zips and
        flaps that fit nobody, and changing it for one role annoys the rest.
      </p>
      <p>
        Code has the same trap. Removing <Term id="duplication">duplication</Term> is usually good,
        but merging code that only <em>looks</em> alike creates a shared piece that every caller
        keeps bending to its own needs.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------- */

export function Life() {
  const [s, set] = useSceneState<DupState>();
  const st = STAGES[s.stage];
  return (
    <StepLayout
      eyebrow="Step through"
      title="The life of a shared function"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted text-xs">
              Step {s.stage + 1} of {STAGES.length}
            </span>
            <span className="ml-auto flex gap-1">
              <button
                type="button"
                aria-label="Previous step"
                disabled={s.stage === 0}
                onClick={() => set({ stage: s.stage - 1 })}
                className="border-line-strong rounded-full border p-1 disabled:opacity-30"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                disabled={s.stage === STAGES.length - 1}
                onClick={() => set({ stage: s.stage + 1 })}
                className="bg-accent text-accent-fg flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium disabled:opacity-30"
              >
                Next step <ArrowRight className="size-3" />
              </button>
            </span>
          </div>
          <motion.div
            key={s.stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-2"
          >
            <p className="text-sm font-semibold">{st.title}</p>
            <p className="text-muted text-xs">{st.note}</p>
            <Code lines={st.code} title="receipts.js" />
          </motion.div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                st.flags >= 2 ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Flag arguments</p>
              <p className="font-mono text-base">{st.flags}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Blast radius of a change</p>
              <p className="text-[11px]">{st.blast}</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Step through a year in the life of a receipt function. Watch the flags pile up as each kind
        of order asks for something slightly different.
      </p>
      <p>
        The last step is the fix Sandi Metz recommends: put the code back into each caller, then
        look again for what is <em>truly</em> shared. Going backwards feels wrong, but it&apos;s
        usually the fastest way out.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Knowledge, not text --------------------------------------------------------------------------- */

const FILES = ["menu.js", "checkout.js", "invoice.js", "report.js"];

export function Knowledge() {
  const [s, set] = useSceneState<DupState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="DRY is about knowledge, not text"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {FILES.map((f, i) => (
              <div
                key={f}
                className={cn(
                  "rounded-lg border px-2 py-1.5 font-mono text-[10px]",
                  s.gstFixed
                    ? "border-good/40 bg-good/10"
                    : i === 3
                      ? "border-bad/50 bg-bad/10"
                      : "border-line bg-surface",
                )}
              >
                <p className="text-muted">{f}</p>
                <p>
                  {s.gstFixed
                    ? "total * (1 + GST)"
                    : i === 3
                      ? "total * 1.12 // old rate!"
                      : "total * 1.05"}
                </p>
              </div>
            ))}
          </div>
          {!s.gstFixed ? (
            <button
              type="button"
              onClick={() => set({ gstFixed: true })}
              className="bg-accent text-accent-fg w-fit rounded-full px-3 py-1 text-xs font-medium"
            >
              Put the GST rate in one place
            </button>
          ) : (
            <Code
              lines={[
                "// tax.js",
                "export const GST = 0.05; // restaurant rate, no input tax credit",
              ]}
              numbers={false}
            />
          )}
        </div>
      }
    >
      <p>
        <em>The Pragmatic Programmer</em> (1999) defined DRY as: &ldquo;Every piece of knowledge
        must have a single, unambiguous, authoritative representation within a system.&rdquo; The
        GST rate is one piece of knowledge written in four places, and one copy is already wrong.
        That&apos;s real duplication.
      </p>
      <p>
        The receipt functions were different: similar text, but different rules that change for
        different reasons. Merging them didn&apos;t remove duplicated knowledge; it tied unrelated
        rules together.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When to merge ------------------------------------------------------------------------------- */

export function WhenMerge() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When to merge"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Rule of three",
              "Do it once. The second time, wince but copy. The third time, refactor. (Don Roberts, via Fowler's Refactoring, 1999)",
            ],
            [
              "The wrong abstraction",
              "“Duplication is far cheaper than the wrong abstraction.” (Sandi Metz, 2014)",
            ],
            [
              "AHA",
              "Avoid Hasty Abstractions: wait until the shared shape is obvious. (Kent C. Dodds, 2020)",
            ],
            [
              "Ask: same reason to change?",
              "If two pieces would always change together, merge. If they'd change for different people's reasons, keep them apart.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 3 ? "border-accent bg-accent-soft" : "border-line bg-surface",
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
        These rules of thumb all say the same thing: an abstraction is a guess about what will stay
        the same. Wait until you have enough examples to guess well.
      </p>
      <p>
        When a shared function starts growing flags for each caller, take that as the signal that
        the guess was wrong.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DupCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Merge or leave?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-duplication"
            prompt="Should each pair of look-alikes be merged?"
            categories={[
              { id: "merge", label: "Merge" },
              { id: "leave", label: "Leave apart" },
            ]}
            items={[
              {
                id: "gst",
                label: "The GST rate typed into five files",
                category: "merge",
                why: "One fact, one place.",
              },
              {
                id: "validate",
                label: "Email validation copied in sign-up and checkout, same rule",
                category: "merge",
                why: "Same knowledge, same reason to change.",
              },
              {
                id: "receipts",
                label: "Dine-in and delivery receipts that look similar today",
                category: "leave",
                why: "Different rules that will drift.",
              },
              {
                id: "two",
                label: "Two similar loops, written for the first and second time",
                category: "leave",
                why: "Rule of three: wait for a third.",
              },
              {
                id: "flags",
                label: "A shared helper that already takes three flags",
                category: "leave",
                why: "Inline it and find the real shared pieces.",
              },
            ]}
            explanation="Remove duplicated knowledge. Leave similar-looking code apart when it changes for different reasons, at least until the pattern is clear."
          />
        </div>
      }
    >
      <p>Sort each pair.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["DRY means one home per fact", "Rates, rules, formats."],
        ["Look-alike is not the same", "Different reasons to change, keep apart."],
        ["Rule of three", "Wait for a third example."],
        ["Flags signal a wrong abstraction", "Inline, then re-extract."],
        ["Duplication is cheaper than the wrong abstraction", "Undo bad merges early."],
      ]}
    >
      <p>Next: complexity, and how much a reader can hold in their head.</p>
    </WrapStep>
  );
}
