"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TECHS, simulate } from "./model";
import type { SurgeState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Festival() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The festival crowd"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Known date", "Everyone knows when the festival is; nobody is surprised."],
            ["Extra counters", "Pre-printed passes, extra gates and a marked queue."],
            ["Spread the arrival", "Passes by post, so fewer people come at all."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        A temple town expecting a festival crowd doesn&apos;t just hope for the best. The date is
        known, so it adds gates, prints passes in advance and lays out queues.
      </p>
      <p>
        Government services face the same kind of <Term id="traffic-surge">traffic surge</Term>:
        exam results, tax deadlines, vaccine registration, train tickets. The peaks are huge but
        predictable, so they can be planned for with <Term id="cache">caching</Term>, queues and
        lighter pages.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function ResultsDay() {
  const [s, set] = useSceneState<SurgeState>();
  const r = simulate(s);
  const top = 3_200_000;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Results day at 10 a.m."
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <div className="relative flex h-32 items-end gap-1">
              <span
                className="border-viz-compute absolute inset-x-0 z-10 border-t border-dashed"
                style={{ bottom: `${Math.min(100, (r.capacity / top) * 100)}%` }}
              />
              {r.buckets.map((b) => (
                <div key={b.minute} className="relative flex h-full flex-1 flex-col justify-end">
                  <motion.div
                    animate={{ height: `${(b.demand / top) * 100}%` }}
                    className="bg-bad/40 absolute inset-x-0 bottom-0 rounded-t-sm"
                  />
                  <motion.div
                    animate={{ height: `${(b.served / top) * 100}%` }}
                    className="bg-good/80 relative rounded-t-sm"
                  />
                </div>
              ))}
            </div>
            <div className="text-subtle mt-1 flex justify-between text-[10px]">
              <span>10:00</span>
              <span>10:30</span>
              <span>11:00</span>
            </div>
            <p className="text-subtle mt-1 text-[10px]">
              Red: visitors per minute. Green: served. Dashed: what the site can handle.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div
              className={cn(
                "rounded-lg border px-2 py-2",
                r.failedShare > 0.05 ? "border-bad/40 bg-bad/5" : "border-good/50 bg-good/10",
              )}
            >
              <p className="font-mono text-base font-semibold">
                {Math.round(r.failedShare * 100)}%
              </p>
              <p className="text-muted text-[10px]">of visits see an error</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-2">
              <p className="font-mono text-base font-semibold">
                {s.queue ? `${r.maxWait} min` : "—"}
              </p>
              <p className="text-muted text-[10px]">longest wait in the queue</p>
            </div>
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {TECHS.map(([k, t, b]) => (
              <label
                key={k}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-2.5 py-1.5",
                  s[k] ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s[k] as boolean}
                  onChange={() => set({ [k]: !s[k] })}
                  className="mt-0.5"
                />
                <span>
                  <span className="font-semibold">{t}</span>
                  <span className="text-muted block text-[11px]">{b}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative numbers, not a real exam board&apos;s traffic.
          </p>
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s school board publishes results at 10 a.m. Up to three million visits a
        minute arrive at once, against a site built for a normal day.
      </p>
      <p>
        Try each technique and combinations. Some let the site serve more; others spread or shrink
        the peak.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Real surges ---------------------------------------------------------------------------------- */

export function RealSurges() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Real surges in India"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "CoWIN, 28 April 2021",
              "Registration opened for everyone 18+ at 4 p.m.: 1.33 crore registered that day, with about 383 million API hits in three hours. Users saw errors; officials called it a brief glitch.",
            ],
            [
              "Tax deadline, 31 July 2024",
              "69.92 lakh returns filed that day, peaking at 5.07 lakh in one hour.",
            ],
            [
              "Tax portal, 2021 and 2025",
              "The new portal struggled after its 2021 launch; in 2025 slowness on deadline day led to a one-day extension.",
            ],
            [
              "Tatkal train tickets",
              "Opening at 10 and 11 a.m.: a record 30,155 tickets in one minute (March 2025). A new reservation system built for 1.5 lakh+ bookings a minute began rolling out in August 2026.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Each of these peaks was announced in advance. The difference between a smooth day and a
        headline is preparation.
      </p>
      <p>
        Extending a deadline is also a surge tool, but a costly one: it moves the peak, and the
        trust lost stays.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Playbook ------------------------------------------------------------------------------------- */

export function Playbook() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The surge playbook"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Do slow work early",
              "CBSE has schools create students' DigiLocker access before results day, so the day itself is a quick read.",
            ],
            ["Spread the demand", "CoWIN opened registration days before vaccination slots."],
            [
              "Keep it fair",
              "Since July 2025, Tatkal tickets need Aadhaar OTP, and agents can't book in the first 30 minutes.",
            ],
            [
              "Serve static where possible",
              "Results and certificates rarely change: pre-build them and serve from caches close to users.",
            ],
            [
              "Test at the real peak",
              "Load-test at the numbers you'll actually see, and plan what to switch off if it's not enough.",
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
        <Term id="graceful-degradation">Graceful degradation</Term> means deciding in advance what
        to switch off under strain, such as search or downloads, so the core task keeps working.
      </p>
      <p>The System Design track covers caching, queues and load testing in depth.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SurgeCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Spread the peak, or serve more?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-surge"
            prompt="Does each technique spread or shrink the peak, or let the site serve more?"
            categories={[
              { id: "spread", label: "Spreads or shrinks the peak" },
              { id: "serve", label: "Serves more" },
            ]}
            items={[
              {
                id: "sms",
                label: "Sending results by SMS",
                category: "spread",
                why: "Fewer people need the site.",
              },
              {
                id: "cache",
                label: "Caching pre-built result pages",
                category: "serve",
                why: "Each request costs far less.",
              },
              {
                id: "early",
                label: "Creating accounts days before results day",
                category: "spread",
                why: "Moves slow work away from the peak.",
              },
              {
                id: "queue",
                label: "A waiting room",
                category: "spread",
                why: "Lets people in at the rate the site can handle.",
              },
              {
                id: "light",
                label: "A lighter results page",
                category: "serve",
                why: "Less work per visit.",
              },
            ]}
            explanation="Some techniques reduce or spread demand (SMS, early registration, queues); others raise how much the site can serve (caching, lighter pages). Big days need both."
          />
        </div>
      }
    >
      <p>Sort each technique.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Peaks are predictable", "Results, deadlines, openings."],
        ["Serve more", "Caches and lighter pages."],
        ["Spread the peak", "SMS, early registration, queues."],
        ["Keep it fair", "Queues and rules, not luck."],
        ["Test at the real number", "And know what to switch off."],
      ]}
    >
      <p>Next: records, audits and recovering from failure.</p>
    </WrapStep>
  );
}
