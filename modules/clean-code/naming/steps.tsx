"use client";

import { motion } from "motion/react";
import { Check, CircleHelp } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { ORIGINAL, SLOTS, render } from "./model";
import type { NamingState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Labels() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Jars without labels"
      stage={
        <div className="flex flex-1 items-center justify-center gap-3">
          {[
            ["?", "white powder"],
            ["?", "white powder"],
            ["Salt", ""],
            ["Sugar", ""],
          ].map(([l, s], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "flex h-20 w-14 flex-col items-center justify-center rounded-t-md rounded-b-xl border text-xs",
                i < 2 ? "border-line bg-surface" : "border-accent bg-accent-soft",
              )}
            >
              <span className="font-semibold">{l}</span>
              <span className="text-muted text-[9px]">{s}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A kitchen full of identical jars without labels works fine for the cook who filled them.
        Anyone else has to taste each one, and one day somebody puts salt in the cake.
      </p>
      <p>
        Names are code&apos;s labels. A good name tells the next reader what something is and why it
        exists, so they don&apos;t have to taste it, that is, read all the code around it. It&apos;s
        the cheapest documentation there is, and it never goes out of date as long as it&apos;s kept
        honest.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rename ⭐ ------------------------------------------------------------------------------------- */

export function Rename() {
  const [s, set] = useSceneState<NamingState>();
  const pick = (id: string, i: number) => set({ choice: { ...s.choice, [id]: i } });
  const answered = SLOTS.filter(
    (sl) => sl.options[s.choice[sl.id] ?? ORIGINAL[sl.id]].kind === "good",
  ).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Rename until the questions disappear"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code lines={render(s.choice)} title="bookings.js" />
          <div className="grid gap-1.5">
            {SLOTS.map((sl) => {
              const cur = sl.options[s.choice[sl.id] ?? ORIGINAL[sl.id]];
              return (
                <div
                  key={sl.id}
                  className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
                >
                  <p className="flex items-center gap-1.5">
                    {cur.kind === "good" ? (
                      <Check className="text-good size-3.5" />
                    ) : (
                      <CircleHelp
                        className={cn(
                          "size-3.5",
                          cur.kind === "misleading" ? "text-bad" : "text-muted",
                        )}
                      />
                    )}
                    <span className={cur.kind === "good" ? "text-muted line-through" : ""}>
                      {sl.question}
                    </span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {sl.options.map((o, i) => (
                      <button
                        key={o.name}
                        type="button"
                        aria-pressed={cur.name === o.name}
                        onClick={() => pick(sl.id, i)}
                        className={cn(
                          "rounded border px-1.5 py-0.5 font-mono text-[10px]",
                          cur.name === o.name
                            ? o.kind === "good"
                              ? "border-good bg-good/15"
                              : o.kind === "misleading"
                                ? "border-bad bg-bad/15"
                                : "border-line-strong bg-surface-2"
                            : "border-line text-muted",
                        )}
                      >
                        {o.name}
                      </button>
                    ))}
                  </div>
                  {cur.name !== sl.options[ORIGINAL[sl.id]].name && (
                    <p className="text-muted mt-0.5 text-[10px]">{cur.note}</p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs">
            Questions answered by the code itself:{" "}
            <span className="font-mono">
              {answered} / {SLOTS.length}
            </span>
          </p>
        </div>
      }
    >
      <p>
        This function is short, but a new reader has seven questions before they can trust it. Each
        question comes from a name. Pick better names and watch the code rewrite itself.
      </p>
      <p>
        Notice the difference between a <strong>vague</strong> name (it tells you nothing) and a{" "}
        <strong>misleading</strong> one (it tells you something false). Misleading is worse: calling
        a party size &ldquo;age&rdquo; sends the reader confidently in the wrong direction.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Guidelines ----------------------------------------------------------------------------------- */

export function Guidelines() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Habits of good names"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Say what it means", "elapsedDays, not d. isRefundable, not check."],
            [
              "Length matches scope",
              "i is fine in a three-line loop; a module-wide value needs a full name.",
            ],
            [
              "One word per idea",
              "Pick fetch, get or load for the same kind of operation, and stick to it.",
            ],
            ["Name the magic numbers", "status === CONFIRMED, not status === 2."],
            ["Booleans read as questions", "isOpen, hasStock, canRefund."],
            ["Functions are verbs, things are nouns", "sendReceipt(order), not receipt(order)."],
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
        These habits, including naming every <Term id="magic-number">magic number</Term>, show up in
        almost every style guide, from Go&apos;s preference for short names in small scopes to
        Java&apos;s longer descriptive ones. The principle underneath is the same: a name should
        save the reader from reading the code it labels.
      </p>
      <p>
        Renaming is also the safest change you can make: modern editors rename every use at once.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Evidence ------------------------------------------------------------------------------------- */

export function Evidence() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the research says"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Words beat letters and abbreviations</p>
            <p className="text-muted">
              72 professional developers found defects about 19% faster when identifiers were full
              words rather than single letters or abbreviations (Hofmeister, Siegmund and Holt,
              2017).
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Single letters are the worst</p>
            <p className="text-muted">
              In a 2006 study of over 100 programmers, full words gave the best understanding;
              common abbreviations were often close behind, and single letters came last (Lawrie and
              colleagues).
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">
              “There are only two hard things in Computer Science: cache invalidation and naming
              things.”
            </p>
            <p className="text-muted">
              Usually credited to Netscape engineer Phil Karlton, as recalled by Tim Bray.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Naming is one of the few readability habits with direct experimental support. The effect
        isn&apos;t magic, but it&apos;s consistent: names a reader can understand without decoding
        save time on every read.
      </p>
      <p>
        Naming is hard because a good name needs you to understand what the thing really is. Often
        struggling to name something is a sign the code itself is doing too much.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function NamingCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the name"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="clean-naming"
            prompt="A function returns true if an order can still be refunded (paid, and less than 7 days old). Which name is best?"
            options={[
              {
                id: "check",
                label: "check(order)",
                feedback: "Check what? The reader has to open it.",
              },
              {
                id: "refund",
                label: "refund(order)",
                feedback: "Misleading: sounds like it performs the refund.",
              },
              {
                id: "is",
                label: "isRefundable(order)",
                correct: true,
                feedback: "Reads as a yes-or-no question about the order.",
              },
              { id: "flag", label: "orderFlag(order)", feedback: "Vague: which flag?" },
            ]}
            explanation="Name a yes-or-no function as a question (is…, has…, can…), and never name it like an action it doesn't perform."
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
        ["Names are labels", "They save the reader from reading."],
        ["Misleading beats vague, in a bad way", "A wrong name is worse than a blank one."],
        ["Name the magic numbers", "Constants explain rules."],
        ["Length matches scope", "Short for tiny scopes, full words for wide ones."],
        ["Rename freely", "It's the safest refactoring there is."],
      ]}
    >
      <p>Next: functions that do one thing, and say so.</p>
    </WrapStep>
  );
}
