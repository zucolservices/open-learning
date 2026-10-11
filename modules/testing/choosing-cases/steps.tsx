"use client";

import { motion } from "motion/react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BOUNDARIES, PARTITIONS, boundaryHits, fmtFee, impl, spec } from "./model";
import type { ChoosingState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Lift() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Testing a lift without riding it forever"
      stage={
        <div className="flex flex-1 items-center justify-center gap-6">
          <div className="flex flex-col-reverse gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.03 * i }}
                className={cn(
                  "flex h-6 w-28 items-center justify-between rounded border px-2 font-mono text-[10px]",
                  [0, 1, 8, 9].includes(i)
                    ? "border-accent bg-accent-soft"
                    : i === 4
                      ? "border-viz-data bg-viz-data/15"
                      : "border-line bg-surface text-muted",
                )}
              >
                <span>floor {i}</span>
                {[0, 1, 8, 9].includes(i) && <span>edge</span>}
                {i === 4 && <span>middle</span>}
              </motion.div>
            ))}
          </div>
          <p className="text-muted max-w-40 text-xs">
            Five tests, not a thousand: one from the middle, and both sides of each end.
          </p>
        </div>
      }
    >
      <p>
        An inspector checking a lift doesn&apos;t press every button a thousand times. Floors 3, 4
        and 5 behave the same, so one of them will do. The interesting floors are the ends: the
        ground floor, the top, and the ones just next to them.
      </p>
      <p>
        Testing code works the same way. Group inputs that should behave alike into{" "}
        <Term id="equivalence-partition">partitions</Term>, test one from each, then test the{" "}
        <Term id="boundary-value">boundaries</Term> between them, where bugs love to hide.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Bug hunt ⭐ ----------------------------------------------------------------------------------- */

export function BugHunt() {
  const [s, set] = useSceneState<ChoosingState>();
  const found = s.tests.some(([k, t]) => spec(k, t) !== impl(k, t));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Hunt the bug with as few tests as possible"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-[11px]">
            <p className="text-muted text-[10px] font-medium">The rules (made-up café)</p>
            <p>
              Free delivery on orders of ₹500 or more. Otherwise ₹30 up to 3 km, plus ₹10 for each
              extra km or part of one. No delivery beyond 8 km.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs">
              Distance: <span className="font-mono">{s.km} km</span>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={s.km}
                onChange={(e) => set({ km: Number(e.target.value) })}
                className="accent-accent w-full"
                aria-label="Distance in km"
              />
            </label>
            <label className="text-xs">
              Order total: <span className="font-mono">₹{s.subtotal}</span>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={s.subtotal}
                onChange={(e) => set({ subtotal: Number(e.target.value) })}
                className="accent-accent w-full"
                aria-label="Order total in rupees"
              />
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => set({ tests: [...s.tests, [s.km, s.subtotal]] })}
              className="bg-accent text-accent-fg flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
            >
              <Plus className="size-3" /> Add as a test
            </button>
            {s.tests.length > 0 && (
              <button
                type="button"
                onClick={() => set({ tests: [] })}
                className="text-muted flex items-center gap-1 text-xs"
              >
                <Trash2 className="size-3" /> Clear
              </button>
            )}
            <span className="text-muted ml-auto text-xs">{s.tests.length} tests</span>
          </div>
          {s.tests.length > 0 && (
            <div className="border-line max-h-40 overflow-y-auto rounded-lg border font-mono text-[10.5px]">
              {s.tests.map(([k, t], i) => {
                const want = spec(k, t);
                const got = impl(k, t);
                const ok = want === got;
                return (
                  <div
                    key={i}
                    className={cn(
                      "border-line grid grid-cols-[1.2fr_1fr_1fr_auto] gap-2 border-t px-2 py-1 first:border-t-0",
                      !ok && "bg-bad/10",
                    )}
                  >
                    <span>
                      {k} km, ₹{t}
                    </span>
                    <span className="text-muted">want {fmtFee(want)}</span>
                    <span>got {fmtFee(got)}</span>
                    {ok ? (
                      <Check className="text-good size-3" />
                    ) : (
                      <X className="text-bad size-3" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {PARTITIONS.map((p) => {
              const hit = s.tests.some(([k, t]) => p.has(k, t));
              return (
                <span
                  key={p.id}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px]",
                    hit ? "border-viz-data bg-viz-data/15" : "border-line text-muted",
                  )}
                >
                  {p.label}
                </span>
              );
            })}
            {BOUNDARIES.map((b) => {
              const n = boundaryHits(s.tests, b);
              return (
                <span
                  key={b.id}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px]",
                    n === 2
                      ? "border-accent bg-accent-soft"
                      : n === 1
                        ? "border-accent/50"
                        : "border-line text-muted",
                  )}
                >
                  edge {b.label}
                </span>
              );
            })}
          </div>
          {found && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-good text-xs"
            >
              Found it in {s.tests.length} tests: an order of exactly ₹500 is charged. The code says
              &ldquo;more than 500&rdquo; where the rule says &ldquo;500 or more&rdquo;.
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        The café&apos;s delivery-fee code has one bug. Pick a distance and an order total, add it as
        a test, and the expected fee from the rules is compared with what the code returns.
      </p>
      <p>
        The chips light up as you cover each partition and both sides of each edge. Random guessing
        rarely finds it; a value on each side of each boundary finds it fast.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Happy, sad, edge ------------------------------------------------------------------------------ */

const PATHS: [string, string, string][] = [
  ["Happy path", "The normal case most customers hit.", "2 km, ₹300 → ₹30"],
  [
    "Edge cases",
    "Values at or next to a boundary, or extremes like zero.",
    "3 km, 3.5 km, ₹490, ₹500, 0 km",
  ],
  [
    "Sad path",
    "Input that should be refused or handled as an error.",
    "9 km → no delivery; −1 km → an error?",
  ],
];

export function Paths() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Happy, edge and sad paths"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PATHS.map(([t, b, e], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
              <p className="mt-0.5 font-mono text-[11px]">{e}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Beginners test the happy path and stop. Most bugs live on the other two: the edges, and the
        inputs nobody expected.
      </p>
      <p>
        Notice the question mark on −1 km. The rules don&apos;t say what should happen. Choosing
        test cases often uncovers gaps in the requirements themselves, which is one of the most
        useful things testing does.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Boundaries in detail -------------------------------------------------------------------------- */

export function Boundaries() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two values or three?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          {[
            [
              "Two-value",
              [490, 500],
              "Each boundary value (₹490, the last paid total; ₹500, the first free one) and its neighbour across the edge.",
            ],
            [
              "Three-value",
              [480, 490, 500, 510],
              "Each boundary value and both its neighbours: catches slips like == written for <=, which two values can miss.",
            ],
          ].map(([t, vals, b]) => (
            <div key={t as string} className="text-xs">
              <p className="font-semibold">{t as string}</p>
              <div className="relative mt-2 h-8">
                <div className="bg-line-strong absolute top-1/2 right-0 left-0 h-px" />
                <div className="bg-accent absolute top-1 bottom-1 left-1/2 w-0.5" />
                {(vals as number[]).map((v) => (
                  <span
                    key={v}
                    className="border-viz-data bg-viz-data/20 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-0.5 font-mono text-[11px]"
                    style={{ left: `${50 + (v - 495) * 2}%` }}
                  >
                    {v}
                  </span>
                ))}
              </div>
              <p className="text-muted">{b as string}</p>
            </div>
          ))}
          <p className="text-muted text-[11px]">
            The vertical line is where the rule changes: free from ₹500.
          </p>
        </div>
      }
    >
      <p>
        <Term id="boundary-value">Boundary value analysis</Term> picks values right at each edge.
        The classic textbook techniques (in the ISTQB syllabus, for example) come in a two-value and
        a three-value form.
      </p>
      <p>
        Here the step is ₹10 because the slider moves in tens. With real money you&apos;d test
        ₹499.99 and ₹500.00: the smallest step the data allows.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ChoosingCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the best three tests"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="testing-choosing"
            prompt="A cinema gives a child discount to anyone aged 3 to 12. Which set of ages tests the rule best with the fewest tests?"
            options={[
              {
                id: "a",
                label: "5, 7, 9",
                feedback: "All from the same partition: they'll behave identically.",
              },
              {
                id: "b",
                label: "2, 3, 12, 13",
                correct: true,
                feedback: "Both sides of both edges. Add one middle value if you like.",
              },
              {
                id: "c",
                label: "0, 50, 100",
                feedback: "Far from the edges, where off-by-one bugs live.",
              },
              {
                id: "d",
                label: "Every age from 0 to 100",
                feedback: "Works, but 101 tests for a two-edge rule wastes time.",
              },
            ]}
            explanation="Partitions: under 3, 3 to 12, over 12. The edges are 2|3 and 12|13. Off-by-one mistakes (< instead of <=) only show up right at those edges."
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
        ["You can't test everything", "So choose inputs deliberately."],
        ["One per partition", "Inputs that behave alike need only one test."],
        ["Both sides of every edge", "Off-by-one bugs hide at boundaries."],
        ["Happy, edge and sad", "Don't stop at the normal case."],
        ["Questions are findings", "If the rules don't say, you've found a gap."],
      ]}
    >
      <p>Next: tests come in different sizes. How should a suite mix them?</p>
    </WrapStep>
  );
}
