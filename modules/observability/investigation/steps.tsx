"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { STAGES } from "./model";
import type { InvState } from "./state";

/* 1 ─ Work the incident ⭐ ------------------------------------------------------------------------ */

export function WorkIt() {
  const [s, set] = useSceneState<InvState>();
  const picks = s.picks ?? [];
  // A stage is passed once its good option has been picked.
  let stage = 0;
  for (const st of STAGES) {
    const good = st.options.find((o) => o.good)!;
    if (picks.includes(good.id)) stage++;
    else break;
  }
  const allOptions = STAGES.flatMap((st) => st.options);
  const chosen = picks.map((id) => allOptions.find((o) => o.id === id)!).filter(Boolean);
  const minutes = chosen.reduce((n, o) => n + o.minutes, 0);
  const done = stage >= STAGES.length;
  const current = STAGES[Math.min(stage, STAGES.length - 1)];
  const lastPick = chosen[chosen.length - 1];
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Work the incident"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs">
              time spent:{" "}
              <span className={cn("font-semibold", minutes > 30 && "text-bad")}>{minutes} min</span>
            </p>
            {picks.length > 0 && (
              <button
                type="button"
                onClick={() => set({ picks: [] })}
                className="text-muted flex items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Start again
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {chosen.map((o, i) => (
              <motion.p
                key={`${o.id}-${i}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn("font-mono text-[10px]", o.good ? "text-good" : "text-bad")}
              >
                {o.good ? "✓" : "✗"} {o.label} (+{o.minutes} min)
              </motion.p>
            ))}
          </div>
          {lastPick && (
            <motion.div
              key={picks.length}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                lastPick.good ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              {lastPick.anti && (
                <p className="text-bad mb-1 text-xs font-semibold">{lastPick.anti}</p>
              )}
              {lastPick.result}
            </motion.div>
          )}
          {!done ? (
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-accent font-mono text-xs">{current.title}</p>
              <p className="mt-1 text-sm font-semibold">{current.prompt}</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {current.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    disabled={picks.includes(o.id)}
                    onClick={() => set({ picks: [...picks, o.id] })}
                    className="border-line hover:bg-surface-2 rounded-lg border px-3 py-1.5 text-left text-xs disabled:opacity-40"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-good text-sm">
              Cause found in {minutes} minutes, with users affected for only part of that. Tomorrow:
              a check in the pipeline that every setting the new version needs exists in production.
            </p>
          )}
        </div>
      }
    >
      <p>
        21:02, and you&apos;re paged. Work the incident one decision at a time. Bad moves cost time
        and are named after the anti-methods Brendan Gregg catalogued.
      </p>
      <p>
        The good path is a loop: look broadly, form a hypothesis, narrow down with more detailed
        data, check. Honeycomb calls it the <Term id="core-analysis-loop">core analysis loop</Term>:
        &ldquo;the process of using your telemetry to form hypotheses and to validate or invalidate
        them with data&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Methods and anti-methods -------------------------------------------------------------------- */

const ANTI: [string, string][] = [
  [
    "Streetlight Anti-Method",
    "Run the tools you happen to know and look for obvious issues: searching where the light is, not where you dropped the keys.",
  ],
  ["Drunk Man Anti-Method", '"Change things at random until the problem goes away."'],
  [
    "Blame-Someone-Else Anti-Method",
    "Decide it's another team's component and hand it over, until they prove otherwise.",
  ],
];

const METHODS: [string, string][] = [
  [
    "Drill-Down Analysis Method",
    "Start at the top (the user symptom) and narrow down layer by layer.",
  ],
  [
    "USE and RED",
    "Check every resource's utilisation, saturation and errors; every service's rate, errors and duration.",
  ],
  ["Scientific Method", "Question, hypothesis, prediction, test, analysis."],
];

export function Methods() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Methods and anti-methods"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-bad text-xs font-semibold">Anti-methods</p>
            {ANTI.map(([t, d]) => (
              <div key={t} className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-2">
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-good text-xs font-semibold">Methods</p>
            {METHODS.map(([t, d]) => (
              <div key={t} className="border-good/40 bg-good/5 rounded-lg border px-3 py-2">
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Brendan Gregg, a performance engineer, collected the common ways people investigate
        problems, the bad ones as well as the good. Recognising an anti-method in yourself under
        pressure is half the battle.
      </p>
      <p>
        And beware correlation: version 7.4 matching every failure was a strong clue, but the trace
        and the log line were the proof.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Fly the plane first ------------------------------------------------------------------------- */

export function FlyThePlane() {
  return (
    <StepLayout
      eyebrow="Principle"
      title="Fly the plane first"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <blockquote className="border-accent bg-surface rounded-r-xl border-l-2 px-4 py-3">
            <p className="text-sm">
              &ldquo;Your first response in a major outage may be to start troubleshooting and try
              to find a root cause as quickly as possible. Ignore that instinct! Instead, your
              course of action should be to make the system work as well as it can under the
              circumstances.&rdquo;
            </p>
            <p className="text-muted mt-1 text-xs">
              — Google, Site Reliability Engineering, ch. 12
            </p>
          </blockquote>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {["Problem report", "Triage", "Examine", "Diagnose", "Test and treat", "Cure"].map(
              (x, i) => (
                <span key={x} className="flex items-center gap-1">
                  {i > 0 && <span className="text-muted">→</span>}
                  <span className="border-line bg-surface rounded-md border px-2 py-1">{x}</span>
                </span>
              ),
            )}
          </div>
        </div>
      }
    >
      <p>
        Pilots are taught that in an emergency their first job is to fly the aeroplane. For an
        incident, that means <Term id="mitigation">mitigation</Term> (roll back, switch off a flag,
        shift traffic) before the root cause.
      </p>
      <p>
        The SRE book&apos;s troubleshooting flow puts triage before diagnosis for the same reason:
        &ldquo;Stopping the bleeding should be your first priority; you aren&apos;t helping your
        users if the system dies while you&apos;re root-causing.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 4 ─ Good move or anti-method? ------------------------------------------------------------------- */

export function GoodOrAnti() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good move or anti-method?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="good-or-anti"
            prompt="Is each move a sound investigative step or an anti-method?"
            categories={[
              { id: "good", label: "Sound step" },
              { id: "anti", label: "Anti-method" },
            ]}
            items={[
              {
                id: "slice",
                label: "Comparing failing and succeeding requests by every attribute",
                category: "good",
                why: "Systematic: let the data show which dimension explains the failures.",
              },
              {
                id: "hyp",
                label: "Stating a hypothesis and the evidence that would disprove it",
                category: "good",
                why: "The scientific method: predictions you can test.",
              },
              {
                id: "mitigate",
                label: "Rolling back the latest release while you investigate",
                category: "good",
                why: "Stop the bleeding first.",
              },
              {
                id: "tune",
                label: "Tweaking settings one by one until errors stop",
                category: "anti",
                why: "Random change: slow, risky and teaches you nothing.",
              },
              {
                id: "network",
                label: "Declaring it a network problem and handing it to that team",
                category: "anti",
                why: "Blame-someone-else, without evidence.",
              },
              {
                id: "favtool",
                label: "Running your favourite tool because it's the one you know",
                category: "anti",
                why: "The streetlight effect: looking where it's easy, not where the problem is.",
              },
            ]}
            explanation="Good investigation is systematic and evidence-led; anti-methods feel busy but rely on luck, habit or other people."
          />
        </div>
      }
    >
      <p>Under pressure, everyone drifts towards the anti-methods. Name them to resist them.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Impact first", "Golden signals: how bad, for whom."],
  ["Slice to narrow", "Break errors down by attribute until one stands out."],
  ["Mitigate early", "Roll back or switch off, then investigate."],
  ["Prove the cause", "A trace and its logs confirm what correlation suggests."],
  ["Avoid anti-methods", "No random changes, no blame, no streetlights."],
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
      <p>
        Telemetry made this fast: an SLO alert that fired on user pain, request attributes to slice
        by, traces linked to logs. Next: what the rest of the team does while you investigate.
      </p>
    </StepLayout>
  );
}
