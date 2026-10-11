"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { KINDS, QUESTIONS, WHY, type Kind } from "./model";
import type { DoublesState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function StuntDouble() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The stunt double"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The star</p>
            <p className="text-muted">
              Expensive, busy, and you don&apos;t want them falling off a building on take 14.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The double</p>
            <p className="text-muted">
              Looks right for this one scene. Can fall off the building as often as the director
              likes.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Films use stunt doubles for scenes where the real actor would be too slow, too costly or too
        risky. The double only has to look right for that one shot.
      </p>
      <p>
        A <Term id="test-double">test double</Term> does the same for code. When a function depends
        on a payment service, an email sender or the clock, a test swaps in a stand-in that is fast,
        predictable and safe to use a thousand times.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Swap the payment service ⭐ -------------------------------------------------------------------- */

export function SwapDouble() {
  const [s, set] = useSceneState<DoublesState>();
  const k = KINDS.find((x) => x.id === s.kind)!;
  const pick = (id: Kind) =>
    set({ kind: id, seen: s.seen.includes(id) ? s.seen : [...s.seen, id] });
  return (
    <StepLayout
      eyebrow="Build"
      title="Swap in a stand-in for the payment service"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            <p className="text-muted text-[10px]">The code under test (made-up café)</p>
            <p>function placeOrder(order, payments) {"{"}</p>
            <p className="pl-4">const result = payments.charge(order.total);</p>
            <p className="pl-4">
              return result.ok ? &quot;Thanks!&quot; : &quot;Payment declined&quot;;
            </p>
            <p>{"}"}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {KINDS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.kind === x.id}
                onClick={() => pick(x.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.kind === x.id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <motion.div
            key={k.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-line bg-surface rounded-lg border px-3 py-2"
          >
            <p className="text-xs">{k.blurb}</p>
            <div className="mt-1 font-mono text-[10.5px]">
              {k.code.map((c) => (
                <pre key={c} className="whitespace-pre-wrap">
                  {c}
                </pre>
              ))}
            </div>
          </motion.div>
          <div className="grid gap-1">
            {QUESTIONS.map((q) => {
              const ok = q.can.includes(s.kind);
              const why = WHY[q.id]?.[s.kind];
              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                  )}
                >
                  <p className="flex items-start gap-1.5">
                    {ok ? (
                      <Check className="text-good mt-0.5 size-3 shrink-0" />
                    ) : (
                      <X className="text-bad mt-0.5 size-3 shrink-0" />
                    )}
                    {q.label}
                  </p>
                  {why && <p className="text-muted pl-[18px] text-[10px]">{why}</p>}
                </div>
              );
            })}
          </div>
          <p className="text-muted text-[10px]">
            Tried {s.seen.length} of {KINDS.length}.
          </p>
        </div>
      }
    >
      <p>
        <code>placeOrder</code> charges a card through a payment service. Pick what the test passes
        in as <code>payments</code>, and see which questions that test can answer.
      </p>
      <p>
        No single choice answers everything. Stand-ins are fast and predictable, but look at the
        last row: they only know what you told them, so if the real provider changes, they keep
        agreeing with the old version.
      </p>
      <p className="text-muted text-sm">
        That gap is what integration and contract tests, later in this track, are for.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Five kinds ----------------------------------------------------------------------------------- */

const FIVE: [string, string][] = [
  ["Dummy", "Passed in to fill a slot but never used, like a logger the test doesn't care about."],
  ["Stub", "Returns canned answers to the calls made during the test."],
  ["Spy", "A stub that also records how it was called, for checking afterwards."],
  ["Mock", "Programmed with expectations of the calls it should receive; fails otherwise."],
  ["Fake", "A real, working shortcut: an in-memory database, a local email inbox."],
];

export function FiveKinds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Five kinds of stand-in"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {FIVE.map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
          <p className="text-muted mt-1 text-[11px]">
            Rule of thumb: stubs and fakes feed data <strong>in</strong>; spies and mocks check what
            goes <strong>out</strong>.
          </p>
        </div>
      }
    >
      <p>
        These names come from Gerard Meszaros&apos;s book <em>xUnit Test Patterns</em> (2007), where
        &ldquo;test double&rdquo; is the umbrella term, after the film stunt double.
      </p>
      <p>
        Libraries blur them. Mockito&apos;s <code>mock()</code>, Jest&apos;s <code>jest.fn()</code>{" "}
        and Vitest&apos;s <code>vi.fn()</code> can each act as a stub, spy or mock. Learn the ideas;
        the library names vary.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How much to fake? ----------------------------------------------------------------------------- */

export function HowMuch() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How much should you fake?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "1 · The real thing",
              "If it's fast and predictable (a price calculator, a date parser), just use it.",
              "good",
            ],
            [
              "2 · A fake",
              "If the real one is slow (a database), a maintained in-memory version behaves most like it.",
              "good",
            ],
            [
              "3 · Stubs, spies and mocks",
              "For the rest, sparingly. Each one encodes an assumption about how the other side behaves.",
              "warn",
            ],
            [
              "Avoid · Mocking everything",
              "Tests that check every internal call break on every refactor and pass when the system is broken.",
              "bad",
            ],
          ].map(([t, b, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                k === "bad" ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
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
        Martin Fowler&apos;s essay &ldquo;Mocks Aren&apos;t Stubs&rdquo; describes two styles.{" "}
        <strong>Classicists</strong> use real objects where they can and check results.{" "}
        <strong>Mockists</strong> replace collaborators and check the calls between them.
      </p>
      <p>
        Both work. Google&apos;s engineering book suggests an order of preference: real
        implementations, then fakes, then interaction checks only where nothing else will do. A
        common guideline: don&apos;t mock types you don&apos;t own, such as a third-party SDK; wrap
        them in your own small interface and fake that.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DoublesCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which stand-in?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-doubles"
            prompt="Which kind of test double fits each need best?"
            categories={[
              { id: "dummy", label: "Dummy" },
              { id: "stub", label: "Stub" },
              { id: "spy", label: "Spy or mock" },
              { id: "fake", label: "Fake" },
            ]}
            items={[
              {
                id: "logger",
                label: "The constructor needs a logger, but this test never logs",
                category: "dummy",
                why: "Fills a slot, never used.",
              },
              {
                id: "clock",
                label: "Make the clock say it's 9 pm on a Sunday",
                category: "stub",
                why: "A canned answer to 'what time is it?'.",
              },
              {
                id: "email",
                label: "Check that exactly one receipt email was sent",
                category: "spy",
                why: "You're checking an outgoing call.",
              },
              {
                id: "db",
                label: "Run 200 tests against a database without a real one",
                category: "fake",
                why: "An in-memory version that really stores data.",
              },
              {
                id: "rate",
                label: "Make the currency service return 83.2 for USD",
                category: "stub",
                why: "Feeds a fixed value in.",
              },
            ]}
            explanation="Stubs and fakes feed data in; spies and mocks check what goes out; dummies just fill a slot."
          />
        </div>
      }
    >
      <p>Sort each need.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Doubles replace slow or risky parts", "Payments, email, the clock, the network."],
        ["Five kinds", "Dummy, stub, spy, mock, fake."],
        ["In versus out", "Stubs and fakes feed in; spies and mocks check out."],
        ["Prefer real, then fakes", "Use mocks sparingly."],
        ["Doubles can lie", "They agree with yesterday's version of the real thing."],
      ]}
    >
      <p>Next: tests are read far more than they&apos;re written. How do you make them readable?</p>
    </WrapStep>
  );
}
