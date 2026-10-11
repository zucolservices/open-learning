"use client";

import { motion } from "motion/react";
import { Check, Play, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { IMPLS, PROPS, check, sortWith, type Impl, type PropId } from "./model";
import type { PbtState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Inspector() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Rules, not examples"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Check three loaves you picked</p>
            <p className="text-muted">
              They&apos;re fine. You picked them because they looked fine.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“Every loaf weighs at least 400 g”</p>
            <p className="text-muted">
              Weigh a hundred at random. One underweight loaf, and you know the rule is broken.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A bakery inspector who checks three loaves the baker hands over learns very little. One who
        states a rule (&ldquo;every loaf weighs at least 400 g&rdquo;) and weighs a hundred at
        random finds problems nobody thought to show them.
      </p>
      <p>
        <Term id="property-based-testing">Property-based testing</Term> works that way. You state a
        rule that should hold for <em>every</em> input, and a tool tries hundreds of random inputs
        to break it. When one fails, it shrinks it to the smallest example that still fails.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Sandbox ⭐ ------------------------------------------------------------------------------------ */

const SHOW = (steps: number[][]) => {
  if (steps.length <= 5) return steps;
  return [
    steps[0],
    steps[1],
    steps[Math.floor(steps.length / 2)],
    steps[steps.length - 2],
    steps[steps.length - 1],
  ];
};

export function Sandbox() {
  const [s, set] = useSceneState<PbtState>();
  const res = s.ran && s.props.length ? check(s.impl, s.props) : null;
  const example = sortWith(s.impl, [5, 3, 8]).join() === "3,5,8";
  const toggle = (id: PropId) =>
    set({
      props: s.props.includes(id) ? s.props.filter((x) => x !== id) : [...s.props, id],
      ran: false,
    });
  return (
    <StepLayout
      eyebrow="Sandbox"
      title="Let random inputs break a sort"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {IMPLS.map((i) => (
              <button
                key={i.id}
                type="button"
                aria-pressed={s.impl === i.id}
                onClick={() => set({ impl: i.id as Impl, ran: false })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.impl === i.id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {i.label}
              </button>
            ))}
          </div>
          <code className="text-muted font-mono text-[10.5px]">
            {IMPLS.find((i) => i.id === s.impl)!.code}
          </code>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs",
              example ? "border-line bg-surface" : "border-bad/40 bg-bad/10",
            )}
          >
            {example ? (
              <Check className="text-good size-3.5" />
            ) : (
              <X className="text-bad size-3.5" />
            )}
            Example test: <code className="font-mono">sort([5, 3, 8])</code> is{" "}
            <code className="font-mono">[3, 5, 8]</code>
          </div>
          <div className="grid gap-1">
            <p className="text-muted text-[10px] font-medium">
              Properties that should hold for any list of prices
            </p>
            {PROPS.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "flex items-start gap-1.5 rounded-lg border px-2.5 py-1 text-xs",
                  s.props.includes(p.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s.props.includes(p.id)}
                  onChange={() => toggle(p.id)}
                  className="accent-accent mt-0.5"
                />
                {p.label}
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={!s.props.length}
            onClick={() => set({ ran: true })}
            className="bg-accent text-accent-fg flex w-fit items-center gap-1.5 rounded-full px-4 py-1 text-xs font-medium disabled:opacity-40"
          >
            <Play className="size-3" /> Try up to 100 random lists
          </button>
          {res && (
            <motion.div
              key={`${s.impl}-${s.props.join()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "rounded-lg border px-3 py-2 font-mono text-[10.5px]",
                res.ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {res.ok ? (
                <p className="text-good">Passed 100 random lists.</p>
              ) : (
                <>
                  <p className="text-bad">
                    Falsified on try {res.tries}. Shrinking in {res.shrinks.length - 1} steps:
                  </p>
                  {SHOW(res.shrinks).map((st, i, arr) => (
                    <p key={i} className={i === arr.length - 1 ? "font-bold" : "text-muted"}>
                      {i === arr.length - 1 ? "smallest: " : "          "}[{st.join(", ")}] → [
                      {sortWith(s.impl, st).join(", ")}]
                    </p>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Two of these sorts are buggy, yet both pass the hand-picked example test. Choose an
        implementation, tick properties, and let the tester throw random price lists at it.
      </p>
      <p>
        Notice which properties catch the bugs and which don&apos;t, and read the smallest failing
        list. For <code>prices.sort()</code> it reveals a classic JavaScript surprise: without a
        comparator, numbers are sorted as text.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Patterns -------------------------------------------------------------------------------------- */

export function Patterns() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Finding a property"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Round trip",
              "decode(encode(x)) equals x",
              "JSON, URLs, compression, saving and loading",
            ],
            [
              "Invariant",
              "sorting keeps the same length and items",
              "Things that must never change",
            ],
            [
              "Compare with a simple version",
              "fastSearch(x) equals slowButObviousSearch(x)",
              "Optimised code against a reference",
            ],
            [
              "Do it twice",
              "applying a discount code twice equals applying it once",
              "Idempotent operations",
            ],
            [
              "Related inputs",
              "doubling every price doubles the total",
              "When you can't compute the answer directly",
            ],
          ].map(([t, e, u], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <code className="font-mono text-[10.5px]">{e}</code>
              <p className="text-muted text-[10px]">{u}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The hard part is thinking of rules. These five patterns cover most of them. A property
        rarely pins down every detail, so properties and a few examples work well together.
      </p>
      <p>
        The idea comes from QuickCheck, a Haskell library by Koen Claessen and John Hughes (2000).
        Today: Hypothesis (Python), fast-check (JavaScript), proptest (Rust), FsCheck (.NET) and
        jqwik (Java, now in maintenance mode).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Fuzzing -------------------------------------------------------------------------------------- */

export function Fuzzing() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fuzzing: random inputs, hunting crashes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="border-line bg-surface rounded-lg border px-2 py-2">
              <p className="text-accent font-mono text-lg">13,000+</p>
              <p className="text-muted text-[10px]">vulnerabilities fixed</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-2">
              <p className="text-accent font-mono text-lg">50,000+</p>
              <p className="text-muted text-[10px]">bugs, 1,000+ projects</p>
            </div>
          </div>
          <p className="text-muted text-[10px]">Google OSS-Fuzz, as of May 2025.</p>
          {[
            [
              "Coverage-guided",
              "The fuzzer mutates inputs and keeps the ones that reach new code, digging deeper over hours. AFL++ and Go's built-in fuzzing (since Go 1.18) work like this; libFuzzer is in maintenance mode.",
            ],
            [
              "With AI help",
              "In 2024 Google reported that language-model-written fuzz targets found 26 new vulnerabilities, including a low-severity OpenSSL bug likely present for about 20 years.",
            ],
          ].map(([t, b]) => (
            <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        <Term id="fuzzing">Fuzzing</Term> is the cousin of property-based testing. Instead of
        checking a stated rule, it feeds huge numbers of malformed or unexpected inputs to code
        (parsers, file readers, network handlers) and watches for crashes and memory errors.
      </p>
      <p>
        It&apos;s a defensive technique: projects fuzz their own code so they find these bugs before
        anyone else does.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function PbtCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the property"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="testing-pbt"
            prompt="You've written a function that saves a customer to a string and another that loads it back. Which property tests them best?"
            options={[
              {
                id: "rt",
                label: "load(save(customer)) equals the original customer",
                correct: true,
                feedback: "A round trip: any mismatch shows a field lost or mangled.",
              },
              {
                id: "len",
                label: "save(customer) is never empty",
                feedback: "True but weak: almost any bug still produces some text.",
              },
              {
                id: "ex",
                label: "save(sampleCustomer) equals a stored string",
                feedback: "An example test: one hand-picked case.",
              },
              {
                id: "fast",
                label: "save runs in under 1 ms",
                feedback: "A performance check, not correctness.",
              },
            ]}
            explanation="Round-trip properties are the easiest win: generate random customers, save and load, and compare."
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
        ["State a rule for all inputs", "Then let the tool hunt for a counterexample."],
        ["Shrinking", "Failures are reduced to the smallest case."],
        ["Some properties are weak", "Combine a few, plus examples."],
        ["Five patterns", "Round trip, invariant, reference, twice, related inputs."],
        ["Fuzzing for crashes", "Coverage-guided, long-running, defensive."],
      ]}
    >
      <p>Next: how fast is fast enough, and for how many people at once?</p>
    </WrapStep>
  );
}
