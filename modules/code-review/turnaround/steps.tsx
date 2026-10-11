"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MODES, WEEK_HOURS, simulate, type Mode, type Size } from "./model";
import type { TurnState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Laundry() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The dry cleaner that collects once a week"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            "Mon: shirt dropped off",
            "Tue: another shirt",
            "Wed: running out of shirts",
            "Thu: wearing the one you hate",
            "Fri: everything comes back at once",
          ].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs",
                i === 4 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A dry cleaner that only returns clothes on Fridays isn&apos;t slow at cleaning. The waiting
        is the problem: you run out of shirts, improvise, and then deal with a pile all at once.
      </p>
      <p>
        Pull requests behave the same way. <Term id="review-latency">Review latency</Term>, the time
        a change waits for a reviewer, is usually far longer than the review itself. While it waits,
        the author starts something else, and every round of feedback drags them back.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulate ⭐ ---------------------------------------------------------------------------------- */

export function Week() {
  const [s, set] = useSceneState<TurnState>();
  const w = simulate(s.mode, s.size);
  const pick = (patch: Partial<TurnState>) => {
    const next = { ...s, ...patch };
    const key = `${next.mode}-${next.size}`;
    set({ ...patch, tried: s.tried.includes(key) ? s.tried : [...s.tried, key] });
  };
  const X = (h: number) => 36 + (Math.min(h, WEEK_HOURS) / WEEK_HOURS) * 358;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A week of pull requests"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2">
            <Segmented<Mode>
              size="sm"
              value={s.mode}
              onChange={(mode) => pick({ mode })}
              options={MODES.map((m) => [m.id, m.label])}
            />
            <Segmented<Size>
              size="sm"
              value={s.size}
              onChange={(size) => pick({ size })}
              options={[
                ["large", "Large changes"],
                ["small", "Small changes"],
              ]}
            />
          </div>
          <p className="text-muted text-[11px]">{MODES.find((m) => m.id === s.mode)!.note}</p>
          <svg viewBox="0 0 400 112" className="h-auto w-full max-w-xl">
            {[0, 1, 2, 3, 4].map((d) => (
              <g key={d}>
                <line
                  x1={X(d * 8)}
                  y1={4}
                  x2={X(d * 8)}
                  y2={96}
                  className="stroke-line"
                  strokeWidth={0.6}
                />
                <text x={X(d * 8) + 3} y={108} className="fill-subtle text-[8px]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"][d]}
                </text>
              </g>
            ))}
            {w.timeline.map((p, i) => (
              <rect
                key={i}
                x={X(p.open)}
                y={8 + p.author * 22 + (i % 2) * 6}
                width={Math.max(1.5, X(p.merge) - X(p.open))}
                height={5}
                rx={2}
                className={p.merge <= WEEK_HOURS ? "fill-viz-data" : "fill-bad"}
              />
            ))}
            {[0, 1, 2, 3].map((a) => (
              <text key={a} x={2} y={16 + a * 22} className="fill-subtle text-[7px]">
                dev {a + 1}
              </text>
            ))}
          </svg>
          <p className="text-subtle -mt-2 text-[10px]">
            Each bar is one pull request, from opened to merged. Red bars are still open on Friday
            evening.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["Merged this week", `${w.merged} of ${w.opened}`],
              ["Median wait to merge", `${w.medianHours} h`],
              ["Author context switches", `${w.switches}`],
              ["Reviewer focus broken", `${w.interruptions}×`],
            ].map(([t, v]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-2 py-1.5 text-xs">
                <p className="text-muted text-[10px]">{t}</p>
                <p
                  className={cn(
                    "font-mono font-semibold",
                    t.startsWith("Reviewer") && w.interruptions > 0 && "text-bad",
                  )}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>
          {s.tried.length >= 4 && (
            <p className="text-good text-xs">
              Small changes reviewed at natural breaks get nearly all the speed of &ldquo;drop
              everything&rdquo; without wrecking reviewers&apos; focus.
            </p>
          )}
        </div>
      }
    >
      <p>
        Four developers, one week. Choose how quickly reviewers respond and how big each change is,
        and watch what gets merged by Friday. Numbers are illustrative.
      </p>
      <p>
        Try all three response styles with both sizes. Look at two costs together: authors waiting,
        and reviewers being interrupted.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Real numbers --------------------------------------------------------------------------------- */

export function Numbers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What fast teams actually do"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Google's guideline",
              "Respond within one business day at most; ideally at your next natural break.",
            ],
            [
              "Google's measurements (2018)",
              "First feedback under an hour for small changes; under 4 hours median for the whole review, across 9 million changes.",
            ],
            [
              "Elsewhere (Rigby & Bird)",
              "Median time to approval of roughly 15 to 20 hours on several Microsoft, AMD and Chrome OS projects.",
            ],
            [
              "Meta's nudges (2022)",
              "Reminders on stale diffs cut average time in review by 7% and diffs waiting over 3 days by 12%.",
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
        Google ties its speed to tiny changes: the median change in its 2018 study was 24 lines. Its
        guide warns that slow reviews push people into bigger changes and resentment, which makes
        reviews slower still.
      </p>
      <p>
        Meta tracked the slowest quarter of reviews and paired speed with a guardrail on time spent
        actually reading, so that faster didn&apos;t mean rubber-stamped.
      </p>
    </StepLayout>
  );
}

/* 4 ─ First response ------------------------------------------------------------------------------- */

export function FirstResponse() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fast response isn't fast approval"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["“Looking at this after standup.”", "Sets expectations; the author can plan."],
            [
              "“The approach looks right; details tomorrow.”",
              "A quick first pass unblocks the big question.",
            ],
            ["“I'm not the best person; adding Priya.”", "Re-routing fast beats sitting on it."],
            ["“Too big to review well. Could you split it?”", "An honest early answer saves days."],
          ].map(([q, b], i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-medium">{q}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Speed means responding quickly, not approving quickly. A short first reply is often enough
        to keep work moving.
      </p>
      <p>
        Protect focus too: review between tasks, after a meeting, or at the start of the day, rather
        than abandoning deep work for every notification.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function TurnCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Faster or slower?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-turnaround"
            prompt="Does each habit speed up or slow down review turnaround?"
            categories={[
              { id: "fast", label: "Speeds it up" },
              { id: "slow", label: "Slows it down" },
            ]}
            items={[
              {
                id: "small",
                label: "Opening small pull requests",
                category: "fast",
                why: "Quicker to read, fewer rounds.",
              },
              {
                id: "batch",
                label: "Saving all reviews for Friday afternoon",
                category: "slow",
                why: "Everything waits days.",
              },
              {
                id: "ack",
                label: "A quick reply saying when you'll look",
                category: "fast",
                why: "The author can plan.",
              },
              {
                id: "big",
                label: "Bundling a week of work into one change to avoid waiting",
                category: "slow",
                why: "Bigger changes wait longer and need more rounds.",
              },
              {
                id: "breaks",
                label: "Checking the review queue between tasks",
                category: "fast",
                why: "Fast without breaking focus.",
              },
            ]}
            explanation="Small changes, quick first replies and reviewing at natural breaks keep work flowing. Batching reviews and bundling changes make the waiting worse."
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
        ["Waiting is the cost", "Latency, not review time, slows teams."],
        ["Respond within a day", "Ideally at your next natural break."],
        ["Response, not approval", "A short first reply keeps work moving."],
        ["Small changes go fast", "Speed and size go together."],
        ["Protect focus", "Don't drop deep work for every request."],
      ]}
    >
      <p>Next: who should review a change, and how many people.</p>
    </WrapStep>
  );
}
