"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { IMPLS, TESTS } from "./model";
import type { TestsState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function SmokeAlarm() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The smoke alarm with no battery"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Looks fine",
              "Mounted on the ceiling, green light painted on. Silent every day.",
              "border-line bg-surface",
            ],
            [
              "Is fine",
              "Press the test button: it shrieks. You know it would warn you.",
              "border-good/50 bg-good/10",
            ],
          ].map(([t, b, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn("rounded-xl border p-3 text-xs", c)}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A smoke alarm with no battery looks exactly like a working one. It never goes off, which
        feels reassuring, until there&apos;s a fire.
      </p>
      <p>
        Some tests are like that: green every time, whatever the code does. Reviewers often skim the
        test files, so these slip through. Reviewing tests means asking one question of each:{" "}
        <em>would this fail if the code were wrong?</em> A test that can&apos;t fail is a{" "}
        <Term id="weak-test">weak test</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the tests ⭐ ----------------------------------------------------------------------------- */

export function FixTests() {
  const [s, set] = useSceneState<TestsState>();
  const view = TESTS.map((t) => {
    const flagged = s.flagged.includes(t.id);
    const v = t.weak && !flagged ? t.weak : t.fixed;
    return { t, flagged, v };
  });
  const caught = (impl: (typeof IMPLS)[number]["id"]) => view.some(({ v }) => !v.run(impl));
  const mutants = IMPLS.filter((m) => m.id !== "real");
  const allCaught = mutants.every((m) => caught(m.id));
  const toggle = (id: string) =>
    set({
      flagged: s.flagged.includes(id) ? s.flagged.filter((x) => x !== id) : [...s.flagged, id],
    });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Break the code: do the tests notice?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex flex-wrap gap-1">
            {IMPLS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={s.impl === m.id}
                onClick={() => set({ impl: m.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.impl === m.id ? "border-fg bg-surface-2" : "border-line-strong text-muted",
                )}
              >
                {m.label}
                {m.id !== "real" &&
                  (caught(m.id) ? (
                    <span className="text-good"> · caught</span>
                  ) : (
                    <span className="text-bad"> · escaped</span>
                  ))}
              </button>
            ))}
          </div>
          <p className="text-muted text-[11px]">{IMPLS.find((m) => m.id === s.impl)!.bug}</p>
          {view.map(({ t, flagged, v }) => {
            const pass = v.run(s.impl);
            return (
              <div
                key={t.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  {pass ? (
                    <Check className="text-good size-3.5 shrink-0" />
                  ) : (
                    <X className="text-bad size-3.5 shrink-0" />
                  )}
                  <span className="font-medium">{v.name}</span>
                  <button
                    type="button"
                    aria-pressed={flagged}
                    onClick={() => toggle(t.id)}
                    className={cn(
                      "ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[10px]",
                      flagged
                        ? t.weak
                          ? "border-good bg-good/15"
                          : "border-bad bg-bad/10"
                        : "border-line-strong text-muted",
                    )}
                  >
                    {flagged ? (t.weak ? "Fixed" : "Not weak") : "Flag as weak"}
                  </button>
                </div>
                <pre className="text-muted mt-1 overflow-x-auto font-mono text-[10.5px]">
                  {v.code.join("\n")}
                </pre>
                {flagged && (
                  <p className="mt-1 text-[10px]">
                    {t.weak ? (
                      <span className="text-good">
                        {t.weak.why} Replaced with a real assertion.
                      </span>
                    ) : (
                      <span className="text-muted">
                        This one checks a real result: a mutant that made ₹600 orders cost money
                        would fail it. Unflag it.
                      </span>
                    )}
                  </p>
                )}
              </div>
            );
          })}
          <p className={cn("text-xs", allCaught ? "text-good" : "text-muted")}>
            {allCaught
              ? "Every mutant now makes a test fail. These tests would warn you."
              : "Pick a mutant: if every test stays green, the tests aren't guarding anything."}
          </p>
        </div>
      }
    >
      <p>
        A pull request adds a delivery fee: free from ₹500, otherwise ₹40 plus ₹10 per km beyond 3
        km. It comes with four tests, all green.
      </p>
      <p>
        Switch to a mutant, a deliberately broken version of the code (the idea behind{" "}
        <Term id="mutation-testing">mutation testing</Term>). Flag each test that stays green when
        it shouldn&apos;t; flagging replaces it with one that checks a real result.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What to check -------------------------------------------------------------------------------- */

export function Checklist() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Five questions for every test file"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Would it fail if the code broke?",
              "Weak assertions, missing assertions, testing a stub.",
            ],
            [
              "Does it cover what changed?",
              "Including the edges: zero, the boundary, the error path.",
            ],
            [
              "Does it test behaviour, not wiring?",
              "Tests tied to internals break on every refactor.",
            ],
            ["Can you read the intent?", "Test names should read like the requirement."],
            ["Is it simple?", "Tests are code someone must maintain too."],
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
        In a study of over 300,000 reviews in Eclipse, OpenStack and Qt, Davide Spadini and
        colleagues (ICSE 2018) found test files were less likely than production files to get any
        review comment, and developers described tests as feeling secondary.
      </p>
      <p>
        Google&apos;s review guide asks reviewers to check that tests are correct, sensible and
        useful. Reading test names first is also a quick way to learn what the author claims the
        change does.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tests first? --------------------------------------------------------------------------------- */

export function TestsFirst() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Should you read the tests first?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["Production defects found", "About the same"],
              ["Test defects found", "More"],
              ["Maintainability issues found", "Fewer"],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="text-muted text-[10px]">{t}</p>
                <p className="font-semibold">{b}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Reviewing tests first versus code first; controlled experiment, 93 developers (Spadini
            et al., ICSE 2019).
          </p>
        </div>
      }
    >
      <p>
        &ldquo;Test-driven review&rdquo; means reading the changed tests before the code. In one
        experiment it found more problems in tests and fewer maintainability problems in the code.
        Most developers surveyed still preferred to start with the code.
      </p>
      <p>
        So it&apos;s a trade-off, not a rule. Whichever order you use, give tests real attention,
        especially tests written by AI tools, which can look thorough while asserting very little.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function TestsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Useful or weak?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-tests"
            prompt="Would each test catch a real bug?"
            categories={[
              { id: "useful", label: "Useful" },
              { id: "weak", label: "Weak" },
            ]}
            items={[
              {
                id: "exact",
                label: "expect(total(cart)).toBe(11400)",
                category: "useful",
                why: "Checks an exact result.",
              },
              {
                id: "truthy",
                label: "expect(total(cart)).toBeTruthy()",
                category: "weak",
                why: "Any non-zero total passes.",
              },
              {
                id: "mock",
                label:
                  "A test that mocks the tax service and then asserts the mock's own return value",
                category: "weak",
                why: "It tests the mock.",
              },
              {
                id: "err",
                label: "expect(() => total([])).toThrow('empty cart')",
                category: "useful",
                why: "Pins down the error path.",
              },
              {
                id: "none",
                label: "A test that calls the function and asserts nothing",
                category: "weak",
                why: "Passes unless it crashes.",
              },
            ]}
            explanation="Ask of every test: would it fail if the code were wrong? Exact results and error paths say yes; type checks, truthiness, mocks and missing assertions often say no."
          />
        </div>
      }
    >
      <p>Sort each test.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Tests are part of the change", "Review them as carefully as the code."],
        ["Would it fail?", "The key question for every test."],
        ["Watch for weak tests", "Type checks, truthiness, stubs, no assertion."],
        ["Look for missing cases", "Boundaries and error paths."],
        ["Order is a choice", "Tests first finds test bugs; code first is more common."],
      ]}
    >
      <p>Next: reviewing a change for security risks.</p>
    </WrapStep>
  );
}
