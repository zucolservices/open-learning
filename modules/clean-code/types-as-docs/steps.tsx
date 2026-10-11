"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { BOOLEAN_TYPE, UNION_STATES, UNION_TYPE, meaning, type Flags } from "./model";
import type { TypesState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Form() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A form that can't be filled in wrong"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Three tick boxes</p>
            <p className="text-muted">
              ☐ Paid ☐ Delivered ☐ Cancelled. Someone ticks Delivered and Cancelled. What happened?
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">One choice</p>
            <p className="text-muted">
              ◯ Placed ◯ Paid ◯ Delivered ◯ Cancelled ◯ Refunded. Only real situations can be
              chosen.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A paper form with independent tick boxes lets people record nonsense. A form with one choice
        from a fixed list can&apos;t be filled in wrong.
      </p>
      <p>
        Types work the same way. Well-designed types describe exactly which situations are possible,
        so the compiler rejects code that would create an impossible one. The types become{" "}
        <Term id="types-as-documentation">documentation that checks itself</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Redesign ⭐ ----------------------------------------------------------------------------------- */

export function Redesign() {
  const [s, set] = useSceneState<TypesState>();
  const m = meaning(s.flags);
  const flip = (k: keyof Flags) => {
    const flags = { ...s.flags, [k]: !s.flags[k] };
    const key = `${+flags.paid}${+flags.delivered}${+flags.cancelled}`;
    set({ flags, seen: s.seen.includes(key) ? s.seen : [...s.seen, key] });
  };
  const invalidSeen = s.seen.filter(
    (k) => !meaning({ paid: k[0] === "1", delivered: k[1] === "1", cancelled: k[2] === "1" }).valid,
  ).length;
  return (
    <StepLayout
      eyebrow="Build"
      title="Make impossible orders impossible to write"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {[false, true].map((u) => (
              <button
                key={String(u)}
                type="button"
                aria-pressed={s.union === u}
                onClick={() => set({ union: u })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.union === u
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {u ? "One status (union type)" : "Three booleans"}
              </button>
            ))}
          </div>
          <Code
            key={String(s.union)}
            lines={s.union ? UNION_TYPE : BOOLEAN_TYPE}
            title="order.ts"
          />
          {!s.union ? (
            <>
              <div className="flex flex-wrap gap-2">
                {(["paid", "delivered", "cancelled"] as const).map((k) => (
                  <label
                    key={k}
                    className="border-line bg-surface flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={s.flags[k]}
                      onChange={() => flip(k)}
                      className="accent-accent"
                    />
                    {k}
                  </label>
                ))}
              </div>
              <motion.div
                key={m.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs",
                  m.valid ? "border-good/40 bg-good/10" : "border-bad/50 bg-bad/10",
                )}
              >
                {m.valid ? (
                  <Check className="text-good size-3.5" />
                ) : (
                  <X className="text-bad size-3.5" />
                )}
                {m.label}
                {!m.valid && (
                  <span className="text-muted">
                    The type allows it, so some code, somewhere, will create it.
                  </span>
                )}
              </motion.div>
              <p className="text-muted text-[11px]">
                8 combinations can be written; 5 are real. Impossible ones found: {invalidSeen} of
                3.
              </p>
            </>
          ) : (
            <div className="grid gap-1.5">
              <div className="flex flex-wrap gap-1">
                {UNION_STATES.map((st) => (
                  <span
                    key={st}
                    className="border-good/40 bg-good/10 rounded-full border px-2.5 py-0.5 font-mono text-[10px]"
                  >
                    {st}
                  </span>
                ))}
              </div>
              <p className="text-muted text-[11px]">
                5 shapes can be written, and all 5 are real. A refund without a refund amount, or a
                delivery without a payment date, won&apos;t compile.
              </p>
              <Code
                numbers={false}
                lines={[
                  "switch (order.status) {",
                  '  case "refunded": return refundNote(order.refundAmount); // known to exist here',
                  "  // forget a case, and the compiler can warn you",
                  "}",
                ]}
              />
            </div>
          )}
        </div>
      }
    >
      <p>
        With three true/false fields, an order can be in eight states, but only five make sense.
        Tick the boxes and find the three impossible ones. Every one is a bug waiting for some code
        path to create it.
      </p>
      <p>
        Then switch to a <Term id="union-type">union</Term>: one <code>status</code> field, with
        exactly the data each state needs. Impossible orders can&apos;t be written at all.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two slogans ---------------------------------------------------------------------------------- */

export function Slogans() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two slogans worth remembering"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">“Make illegal states unrepresentable.”</p>
            <p className="text-muted">Yaron Minsky, Jane Street (lecture 2010, blog 2011)</p>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">“Parse, don&apos;t validate.”</p>
            <p className="text-muted">
              Alexis King (2019): turn raw input into a precise type once, at the edge, instead of
              re-checking it everywhere.
            </p>
          </div>
          <Code
            numbers={false}
            title="Parse once at the edge…"
            lines={[
              "function parseQuantity(raw: string): Quantity {",
              "  const n = Number(raw);",
              '  if (!Number.isInteger(n) || n < 1) throw new InvalidInput("quantity");',
              "  return n as Quantity; // from here on, it's known good",
              "}",
            ]}
          />
        </div>
      }
    >
      <p>
        Both slogans move checking from people&apos;s memories into the type system. Validation
        returns true or false and forgets the result; parsing returns a new, more precise type that
        carries the guarantee to every function that receives it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Language support ----------------------------------------------------------------------------- */

export function Support() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Your language probably supports this"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["TypeScript", "Discriminated unions with a status field; exhaustive switch checks."],
            ["Kotlin", "Sealed classes and when expressions."],
            ["Java", "Sealed classes (Java 17) and pattern matching for switch (Java 21)."],
            ["Rust and Swift", "Enums that carry data, with exhaustive match."],
            [
              "Python",
              "Dataclasses with Literal or Enum status fields, checked by mypy or pyright.",
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
        These features used to be the speciality of functional languages. Today most mainstream
        languages have them, so the technique costs little more than thinking carefully about your
        states.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function TypesCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Can the type prevent it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-types"
            prompt="Which bugs can a better type design rule out entirely?"
            categories={[
              { id: "type", label: "A type can prevent it" },
              { id: "test", label: "Needs tests or checks" },
            ]}
            items={[
              {
                id: "both",
                label: "An order marked both delivered and cancelled",
                category: "type",
                why: "One status field allows only one.",
              },
              {
                id: "refund",
                label: "A refund with no refund amount",
                category: "type",
                why: "The refunded state requires the amount.",
              },
              {
                id: "rate",
                label: "Applying the wrong GST rate",
                category: "test",
                why: "A valid number either way: needs tests.",
              },
              {
                id: "qty",
                label: "A zero quantity reaching the kitchen",
                category: "type",
                why: "Parse into a Quantity type at the edge.",
              },
              {
                id: "slow",
                label: "The menu page loading slowly",
                category: "test",
                why: "Performance isn't a type question.",
              },
            ]}
            explanation="Types rule out impossible shapes of data. Wrong values that are still valid shapes, and performance, need tests."
          />
        </div>
      }
    >
      <p>Sort each bug.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Count your states", "Booleans multiply; reality usually doesn't."],
        ["One status, the right data", "Unions or sealed types."],
        ["Illegal states unrepresentable", "The compiler refuses them."],
        ["Parse, don't validate", "Precise types from the edge inwards."],
        ["Types plus tests", "Shapes by types, values by tests."],
      ]}
    >
      <p>
        That&apos;s the chapter on errors and edges. Next: changing code safely, starting with
        smells.
      </p>
    </WrapStep>
  );
}
