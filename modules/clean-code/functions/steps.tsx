"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { BLOCKS, render } from "./model";
import type { FunctionsState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Recipe() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A recipe with headings"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-[11px] leading-snug"
          >
            Heat oil add cumin wait till it splutters add onions stir till golden add ginger garlic
            add tomatoes salt chilli turmeric cook till oil separates add dal simmer ten minutes
            squeeze lemon garnish…
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Dal tadka</p>
            <ol className="text-muted mt-1 list-decimal pl-4">
              <li>Make the tempering</li>
              <li>Cook the masala</li>
              <li>Add the dal and simmer</li>
              <li>Finish and garnish</li>
            </ol>
          </motion.div>
        </div>
      }
    >
      <p>
        Both recipes contain the same steps. Only one lets you see the shape of the dish at a
        glance, and jump straight to &ldquo;cook the masala&rdquo; when that&apos;s the part going
        wrong.
      </p>
      <p>
        Functions work like recipe headings. A long function that does everything forces the reader
        through every detail. Split into well-named pieces, the top-level function reads like a list
        of steps, and each step can be read, tested and changed on its own.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Extract ⭐ ------------------------------------------------------------------------------------ */

const TINT = ["bg-viz-data/15", "bg-viz-compute/15", "bg-viz-meta/15", "bg-accent/15"];

export function Extract() {
  const [s, set] = useSceneState<FunctionsState>();
  const lines = render(s.extracted);
  const top = lines.slice(0, lines.indexOf("}") + 1).length;
  const done = BLOCKS.every((b) => s.extracted[b.id] !== undefined);
  const allGood = done && BLOCKS.every((b) => b.names[s.extracted[b.id]].good);
  const choose = (id: string, i: number | undefined) => {
    const next = { ...s.extracted };
    if (i === undefined) delete next[id];
    else next[id] = i;
    set({ extracted: next });
  };
  return (
    <StepLayout
      eyebrow="Build"
      title="Split a long function into named steps"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {BLOCKS.map((b, k) => {
              const n = s.extracted[b.id];
              return (
                <div
                  key={b.id}
                  className={cn("border-line rounded-lg border px-3 py-1.5 text-xs", TINT[k])}
                >
                  <p className="text-muted mb-1 font-mono text-[10px]">
                    {b.lines[0].trim().slice(0, 38)}…
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {b.names.map((o, i) => (
                      <button
                        key={o.name}
                        type="button"
                        aria-pressed={n === i}
                        onClick={() => choose(b.id, n === i ? undefined : i)}
                        className={cn(
                          "rounded border px-1.5 py-0.5 font-mono text-[10px]",
                          n === i
                            ? o.good
                              ? "border-good bg-good/20"
                              : "border-bad bg-bad/15"
                            : "border-line bg-surface",
                        )}
                      >
                        {o.name}
                      </button>
                    ))}
                  </div>
                  {n !== undefined && (
                    <p className="text-muted mt-0.5 text-[10px]">{b.names[n].note}</p>
                  )}
                </div>
              );
            })}
          </div>
          <Code
            lines={lines}
            title={`order.js · placeOrder is ${top} lines`}
            className="max-h-72 overflow-y-auto"
          />
          {done && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("text-xs", allGood ? "text-good" : "text-muted")}
            >
              {allGood
                ? "placeOrder now reads as four steps. A request to “send an SMS instead of an email” points straight at one small function."
                : "The shape is better, but some names hide what the step does. Try the clearer ones."}
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        <code>placeOrder</code> validates, prices, saves and emails, all in one block. Extract each
        coloured part into its own function by giving it a name, and watch the top level shrink.
      </p>
      <p>
        Extraction only helps if the names are good. A function called <code>step1</code> moves code
        without explaining it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Arguments and flags -------------------------------------------------------------------------- */

export function Flags() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Arguments, flags and levels"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Code
            lines={["placeOrder(order, true, false, 3);", "// what do true, false and 3 mean?"]}
            title="Hard to read at the call site"
            numbers={false}
          />
          <Code
            lines={[
              "placeOrder(order, { express: true, giftWrap: false, priority: 3 });",
              "placeExpressOrder(order);",
            ]}
            title="Easier: name the options, or split a flag into two functions"
            numbers={false}
          />
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">One level of detail per function</p>
            <p className="text-muted">
              placeOrder talks about orders and receipts; it shouldn&apos;t also format strings and
              loop over bytes. Keep high-level steps and low-level details apart.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A boolean argument usually means a function does two things. Martin Fowler calls these flag
        arguments: <code>placeOrder(order, true)</code> says nothing at the call site. Two named
        functions, or a named option, say what you mean.
      </p>
      <p>
        Kent Beck&apos;s &ldquo;composed method&rdquo; pattern adds the other half: a
        function&apos;s steps should all sit at the same{" "}
        <Term id="abstraction">level of abstraction</Term>, so the reader isn&apos;t jumping between
        big ideas and tiny details.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How small ------------------------------------------------------------------------------------ */

export function HowSmall() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How small is small?"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Very small</p>
            <p className="text-muted text-[10px]">Robert C. Martin, Clean Code (2008)</p>
            <p className="mt-1">
              “Functions should hardly ever be 20 lines long”; two to four lines is ideal. If you
              can meaningfully extract a function, the original did more than one thing.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Deep, not tiny</p>
            <p className="text-muted text-[10px]">
              John Ousterhout, A Philosophy of Software Design (2018)
            </p>
            <p className="mt-1">
              The best modules hide a lot behind a simple interface. Splitting too finely creates
              pieces you have to read together anyway.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs sm:col-span-2">
            <p className="font-semibold">Where they agree</p>
            <p className="text-muted">
              In their 2024–25 written debate, both said modular design is good and that it&apos;s
              possible to over-decompose. They disagree on where the line sits.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Line counts are a proxy. The real questions are: can a reader understand this function
        without opening five others? Does its name tell the whole story? Would splitting it make
        either answer better?
      </p>
      <p>
        Both ideas trace back to Kent Beck&apos;s &ldquo;composed method&rdquo; (1997): methods that
        each do one identifiable task, at one level of abstraction.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function FunctionsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good sign or warning sign?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-functions"
            prompt="Is each a good sign or a warning sign in a function?"
            categories={[
              { id: "good", label: "Good sign" },
              { id: "warn", label: "Warning sign" },
            ]}
            items={[
              {
                id: "bool",
                label: "A true/false argument that switches between two behaviours",
                category: "warn",
                why: "Two functions hiding under one name.",
              },
              {
                id: "name",
                label: "Its name says everything it does",
                category: "good",
                why: "No surprises for the caller.",
              },
              {
                id: "and",
                label: "Its honest name would need “and” twice",
                category: "warn",
                why: "It's doing several jobs.",
              },
              {
                id: "level",
                label: "Every line is at the same level of detail",
                category: "good",
                why: "It reads like a list of steps.",
              },
              {
                id: "comments",
                label: "Comments mark off its sections: // validate, // save, // email",
                category: "warn",
                why: "Those sections want to be functions.",
              },
            ]}
            explanation="A good function does one job at one level of detail, and its name says what that job is. Section comments and flags are hints to split."
          />
        </div>
      }
    >
      <p>Sort each sign.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["One job per function", "If the honest name needs “and”, split."],
        ["Top level reads like steps", "Details live in named helpers."],
        ["Names make extraction useful", "step1 moves code without explaining it."],
        ["Avoid flag arguments", "Two functions, or named options."],
        ["Small is a means, not a goal", "Depth and clarity matter more than line counts."],
      ]}
    >
      <p>Next: comments, and when code should speak for itself.</p>
    </WrapStep>
  );
}
