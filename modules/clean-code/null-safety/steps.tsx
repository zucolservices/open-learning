"use client";

import { motion } from "motion/react";
import { Check, Play, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { code, run } from "./model";
import type { NullState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function EmptyBox() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The box that might be empty"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">An unmarked box</p>
            <p className="text-muted">
              You reach in for the milk without looking. Sometimes there&apos;s nothing there, and
              the coffee is ruined.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A box labelled “may be empty”</p>
            <p className="text-muted">
              You check first, every time, because the label reminds you.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Many programs crash because code reaches for a value that isn&apos;t there: a customer
        without a nickname, an order without an address. In many languages any reference might
        secretly be <Term id="null">null</Term>.
      </p>
      <p>
        Modern languages label the box. If a value might be missing, its{" "}
        <Term id="optional-type">type says so</Term>, and the compiler insists you check before
        using it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Hunt the crash ⭐ ----------------------------------------------------------------------------- */

export function Hunt() {
  const [s, set] = useSceneState<NullState>();
  const results = run(s.stage);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Hunt a crash, then let the compiler catch it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["loose", "As written"],
                ["strict", "Strict null checks on"],
                ["fixed", "Handle the missing nickname"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={s.stage === id}
                onClick={() => set({ stage: id, ran: false })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.stage === id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <Code
            key={s.stage}
            lines={code(s.stage)}
            title="greeting.ts"
            marks={
              s.stage === "strict"
                ? { 3: "bad" }
                : s.stage === "fixed"
                  ? { 0: "good", 3: "good" }
                  : {}
            }
          />
          {s.stage === "strict" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 font-mono text-[10.5px]"
            >
              <p className="text-bad">
                greeting.ts:4:22 - error: &apos;c.nickname&apos; is possibly &apos;undefined&apos;.
              </p>
              <p className="text-muted mt-1 font-sans text-[11px]">
                The program won&apos;t even build. The crash is caught on your laptop, not by a
                customer.
              </p>
            </motion.div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => set({ ran: true })}
                className="bg-accent text-accent-fg flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              >
                <Play className="size-3" /> Greet every customer
              </button>
              {s.ran && (
                <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10.5px]">
                  {results.map((r) => (
                    <p key={r.name} className={cn("flex items-start gap-1.5", !r.ok && "text-bad")}>
                      {r.ok ? (
                        <Check className="text-good mt-0.5 size-3 shrink-0" />
                      ) : (
                        <X className="mt-0.5 size-3 shrink-0" />
                      )}
                      {r.name}: {r.out}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      }
    >
      <p>
        The type claims every customer has a nickname, but two don&apos;t. Run it as written and see
        the crash. Then make the type honest (<code>nickname?</code>) with strict checks on: the
        compiler now refuses the risky line.
      </p>
      <p>
        Finally handle the absence: fall back to the first name. Every customer is greeted, and the
        compiler is satisfied.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Billion-dollar mistake ----------------------------------------------------------------------- */

export function Mistake() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The billion-dollar mistake"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-xs">
            <span className="text-accent font-mono">1965</span>
            <span>
              Tony Hoare adds the null reference to the ALGOL W language, “simply because it was so
              easy to implement”.
            </span>
          </div>
          <div className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-xs">
            <span className="text-accent font-mono">2009</span>
            <span>
              In a talk at QCon London he calls it his “billion-dollar mistake”: a rough guess at
              decades of crashes and security holes.
            </span>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            The problem isn&apos;t that values can be missing. It&apos;s that the type system
            didn&apos;t say which ones could be.
          </div>
        </div>
      }
    >
      <p>
        Absence is real: not every customer has a nickname. Null made <em>every</em> reference
        possibly absent, with nothing in the code to tell you which, so programmers had to remember.
        People forget.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Across languages ------------------------------------------------------------------------------ */

const LANGS: Record<NullState["lang"], { label: string; code: string[]; note: string }> = {
  ts: {
    label: "TypeScript",
    code: ["let nickname: string | undefined;", "nickname?.toUpperCase() ?? first;"],
    note: "strictNullChecks (since 2016) is on by default when strict mode is, the default for new projects since TypeScript 6.",
  },
  kotlin: {
    label: "Kotlin",
    code: ["val nickname: String? = null", "nickname?.uppercase() ?: first"],
    note: "String can never be null; String? can, and the compiler makes you check.",
  },
  rust: {
    label: "Rust",
    code: ["let nickname: Option<String> = None;", "nickname.unwrap_or(first).to_uppercase()"],
    note: "No null at all. A missing value is an Option you must unwrap or match.",
  },
  java: {
    label: "Java",
    code: [
      "Optional<String> nickname = Optional.empty();",
      "nickname.orElse(first).toUpperCase();",
    ],
    note: "Optional (2014) for return values, plus annotations like JSpecify's @Nullable, adopted by Spring in 2025. Built-in null-safe types are still a proposal.",
  },
};

export function Languages() {
  const [s, set] = useSceneState<NullState>();
  const l = LANGS[s.lang];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Labelling the box, language by language"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.lang}
            onChange={(v) => set({ lang: v })}
            options={(Object.keys(LANGS) as NullState["lang"][]).map((k) => [k, LANGS[k].label])}
          />
          <motion.div
            key={s.lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-2"
          >
            <Code lines={l.code} numbers={false} />
            <p className="text-muted text-xs">{l.note}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Swift&apos;s optionals and C#&apos;s nullable reference types (2019) work the same way: the
        type says whether a value may be missing, and the compiler checks every use.
      </p>
      <p>
        Two habits help in any language: switch these checks on, and design data so fewer things are
        optional in the first place.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function NullCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The best fix"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="clean-null"
            prompt="Orders sometimes have no delivery address (collection orders), and the label printer crashes on them. What's the cleanest fix?"
            options={[
              {
                id: "type",
                label: "Make address optional in the type and handle collection orders explicitly",
                correct: true,
                feedback:
                  "The type now tells the truth, and the compiler checks every place that prints a label.",
              },
              {
                id: "empty",
                label: "Store an empty string as the address",
                feedback: "The crash goes away, but labels print blank and nothing warns you.",
              },
              {
                id: "try",
                label: "Wrap the printer call in try/catch and ignore errors",
                feedback: "Hides the problem; collection orders silently get no label.",
              },
              {
                id: "fake",
                label: "Fill in the café's own address",
                feedback: "A wrong value that looks right: the worst kind.",
              },
            ]}
            explanation="Make absence explicit in the type, then handle each case on purpose. Placeholder values and swallowed errors only hide it."
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
        ["Absence is real", "Not every customer has a nickname."],
        ["Say it in the type", "string | undefined, String?, Option<T>."],
        ["Let the compiler check", "Turn strict null checks on."],
        ["Handle it on purpose", "A fallback, or a clear error."],
        ["No fake values", "Empty strings and zeros hide the gap."],
      ]}
    >
      <p>Next: using types to make impossible situations impossible to write.</p>
    </WrapStep>
  );
}
