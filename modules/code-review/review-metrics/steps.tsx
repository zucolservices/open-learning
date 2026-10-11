"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { METRICS, quarter } from "./model";
import type { MetricsState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Cobra() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Paid by the call"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["The goal", "Customers' problems solved quickly."],
            ["The target", "Support staff rewarded for calls handled per hour."],
            [
              "What happens",
              "Hard calls get transferred or cut short. Customers call back three times.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 2 ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A help desk wants problems solved fast, so it rewards calls per hour. Staff hit the number
        by rushing people off the phone, and customers end up worse off.
      </p>
      <p>
        That&apos;s <Term id="goodharts-law">Goodhart&apos;s law</Term>, in Marilyn Strathern&apos;s
        well-known wording: when a measure becomes a target, it ceases to be a good measure. Review
        metrics are no exception.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulate ⭐ ---------------------------------------------------------------------------------- */

export function Pick() {
  const [s, set] = useSceneState<MetricsState>();
  const q = quarter(s.picked);
  const toggle = (id: string) =>
    set({
      picked: s.picked.includes(id)
        ? s.picked.filter((x) => x !== id)
        : s.picked.length < 3
          ? [...s.picked, id]
          : s.picked,
    });
  const healthy =
    s.picked.length >= 2 &&
    q.effects.every((e) => e.good) &&
    s.picked.includes("first") &&
    s.picked.includes("guard");
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Pick three targets for next quarter"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1 sm:grid-cols-2">
            {METRICS.map((m) => {
              const on = s.picked.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(m.id)}
                  disabled={!on && s.picked.length >= 3}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs disabled:opacity-40",
                    on ? "border-fg bg-surface-2" : "border-line bg-surface",
                  )}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              ["Median wait for review", `${q.wait} h`, q.wait < 20],
              ["Bugs reaching customers", `${q.escaped}`, q.escaped < 10],
              ["Team morale", `${q.morale}/100`, q.morale > 60],
            ].map(([t, v, good]) => (
              <div
                key={t as string}
                className="border-line bg-surface rounded-lg border px-2 py-1.5"
              >
                <p className="text-muted text-[10px]">{t}</p>
                <p className={cn("font-mono font-semibold", good ? "text-good" : "")}>{v}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-1">
            {q.effects.map((e) => (
              <motion.p
                key={e.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "rounded-md border px-2 py-1 text-[11px]",
                  e.good ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                {e.text}
              </motion.p>
            ))}
          </div>
          {healthy && (
            <p className="text-good text-xs">
              A flow goal plus a guardrail, measured for the team, not individuals. Speed improves
              and nothing gets gamed.
            </p>
          )}
        </div>
      }
    >
      <p>
        Your team&apos;s reviews feel slow. Leadership asks you to choose up to three metrics to
        target next quarter. Pick, then read what happens. Starting point: 20 hours&apos; wait, 10
        escaped bugs, morale 60 (all illustrative).
      </p>
      <p>Look for combinations that help without inviting people to game them.</p>
    </StepLayout>
  );
}

/* 3 ─ DORA and SPACE ------------------------------------------------------------------------------- */

export function Frameworks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Measuring flow: DORA and SPACE"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">DORA&apos;s five metrics</p>
            <p className="text-muted mt-1">
              Throughput: change lead time, deployment frequency, failed deployment recovery time.
            </p>
            <p className="text-muted">
              Instability: change fail rate, deployment rework rate (added 2024).
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">SPACE (2021)</p>
            <p className="text-muted mt-1">
              Satisfaction, Performance, Activity, Communication, Efficiency and flow.
            </p>
            <p className="text-muted">
              Use several dimensions together, include surveys, never a single number.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Review time is a big part of change lead time, one of the{" "}
        <Term id="dora-metrics">DORA metrics</Term>. Measuring how long changes wait for review, and
        how big they are, points straight at bottlenecks.
      </p>
      <p>
        SPACE, from researchers at GitHub and Microsoft, warns that activity counts (commits,
        comments, pull requests) tell you little on their own.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Ask questions -------------------------------------------------------------------------------- */

export function Questions() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Use numbers to ask questions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Goal plus guardrail",
              "Meta targeted wait time for its slowest quarter of reviews, with time spent reading as a guardrail against rubber-stamping.",
            ],
            ["Teams, not people", "Never rank individuals by review activity."],
            ["Percentiles, not averages", "A few stuck changes cause most of the pain."],
            [
              "Numbers start conversations",
              "“Why did reviews slow down in March?” beats “who reviewed least?”",
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
        No study names &ldquo;comments per reviewer&rdquo; as an anti-pattern, but the reasoning
        follows from Goodhart&apos;s law: reward comments and you get nitpicks; punish them and you
        get silent approvals.
      </p>
      <p>The healthiest teams share their numbers openly and use them to improve the system.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function MetricsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Signal or game?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-metrics"
            prompt="Is each a useful team signal, or likely to be gamed?"
            categories={[
              { id: "signal", label: "Useful signal" },
              { id: "game", label: "Likely gamed" },
            ]}
            items={[
              {
                id: "wait",
                label: "How long the slowest quarter of changes wait for review",
                category: "signal",
                why: "Points at bottlenecks in the system.",
              },
              {
                id: "lines",
                label: "Reviewers ranked by lines reviewed",
                category: "game",
                why: "Rewards skimming big changes.",
              },
              {
                id: "size",
                label: "Median pull request size, for the team",
                category: "signal",
                why: "A leading indicator of fast review.",
              },
              {
                id: "bonus",
                label: "A bonus for the most bugs found in review",
                category: "game",
                why: "Invites arguments and hiding.",
              },
              {
                id: "survey",
                label: "A quarterly survey: is review helping you?",
                category: "signal",
                why: "Catches what numbers miss.",
              },
            ]}
            explanation="Team-level flow measures and surveys help you ask good questions. Anything that ranks or rewards individuals by activity invites gaming."
          />
        </div>
      }
    >
      <p>Sort each metric.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Targets get gamed", "Goodhart's law."],
        ["Measure flow", "Wait time and change size."],
        ["Pair with a guardrail", "Speed plus real reading."],
        ["Teams, not people", "Never rank reviewers."],
        ["Ask, don't judge", "Numbers start conversations."],
      ]}
    >
      <p>That ends the culture chapter. Next: the capstone, a full review from start to finish.</p>
    </WrapStep>
  );
}
