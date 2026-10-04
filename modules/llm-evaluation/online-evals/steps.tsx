"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DAILY, FLAW_RATE, SIGNALS, simulate, type Signal } from "./model";
import type { OnlineState } from "./state";

/* 1 ─ After opening night ------------------------------------------------------------------------- */

export function AfterOpening() {
  return (
    <StepLayout
      eyebrow="Story"
      title="After opening night"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Rehearsals</p>
            <p className="text-muted mt-1">A script, a known audience, every line checked.</p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Every night after</p>
            <p className="text-muted mt-1">
              Real audiences, no script for them. The director still watches from the back.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A play is rehearsed against the script, but the real test is every performance after opening
        night, with audiences nobody scripted. Good directors keep watching.
      </p>
      <p>
        Offline evals are rehearsals: test sets with known answers.{" "}
        <Term id="online-eval">Online evals</Term> score real traffic, which usually has no
        reference answer, so they rely on LLM judges, rules and user feedback.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Watch production ⭐ ------------------------------------------------------------------------- */

export function WatchProd() {
  const [s, set] = useSceneState<OnlineState>();
  const r = simulate({ canary: s.canary, signals: s.signals });
  const toggle = (id: Signal) =>
    set({
      signals: s.signals.includes(id) ? s.signals.filter((x) => x !== id) : [...s.signals, id],
    });
  const max = DAILY * FLAW_RATE;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Watch production"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {[false, true].map((c) => (
              <button
                key={String(c)}
                type="button"
                aria-pressed={s.canary === c}
                onClick={() => set({ canary: c })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.canary === c ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {c ? "Canary: 5% of traffic for 2 days" : "Release to everyone"}
              </button>
            ))}
          </div>
          <div className="grid gap-1 sm:grid-cols-3">
            {SIGNALS.map((g) => (
              <label
                key={g.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                  s.signals.includes(g.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s.signals.includes(g.id)}
                  onChange={() => toggle(g.id)}
                  className="accent-accent mt-0.5"
                />
                <span>
                  {g.name}
                  <span className="text-muted block text-[10px]">{g.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
              {r.days.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1">
                  <div className="bg-surface-2 relative h-16 w-full overflow-hidden rounded">
                    <motion.div
                      className="bg-bad/70 absolute bottom-0 w-full"
                      animate={{ height: `${(d.harmed / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-muted">day {d.day}</span>
                  {s.signals.includes("thumbs") && (
                    <span className={cn(d.thumbsUp > 70 ? "text-good" : "")}>👍 {d.thumbsUp}%</span>
                  )}
                  {s.signals.includes("judge") && (
                    <span className={cn(d.policy < 99 ? "text-bad" : "text-good")}>
                      policy {d.policy}%
                    </span>
                  )}
                  {s.signals.includes("rule") && (
                    <span className={cn(d.harmed ? "text-bad" : "text-good")}>
                      {d.harmed ? "rule fired" : "quiet"}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-subtle mt-1 text-[10px]">
              Red bars: customers given refunds the policy doesn&apos;t allow.
            </p>
          </div>
          <p
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              r.caught ? "border-good bg-good/10" : "border-bad bg-bad/10",
            )}
          >
            {r.caught
              ? `Caught on day ${r.detectDay} and rolled back. About ${r.harmed.toLocaleString("en-IN")} bad refunds.`
              : `Nothing you watched flagged it${s.signals.includes("thumbs") ? ": thumbs-up actually rose" : ""}. Complaints forced a rollback on day ${r.detectDay}, after about ${r.harmed.toLocaleString("en-IN")} bad refunds.`}
          </p>
          <p className="text-subtle text-[10px]">Illustrative: 10,000 conversations a day.</p>
        </div>
      }
    >
      <p>
        You release an update that passed every offline eval. It has a hidden flaw: it agrees to
        refunds the policy doesn&apos;t allow. Customers love it. Choose how to release it and which
        signals to watch.
      </p>
      <p>
        This mirrors OpenAI&apos;s April 2025 GPT-4o update: offline evals and a small A/B test
        looked good, users who tried it liked it, and it was too agreeable. Popular isn&apos;t the
        same as good. A <Term id="canary-release">canary release</Term> limits the damage while the
        right signals catch the problem.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Offline and online, together ---------------------------------------------------------------- */

export function OfflineOnline() {
  const rows: [string, string, string][] = [
    ["Inputs", "Prepared cases", "Real traffic"],
    ["Right answer known?", "Yes, usually", "Rarely"],
    ["Graders", "Code, judges, references", "Judges, rules, user signals"],
    ["When", "Before release", "After release, continuously"],
    ["Catches", "Regressions you predicted", "Problems you didn't"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Offline and online, together"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface overflow-hidden rounded-lg border text-xs">
            <div className="text-muted grid grid-cols-3 px-3 py-1.5 text-[10px]">
              <span />
              <span>Offline</span>
              <span>Online</span>
            </div>
            {rows.map(([k, a, b]) => (
              <div key={k} className="border-line grid grid-cols-3 border-t px-3 py-1.5">
                <span className="text-muted">{k}</span>
                <span>{a}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            Judging every request is expensive, so tools sample (say, 10% of traffic) and filter
            (say, every thumbs-down conversation). Online judges need the same calibration against
            people as offline ones.
          </p>
        </div>
      }
    >
      <p>
        Online evals don&apos;t replace offline ones; they close the loop. Problems found in
        production become new offline cases, so the next release is tested against them.
      </p>
      <p>
        Thumbs feedback is useful but sparse and self-selected: it tells you something went wrong,
        rarely why. Pair it with judges and rules aimed at your success criteria.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Logs hold people's words -------------------------------------------------------------------- */

export function Privacy() {
  const items: [string, string][] = [
    [
      "Redact first",
      "Strip names, phone numbers, card and ID numbers before storing prompts and replies.",
    ],
    [
      "Capture content only when needed",
      "OpenTelemetry's AI conventions make recording prompt and reply text opt-in.",
    ],
    ["Limit access", "Only the people who evaluate need to read conversations."],
    [
      "Set retention",
      "Delete on a schedule, and know your providers' retention too (OpenAI keeps abuse-monitoring logs for up to 30 days by default).",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Logs hold people's words"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Online evaluation means storing and reading real conversations, and people tell assistants
        personal things. Treat logs as sensitive data from the start.
      </p>
      <p>
        Data protection laws such as GDPR and India&apos;s DPDP Act apply to these logs like any
        other personal data.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Offline or online? -------------------------------------------------------------------------- */

export function WhichKind() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Offline or online?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="offline-online"
            prompt="Is each an offline or an online eval?"
            categories={[
              { id: "off", label: "Offline" },
              { id: "on", label: "Online" },
            ]}
            items={[
              {
                id: "ci",
                label: "Running 300 saved cases before merging a prompt change",
                category: "off",
                why: "Prepared cases, before release.",
              },
              {
                id: "judge",
                label: "An LLM judge scoring 10% of yesterday's conversations",
                category: "on",
                why: "Real traffic.",
              },
              {
                id: "thumbs",
                label: "Watching the thumbs-down rate after a release",
                category: "on",
                why: "A live user signal.",
              },
              {
                id: "bench",
                label: "Comparing two models on a held-out test set",
                category: "off",
                why: "Known answers.",
              },
              {
                id: "canary",
                label: "Comparing a 5% canary with the rest of traffic",
                category: "on",
                why: "Live comparison.",
              },
            ]}
            explanation="Offline: prepared cases with known answers, before release. Online: real traffic, after release."
          />
        </div>
      }
    >
      <p>Sort the activities.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Keep evaluating after launch", "Real users find what tests didn't."],
  ["Popular isn't good", "Thumbs-up can rise as quality falls."],
  ["Release gradually", "Canaries limit the damage."],
  ["Sample, filter, calibrate", "Judges on a slice of traffic."],
  ["Protect the logs", "Redact, limit access, delete on schedule."],
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
      <p>Next: a map of the tools that do all this.</p>
    </StepLayout>
  );
}
