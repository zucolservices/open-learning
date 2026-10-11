"use client";

import { motion } from "motion/react";
import { Check, Wrench } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUG_OPTIONS, FIXES, failure, testCode, type Fix } from "./model";
import type { ReadableState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Note() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A note on the fridge"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, rotate: -2 }}
            animate={{ opacity: 1, rotate: -2 }}
            className="border-line bg-surface rounded-lg border p-4 font-mono text-sm"
          >
            milk!!
          </motion.div>
          <motion.div
            initial={{ opacity: 0, rotate: 1.5 }}
            animate={{ opacity: 1, rotate: 1.5 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-lg border p-4 text-sm"
          >
            The oat milk in the fridge went off on Monday. Please buy two cartons, not dairy (Sam is
            allergic).
          </motion.div>
        </div>
      }
    >
      <p>
        You find a note saying &ldquo;milk!!&rdquo;. Buy it? Throw it out? Which kind? The person
        who wrote it knew; you don&apos;t. The second note answers every question without a phone
        call.
      </p>
      <p>
        A failing test is a note from a past developer, read at the worst moment: something just
        broke. A readable test tells you what behaviour broke, and how, before you open any code.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the test ⭐ ------------------------------------------------------------------------------- */

export function FixTest() {
  const [s, set] = useSceneState<ReadableState>();
  const toggle = (f: Fix) =>
    set({ fixes: s.fixes.includes(f) ? s.fixes.filter((x) => x !== f) : [...s.fixes, f] });
  const done = s.fixes.length === FIXES.length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Make a cryptic test explain itself"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10.5px]">
              <p className="text-muted mb-1 text-[10px]">discount.test.js</p>
              {testCode(s.fixes).map((l, i) => (
                <pre key={i} className="whitespace-pre">
                  {l}
                </pre>
              ))}
            </div>
            <div className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 font-mono text-[10.5px]">
              <p className="text-muted mb-1 text-[10px]">What the failure says</p>
              {failure(s.fixes).map((l, i) => (
                <motion.p
                  key={l}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={i === 0 ? "text-bad" : ""}
                >
                  {l}
                </motion.p>
              ))}
            </div>
          </div>
          <div className="grid gap-1">
            {FIXES.map((f) => {
              const on = s.fixes.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(f.id)}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                    on ? "border-good/50 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  {on ? (
                    <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                  ) : (
                    <Wrench className="text-muted mt-0.5 size-3.5 shrink-0" />
                  )}
                  <span>
                    {f.label}
                    {on && <span className="text-muted block text-[10px]">{f.why}</span>}
                  </span>
                </button>
              );
            })}
          </div>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-1"
            >
              <p className="text-xs font-semibold">
                Now, from the failure alone: what&apos;s the bug?
              </p>
              {BUG_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={s.guess === o.id}
                  onClick={() => set({ guess: o.id })}
                  className={cn(
                    "rounded-lg border px-3 py-1 text-left text-xs",
                    s.guess === o.id
                      ? o.correct
                        ? "border-good/60 bg-good/10"
                        : "border-bad/60 bg-bad/10"
                      : "border-line bg-surface",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        This test fails, and its report says only &ldquo;test2: expected true, received
        false&rdquo;. Apply the five fixes in any order and watch the code and the failure message
        change.
      </p>
      <p>
        When all five are in, you should be able to name the bug from the failure message alone,
        without reading the discount code at all.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Naming --------------------------------------------------------------------------------------- */

const STYLES: [string, string, string][] = [
  ["Plain sentence", "loyalty discount is capped at ₹100", "Jest, Vitest, pytest descriptions"],
  ["Should", "should cap the loyalty discount at ₹100", "Common in BDD-influenced teams"],
  [
    "Given / when / then",
    "given 3 loyalty years, when the order is ₹4,000, then the discount is ₹100",
    "Spells out the scenario",
  ],
  [
    "Unit_Scenario_Result",
    "LoyaltyDiscount_LargeOrder_CappedAt100",
    "Roy Osherove's style for languages that need method names",
  ],
];

export function Naming() {
  const [s, set] = useSceneState<ReadableState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four ways to name the same test"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {STYLES.map(([t, name, note], i) => (
            <button
              key={t}
              type="button"
              onClick={() => set({ style: i })}
              aria-pressed={s.style === i}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-xs",
                s.style === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <code className="font-mono text-[11px] break-all">{name}</code>
              {s.style === i && <p className="text-muted mt-0.5 text-[10px]">{note}</p>}
            </button>
          ))}
        </div>
      }
    >
      <p>
        The style matters less than the rule behind it: name the test after the{" "}
        <strong>behaviour</strong> it checks, not the method it calls. &ldquo;testCalculate&rdquo;
        tells you nothing when it fails.
      </p>
      <p>
        Pick one style as a team and stick with it. Long names are fine; a test name is read in a
        failure report, not typed.
      </p>
    </StepLayout>
  );
}

/* 4 ─ DAMP not DRY --------------------------------------------------------------------------------- */

export function Damp() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="DAMP, not DRY"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            <p className="text-bad mb-1 font-sans text-[11px] font-semibold">Too DRY</p>
            <pre className="whitespace-pre-wrap">{`beforeEach(() => setUpWorld(3));

test("cap", () => {
  check(world, 2, 100);
});`}</pre>
            <p className="text-muted mt-1 font-sans text-[10px]">
              What is world? What does 2 mean? Go and read three helpers.
            </p>
          </div>
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            <p className="text-good mb-1 font-sans text-[11px] font-semibold">DAMP</p>
            <pre className="whitespace-pre-wrap">{`test("discount is capped at ₹100", () => {
  const customer = aCustomer()
    .withLoyaltyYears(3).build();
  const order = anOrder()
    .withTotal(4000).build();
  expect(loyaltyDiscount(customer, order))
    .toBe(100);
});`}</pre>
            <p className="text-muted mt-1 font-sans text-[10px]">
              Everything the test depends on is right there.
            </p>
          </div>
        </div>
      }
    >
      <p>
        In production code you remove duplication (Don&apos;t Repeat Yourself). In tests,
        Google&apos;s engineers recommend DAMP instead: Descriptive And Meaningful Phrases. A little
        repetition is fine if each test can be read on its own.
      </p>
      <p>
        Helpers are still welcome when they <em>name</em> things, like <code>aCustomer()</code>.
        What hurts is hiding the important values somewhere else. You&apos;ll build helpers like
        these in the test data module.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ReadableCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Helps or hurts?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-readable"
            prompt="Does each habit help or hurt a test's readability?"
            categories={[
              { id: "helps", label: "Helps" },
              { id: "hurts", label: "Hurts" },
            ]}
            items={[
              {
                id: "name",
                label: "A name that states the expected behaviour",
                category: "helps",
                why: "The failure report explains itself.",
              },
              {
                id: "loop",
                label: "A loop and an if to work out the expected value",
                category: "hurts",
                why: "Logic in tests can repeat the bug. Write the value.",
              },
              {
                id: "shared",
                label: "A fixture that several tests change",
                category: "hurts",
                why: "Results depend on run order.",
              },
              {
                id: "one",
                label: "One behaviour per test",
                category: "helps",
                why: "One reason to fail.",
              },
              {
                id: "magic",
                label: "mk(1, true, 3)",
                category: "hurts",
                why: "Unnamed values hide what matters.",
              },
              {
                id: "specific",
                label: "expect(discount).toBe(100)",
                category: "helps",
                why: "The failure shows expected and received values.",
              },
            ]}
            explanation="Readable tests name the behaviour, keep everything they depend on in view, avoid logic, and fail with a specific message."
          />
        </div>
      }
    >
      <p>Sort each habit.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Name the behaviour", "The name is the first line of the failure."],
        ["Show what matters", "Named setup, no magic values."],
        ["No logic in tests", "Write the expected value."],
        ["No shared mutable state", "Each test stands alone."],
        ["Specific assertions", "Expected 100, received 120 beats expected true."],
      ]}
    >
      <p>
        Next: what if you wrote the test <em>before</em> the code? That&apos;s{" "}
        <Term id="tdd">test-driven development</Term>.
      </p>
    </WrapStep>
  );
}
