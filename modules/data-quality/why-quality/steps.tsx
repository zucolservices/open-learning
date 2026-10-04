"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { INCIDENTS, STAGES, USES, ruleOfTen } from "./model";
import type { WhyState } from "./state";

/* 2 ─ What bad data costs ⭐ ---------------------------------------------------------------------- */

export function CountCost() {
  const [s, set] = useSceneState<WhyState>();
  const r = ruleOfTen(s.flawed);
  const stage = STAGES.find((x) => x.id === s.stage) ?? STAGES[0];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="What bad data costs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">100 tasks, each needing one record</p>
            <div className="mt-2 flex items-center gap-3 text-xs">
              <span className="text-muted">flawed records</span>
              <input
                type="range"
                min={0}
                max={60}
                value={s.flawed}
                onChange={(e) => set({ flawed: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Flawed records out of 100"
              />
              <span className="w-8 font-mono font-semibold">{s.flawed}</span>
            </div>
            <div className="mt-3 grid grid-cols-10 gap-0.5">
              {Array.from({ length: 100 }, (_, i) => (
                <span
                  key={i}
                  className={cn("h-3 rounded-[2px]", i < r.flawed ? "bg-bad/70" : "bg-viz-data/40")}
                />
              ))}
            </div>
            <p className="mt-2 font-mono text-xs">
              {r.perfect} × ₹1 + {r.flawed} × ₹10 ={" "}
              <span className="text-sm font-semibold">₹{r.cost}</span>
              <span className="text-muted font-sans"> (vs ₹100 if all were perfect)</span>
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">One error: where is it caught?</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {STAGES.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={s.stage === x.id}
                  onClick={() => set({ stage: x.id })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    s.stage === x.id ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-end gap-2">
              {STAGES.map((x) => (
                <div key={x.id} className="flex flex-1 flex-col items-center gap-1">
                  <motion.div
                    animate={{ height: `${Math.max(4, x.cost * 0.8)}px` }}
                    className={cn(
                      "w-full rounded-t",
                      x.id === s.stage ? "bg-accent" : "bg-surface-2",
                    )}
                  />
                  <span className="font-mono text-[10px]">₹{x.cost}</span>
                </div>
              ))}
            </div>
            <motion.p
              key={stage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted mt-2 text-xs"
            >
              {stage.note}
            </motion.p>
          </div>
          <p className="text-subtle text-[10px]">
            Both are rules of thumb for thinking, not measured costs.
          </p>
        </div>
      }
    >
      <p>
        Thomas Redman&apos;s &ldquo;rule of ten&rdquo;: finishing a piece of work costs about ten
        times as much when its data is flawed. In a small 2017 study he co-wrote, 47% of newly
        created records had at least one critical error. Drag the slider to see what that does to
        the cost.
      </p>
      <p>
        The older &ldquo;1-10-100&rdquo; rule of thumb (usually credited to Labovitz and Chang,
        1992) makes the same point about timing: preventing an error is cheap, fixing it later costs
        more, and letting it reach customers costs most. Gartner reports organisations estimate poor
        data quality costs them $12.9 million a year on average.
      </p>
    </StepLayout>
  );
}

/* 3 ─ It happens for real ------------------------------------------------------------------------- */

export function Incidents() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="It happens for real"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {INCIDENTS.map((x, i) => (
            <motion.div
              key={x.who}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
            >
              <p className="text-sm font-semibold">
                {x.who}{" "}
                <span className="text-muted font-mono text-[10px] font-normal">· {x.when}</span>
              </p>
              <p className="text-muted mt-1">{x.what}</p>
              <p className="text-accent mt-1">Could have helped: {x.check}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Three public cases, each a different kind of failure: a value typed in the wrong units, bad
        data flowing into a machine-learning model, and a software bug producing wrong results that
        went out to customers.
      </p>
      <p>
        None needed exotic technology to catch. Each needed a check, or a monitor, in the right
        place.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Good enough for what? ----------------------------------------------------------------------- */

export function FitForPurpose() {
  const [s, set] = useSceneState<WhyState>();
  const u = USES[s.use] ?? USES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Good enough for what?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {USES.map((x, i) => (
              <button
                key={x.data}
                type="button"
                aria-pressed={s.use === i}
                onClick={() => set({ use: i })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  s.use === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {x.data}
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {u.uses.map(([use, ok, why]) => (
              <motion.div
                key={use}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border px-4 py-3 text-xs",
                  ok ? "border-good bg-good/10" : "border-bad bg-bad/10",
                )}
              >
                <p className="text-sm font-semibold">
                  {ok ? "✓" : "✗"} {use}
                </p>
                <p className="text-muted mt-0.5">{why}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        There&apos;s no such thing as perfect data. The classic definition, from quality guru Joseph
        Juran and taken up by Wang and Strong in 1996, is{" "}
        <Term id="fitness-for-use">fitness for use</Term>: data is good quality when it&apos;s fit
        for what its <Term id="data-consumer">consumers</Term> need.
      </p>
      <p>
        So the same dataset can be fine for one job and wrong for another. Quality work starts by
        asking who uses the data, and for what.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Fit for purpose? ---------------------------------------------------------------------------- */

export function GoodEnough() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fit for purpose?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="fit-for-purpose"
            prompt="Is the data good enough for this use?"
            categories={[
              { id: "yes", label: "Fit" },
              { id: "no", label: "Not fit" },
            ]}
            items={[
              {
                id: "weekly",
                label: "Weekly-updated stock levels, for a quarterly planning meeting",
                category: "yes",
                why: "A week old is fine for quarterly planning.",
              },
              {
                id: "live",
                label: "The same weekly stock levels, for showing 'in stock' on a website",
                category: "no",
                why: "Customers would order things that sold out days ago.",
              },
              {
                id: "email",
                label: "Emails with 5% typos, for counting customers by domain",
                category: "yes",
                why: "A few errors barely move the counts.",
              },
              {
                id: "invoice",
                label: "The same emails, for sending legal invoices",
                category: "no",
                why: "Every bounced invoice is a real problem.",
              },
              {
                id: "city",
                label: "City-level location, for choosing where to open a store",
                category: "yes",
                why: "City is the right level for that decision.",
              },
            ]}
            explanation="Quality is relative to the job: freshness, precision and error rates that are fine for one use can be useless for another."
          />
        </div>
      }
    >
      <p>Sort the uses.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Fit for use", "Quality depends on who uses the data, and for what."],
  ["Errors travel", "Systems copy bad values faithfully."],
  ["Early is cheap", "Catch it at entry, not in the boardroom."],
  ["Hidden factories", "Unplanned checking and fixing work is the real cost."],
  ["Checks and monitors", "Prevent what you can; notice the rest quickly."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: breaking &ldquo;bad data&rdquo; into dimensions you can measure.</p>
    </StepLayout>
  );
}
