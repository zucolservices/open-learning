"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code, type Mark } from "../_shared/code";
import { CODE, REFACTORINGS, SMELLS } from "./model";
import type { SmellState } from "./state";

const SMELL_LINES: Record<number, number> = {
  0: 0,
  2: 2,
  3: 2,
  9: 9,
  13: 13,
  14: 13,
  18: 18,
  21: 18,
};

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Fridge() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A smell in the fridge"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The smell</p>
            <p className="text-muted">
              Something&apos;s off when you open the café fridge. You don&apos;t know what yet.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The cause</p>
            <p className="text-muted">
              Sometimes old milk. Sometimes just strong cheese that&apos;s perfectly fine. The smell
              tells you where to look.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A smell in the fridge isn&apos;t a diagnosis; it&apos;s a reason to look. Usually
        there&apos;s a problem, occasionally it&apos;s nothing.
      </p>
      <p>
        A <Term id="code-smell">code smell</Term> is the same: a surface sign, like a very long
        parameter list or the same switch in two places, that often points to a deeper design
        problem. Each common smell has a known <Term id="refactoring">refactoring</Term> that
        removes it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Spot and match ⭐ ----------------------------------------------------------------------------- */

export function Spot() {
  const [s, set] = useSceneState<SmellState>();
  const click = (i: number) => {
    const at = SMELL_LINES[i];
    if (at === undefined) return set({ misses: s.misses + 1 });
    if (!s.found.includes(at)) set({ found: [...s.found, at] });
  };
  const marks: Record<number, Mark> = {};
  s.found.forEach((f) => (marks[f] = "hot"));
  const total = Object.keys(SMELLS).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Sniff out the smells, then pick the cure"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code
            lines={CODE}
            marks={marks}
            onLine={click}
            title={`orders.js · click lines that smell (${s.found.length} of ${total} found)`}
            className="max-h-72 overflow-y-auto"
          />
          <div className="grid gap-1.5">
            {s.found
              .slice()
              .sort((a, b) => a - b)
              .map((f) => {
                const sm = SMELLS[f];
                const pick = s.fixes[f];
                const ok = (r: string | undefined) =>
                  r === sm.fix || (f === 2 && r === "Rename Function");
                return (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
                  >
                    <p>
                      <span className="text-muted">line {f + 1}:</span>{" "}
                      <span className="font-semibold">{sm.smell}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {REFACTORINGS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          aria-pressed={pick === r}
                          onClick={() => set({ fixes: { ...s.fixes, [f]: r } })}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px]",
                            pick === r
                              ? ok(r)
                                ? "border-good bg-good/20"
                                : "border-bad bg-bad/15"
                              : "border-line text-muted",
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    {pick && (
                      <p
                        className={cn("mt-0.5 text-[10px]", ok(pick) ? "text-good" : "text-muted")}
                      >
                        {ok(pick)
                          ? sm.why
                          : "That refactoring addresses a different smell. Try another."}
                      </p>
                    )}
                  </motion.div>
                );
              })}
          </div>
          {s.misses > 0 && s.found.length < total && (
            <p className="text-muted text-[11px]">
              Not every line smells. Look for odd names, long argument lists, parsing in strange
              places, and repetition.
            </p>
          )}
        </div>
      }
    >
      <p>
        This order module works, but it has five smells. Click a line that looks suspicious. For
        each smell you find, choose the refactoring from Martin Fowler&apos;s catalogue that removes
        it.
      </p>
      <p>
        The names are worth learning: they give a team a shared vocabulary. &ldquo;This has feature
        envy, let&apos;s move it&rdquo; says a lot in a few words.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The catalogue -------------------------------------------------------------------------------- */

export function Catalogue() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The catalogue of smells"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex flex-wrap gap-1">
            {[
              "Mysterious Name",
              "Duplicated Code",
              "Long Function",
              "Long Parameter List",
              "Global Data",
              "Mutable Data",
              "Divergent Change",
              "Shotgun Surgery",
              "Feature Envy",
              "Data Clumps",
              "Primitive Obsession",
              "Repeated Switches",
              "Loops",
              "Lazy Element",
              "Speculative Generality",
              "Temporary Field",
              "Message Chains",
              "Middle Man",
              "Insider Trading",
              "Large Class",
              "Alternative Classes with Different Interfaces",
              "Data Class",
              "Refused Bequest",
              "Comments",
            ].map((n, i) => (
              <motion.span
                key={n}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.015 * i }}
                className="border-line bg-surface rounded-full border px-2 py-0.5 text-[10px]"
              >
                {n}
              </motion.span>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            The 24 smells in Refactoring, 2nd edition (2018).
          </p>
        </div>
      }
    >
      <p>
        Kent Beck coined &ldquo;code smell&rdquo; while helping Martin Fowler write{" "}
        <em>Refactoring</em> (1999). Fowler defines it as &ldquo;a surface indication that usually
        corresponds to a deeper problem in the system.&rdquo;
      </p>
      <p>
        The second edition (2018) updated the list: &ldquo;Switch Statements&rdquo; became
        &ldquo;Repeated Switches&rdquo;, because a single switch is fine; the problem is the same
        one copied around. Even &ldquo;Comments&rdquo; is on the list, as a hint that code might be
        explaining itself badly.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Prioritise ----------------------------------------------------------------------------------- */

export function Prioritise() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Which smells to fix first"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Where you're working",
              "Clean up the code you're about to change; leave stable, untouched code alone.",
            ],
            [
              "Where change is frequent",
              "Files changed often and hard to understand are the best investment.",
            ],
            [
              "Where bugs cluster",
              "Smelly code that keeps producing bugs repays attention fastest.",
            ],
            ["Not everywhere at once", "A smell in code nobody touches costs nothing today."],
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
        Every codebase smells somewhere. Treat smells as a list of options, and spend effort where
        it pays: code that is both hard to understand and frequently changed.
      </p>
      <p>
        Version history can show which files change most; combine that with complexity to find hot
        spots.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SmellCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name the smell"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-smells"
            prompt="Which smell is each description?"
            categories={[
              { id: "shotgun", label: "Shotgun Surgery" },
              { id: "envy", label: "Feature Envy" },
              { id: "clumps", label: "Data Clumps" },
              { id: "primitive", label: "Primitive Obsession" },
            ]}
            items={[
              {
                id: "gst",
                label: "Changing the GST rule means editing seven files",
                category: "shotgun",
                why: "One change, scattered edits.",
              },
              {
                id: "uses",
                label: "A method in Order uses five fields of Customer and none of its own",
                category: "envy",
                why: "It wants to live on Customer.",
              },
              {
                id: "addr",
                label: "street, city and pin are passed together everywhere",
                category: "clumps",
                why: "They want to be an Address.",
              },
              {
                id: "phone",
                label: "Phone numbers are plain strings, validated in many places",
                category: "primitive",
                why: "A PhoneNumber type would validate once.",
              },
            ]}
            explanation="Smell names are a shared vocabulary: each points at a likely problem and a known refactoring."
          />
        </div>
      }
    >
      <p>Sort each description.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Smells are hints", "A reason to look, not a verdict."],
        ["Each has a cure", "A matching refactoring from the catalogue."],
        ["Shared vocabulary", "Feature envy, data clumps, shotgun surgery."],
        ["Fix where it pays", "Code you're changing, code that changes often."],
        ["Leave quiet code alone", "Unchanged smells cost nothing today."],
      ]}
    >
      <p>Next: refactoring itself, in small, safe steps.</p>
    </WrapStep>
  );
}
