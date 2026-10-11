"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TestReport } from "../_shared/report";
import { ACT, ARRANGE, ASSERT, broken, correct, runAssembled, verdict } from "./model";
import type { AnatomyState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Recipe() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A taste test in three moves"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-3">
          {[
            ["Arrange", "Lay out the ingredients: one cup of tea, two spoons of sugar."],
            ["Act", "Make the drink, exactly as a customer would order it."],
            ["Assert", "Taste it: is it as sweet as the recipe says? Yes or no."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i === 2 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-accent font-mono text-[10px]">{i + 1}</p>
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A café checks a new recipe the same way every time: set up the ingredients, make the drink,
        then taste it against what the recipe promises.
      </p>
      <p>
        Almost every automated test has the same three moves, often called{" "}
        <Term id="arrange-act-assert">arrange, act, assert</Term>. The last move is the one that
        matters: an <Term id="assertion">assertion</Term> is the line that can fail.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Assemble a test ⭐ ----------------------------------------------------------------------------- */

function Slot({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: string[];
  value: number | null;
  onPick(i: number): void;
}) {
  return (
    <div className="grid gap-1">
      <p className="text-muted text-[10px] font-medium tracking-wide uppercase">{label}</p>
      <div className="flex flex-wrap gap-1">
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === i}
            onClick={() => onPick(i)}
            className={cn(
              "rounded-md border px-2 py-1 text-left font-mono text-[10.5px]",
              value === i ? "border-accent bg-accent-soft" : "border-line bg-surface text-muted",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Assemble() {
  const [s, set] = useSceneState<AnatomyState>();
  const ready = s.arrange !== null && s.assert !== null && s.act;
  const outcomes =
    ready && s.ran ? runAssembled(s.arrange!, s.assert!, s.broken ? broken : correct) : [];
  const v = ready ? verdict(s.arrange!, s.assert!) : null;
  return (
    <StepLayout
      eyebrow="Build"
      title="Assemble a test and run it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            <p className="text-muted text-[10px]">basket.js · the code under test</p>
            <p>function basketTotal(items) {"{"}</p>
            <p className={cn("pl-4", s.broken && "bg-bad/15")}>
              {s.broken
                ? "return items.reduce((sum, i) => sum + i.price, 0);"
                : "return items.reduce((sum, i) => sum + i.price * i.qty, 0);"}
            </p>
            <p>{"}"}</p>
          </div>
          <Slot
            label="Arrange"
            options={ARRANGE.map((a) => a.code)}
            value={s.arrange}
            onPick={(i) => set({ arrange: i, ran: false })}
          />
          <Slot
            label="Act"
            options={ACT.map((a) => a.code)}
            value={s.act ? 0 : null}
            onPick={() => set({ act: true, ran: false })}
          />
          <Slot
            label="Assert"
            options={ASSERT.map((a) => a.code)}
            value={s.assert}
            onPick={(i) => set({ assert: i, ran: false })}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!ready}
              onClick={() => set({ ran: true })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-medium disabled:opacity-40"
            >
              <Play className="size-3" /> Run test
            </button>
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.broken}
                onChange={(e) => set({ broken: e.target.checked })}
                className="accent-accent"
              />
              Break the code (forget the quantity)
            </label>
          </div>
          {s.ran && ready && (
            <>
              <TestReport outcomes={outcomes} />
              {v && (
                <motion.p
                  key={`${s.arrange}-${s.assert}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn("text-xs", v.good ? "text-good" : "text-muted")}
                >
                  {v.good && s.broken
                    ? "Caught the bug. It passes on correct code and fails on broken code: a real test."
                    : v.text}
                </motion.p>
              )}
            </>
          )}
        </div>
      }
    >
      <p>
        Pick one block for each move, then run the test for real. Then tick &ldquo;Break the
        code&rdquo; and run it again.
      </p>
      <p>
        A good test passes on correct code <em>and</em> fails on broken code. Try the combinations
        that don&apos;t manage both, and see why.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Reading a failure ----------------------------------------------------------------------------- */

const FAILURE: [string, string, string][] = [
  ["FAIL  basket.test.js", "Which file", "Find the test quickly."],
  [
    "✕ basket total multiplies price by quantity",
    "Which test",
    "A good name says what behaviour broke.",
  ],
  ["Expected: 240", "What it wanted", "The value written in the assertion."],
  ["Received: 120", "What it got", "120 is one chai: the quantity was ignored."],
  ["at basket.test.js:5:17", "Where", "The line of the assertion that failed."],
];

export function ReadFailure() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading a failure"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {FAILURE.map(([line, what, why], i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid gap-1 rounded-lg border px-3 py-1.5 text-xs sm:grid-cols-[1.3fr_1fr]"
            >
              <code
                className={cn(
                  "font-mono text-[11px]",
                  i < 2 ? "text-bad" : i === 3 ? "text-bad" : "",
                )}
              >
                {line}
              </code>
              <span>
                <span className="font-semibold">{what}</span>
                <span className="text-muted"> · {why}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        When a test fails, the <Term id="test-runner">test runner</Term> tells you which test, what
        it expected, what it actually got, and where. Read it top to bottom before opening any code.
      </p>
      <p>
        Here, 240 versus 120 is a big clue: exactly half. Two chais were ordered, one was counted.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Same shape everywhere ------------------------------------------------------------------------- */

const LANGS: Record<AnatomyState["lang"], { label: string; file: string; code: string[] }> = {
  pytest: {
    label: "Python",
    file: "test_basket.py · pytest",
    code: [
      "def test_total_multiplies_price_by_quantity():",
      '    basket = [Item("chai", price=120, qty=2)]   # arrange',
      "    total = basket_total(basket)              # act",
      "    assert total == 240                       # assert",
    ],
  },
  junit: {
    label: "Java",
    file: "BasketTest.java · JUnit",
    code: [
      "@Test",
      "void totalMultipliesPriceByQuantity() {",
      '    var basket = List.of(new Item("chai", 120, 2)); // arrange',
      "    var total = Basket.total(basket);               // act",
      "    assertEquals(240, total);                       // assert",
      "}",
    ],
  },
  go: {
    label: "Go",
    file: "basket_test.go · go test",
    code: [
      "func TestTotalMultipliesPriceByQuantity(t *testing.T) {",
      '    basket := []Item{{"chai", 120, 2}} // arrange',
      "    total := BasketTotal(basket)       // act",
      "    if total != 240 {                  // assert",
      '        t.Errorf("got %d, want 240", total)',
      "    }",
      "}",
    ],
  },
  vitest: {
    label: "TypeScript",
    file: "basket.test.ts · Vitest or Jest",
    code: [
      'test("total multiplies price by quantity", () => {',
      '  const basket = [{ name: "chai", price: 120, qty: 2 }]; // arrange',
      "  const total = basketTotal(basket);                     // act",
      "  expect(total).toBe(240);                               // assert",
      "});",
    ],
  },
};

export function SameShape() {
  const [s, set] = useSceneState<AnatomyState>();
  const l = LANGS[s.lang];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The same shape in every language"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.lang}
            onChange={(v) => set({ lang: v })}
            options={(Object.keys(LANGS) as AnatomyState["lang"][]).map((k) => [k, LANGS[k].label])}
          />
          <div className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            <p className="text-muted mb-1 text-[10px]">{l.file}</p>
            {l.code.map((c, i) => (
              <pre key={i} className="whitespace-pre">
                {c}
              </pre>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every language has test frameworks, and they all look alike. Many descend from SUnit, which
        Kent Beck wrote for Smalltalk, and JUnit, which Beck wrote with Erich Gamma for Java. That
        family is called xUnit.
      </p>
      <p>
        The names differ (<code>assert</code>, <code>assertEquals</code>, <code>expect</code>,{" "}
        <code>t.Errorf</code>) but the three moves don&apos;t. Some teams write them as given, when,
        then instead.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function AnatomyCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which move is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-anatomy"
            prompt="Sort each line of a test into its move."
            categories={[
              { id: "arrange", label: "Arrange" },
              { id: "act", label: "Act" },
              { id: "assert", label: "Assert" },
            ]}
            items={[
              {
                id: "user",
                label: "Create a customer with a student card",
                category: "arrange",
                why: "Setting up the situation.",
              },
              {
                id: "clock",
                label: "Set the clock to 9 pm on a Sunday",
                category: "arrange",
                why: "Also set-up: the time is part of the situation.",
              },
              {
                id: "order",
                label: "Place an order for two chais",
                category: "act",
                why: "The one action being tested.",
              },
              {
                id: "price",
                label: "Check the price is ₹189",
                category: "assert",
                why: "The line that can fail.",
              },
              {
                id: "email",
                label: "Check one receipt email was sent",
                category: "assert",
                why: "Another expectation about the result.",
              },
            ]}
            explanation="Arrange sets up the situation, act does the one thing being tested, and assert checks the outcome. A test without an assertion can't fail."
          />
        </div>
      }
    >
      <p>Sort each line.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Arrange, act, assert", "Set up, do one thing, check the result."],
        ["The assertion is the test", "No assertion, no way to fail."],
        ["Pass on good code, fail on bad", "Break the code on purpose to check your test."],
        ["Read the failure first", "Which test, expected, received, where."],
        ["Same shape everywhere", "pytest, JUnit, Go, Jest and Vitest all follow it."],
      ]}
    >
      <p>Next: you can&apos;t test every input. Which ones should you pick?</p>
    </WrapStep>
  );
}
