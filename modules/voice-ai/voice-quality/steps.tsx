"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PERSONAS, dashboard, runCalls, type PersonaId } from "./model";
import type { QualityState } from "./state";

/* 1 ─ Mystery shoppers ---------------------------------------------------------------------------- */

export function MysteryShopper() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Mystery shoppers"
      stage={
        <div className="flex flex-1 flex-wrap content-center items-center justify-center gap-2">
          {PERSONAS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface w-36 rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-muted text-[11px]">{p.detail}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Shops hire mystery shoppers: people who pose as customers, some polite, some difficult, to
        see how staff really cope. Testing only with your friendliest customer would tell you
        nothing.
      </p>
      <p>
        Voice agents get the same treatment. A <Term id="simulated-caller">simulated caller</Term>{" "}
        is an AI that plays a caller with a goal and a personality, rings your agent, and reports
        whether the goal was met. You can run hundreds before a real person ever calls.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulated callers ⭐ ------------------------------------------------------------------------ */

export function SimCallers() {
  const [s, set] = useSceneState<QualityState>();
  const calls = runCalls(s.personas, s.v2);
  const d = dashboard(calls, s.hangupsContained);
  const toggle = (id: PersonaId) =>
    set({
      personas: s.personas.includes(id) ? s.personas.filter((x) => x !== id) : [...s.personas, id],
    });
  const maxLat = 4000;
  const fails = PERSONAS.filter(
    (p) => s.personas.includes(p.id) && p.fail && (s.v2 ? p.v2 : p.v1).done < 0.85,
  );
  const tiles: [string, string, string?][] = [
    ["Task completed", `${d.completion}%`],
    [
      "Contained (no person)",
      `${d.containment}%`,
      s.hangupsContained && d.hangup ? `includes ${d.hangup}% hang-ups` : undefined,
    ],
    ["Handed to a person", `${d.transfer}%`],
    ["Word error rate", `${d.wer}%`],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Simulated callers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={s.personas.includes(p.id)}
                onClick={() => toggle(p.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.personas.includes(p.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line text-muted",
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.v2}
                onChange={(e) => set({ v2: e.target.checked })}
                className="accent-accent"
              />
              Agent v2: noise suppression, semantic turn detection, applies corrections
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.hangupsContained}
                onChange={(e) => set({ hangupsContained: e.target.checked })}
                className="accent-accent"
              />
              Count hang-ups as &ldquo;contained&rdquo;
            </label>
          </div>
          {d.n === 0 ? (
            <p className="text-muted text-xs">Pick at least one kind of caller.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {tiles.map(([k, v, note]) => (
                  <div key={k} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                    <p className="text-subtle text-[10px]">{k}</p>
                    <p className="font-mono text-lg">{v}</p>
                    {note && <p className="text-bad text-[10px]">{note}</p>}
                  </div>
                ))}
              </div>
              <div className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-subtle text-[10px]">
                  Voice-to-voice latency, one dot per call ({d.n} calls)
                </p>
                <div className="relative mt-2 h-6">
                  {calls.map((c, i) => (
                    <span
                      key={i}
                      className={cn(
                        "absolute h-2 w-2 -translate-x-1/2 rounded-full opacity-70",
                        c.outcome === "done"
                          ? "bg-viz-data"
                          : c.outcome === "transfer"
                            ? "bg-viz-meta"
                            : "bg-bad",
                      )}
                      style={{
                        left: `${Math.min(99, (c.latency / maxLat) * 100)}%`,
                        top: `${(i % 4) * 4}px`,
                      }}
                    />
                  ))}
                  {[
                    ["p50", d.p50],
                    ["p95", d.p95],
                  ].map(([k, v]) => (
                    <span
                      key={k as string}
                      className="border-fg absolute top-0 bottom-0 border-l border-dashed"
                      style={{ left: `${Math.min(99, ((v as number) / maxLat) * 100)}%` }}
                    >
                      <span className="bg-surface absolute -bottom-5 -translate-x-1/2 font-mono text-[9px]">
                        {k} {v}
                      </span>
                    </span>
                  ))}
                </div>
                <p className="text-muted mt-5 text-[10px]">
                  Average {d.mean} ms, which hides the slow tail. 0 to 4 s scale. Colour:{" "}
                  <span className="text-viz-data">completed</span>,{" "}
                  <span className="text-viz-meta">handed over</span>,{" "}
                  <span className="text-bad">hung up</span>.
                </p>
              </div>
              {fails.length > 0 && (
                <div className="flex flex-col gap-1">
                  {fails.map((p) => (
                    <p
                      key={p.id}
                      className="border-bad/50 bg-bad/5 rounded-lg border px-2.5 py-1 text-[11px]"
                    >
                      <span className="font-semibold">{p.name}: </span>
                      {p.fail}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
          <p className="text-subtle text-[10px]">Illustrative test run.</p>
        </div>
      }
    >
      <p>
        You start by testing with calm callers, and the agent looks great. Add the other kinds of
        caller and watch the dashboard change. Then switch on v2, which fixes what the tests found.
      </p>
      <p>
        Watch <Term id="containment-rate">containment</Term> too. If a hang-up counts as
        &ldquo;contained&rdquo; because no person was needed, a frustrating agent can look like a
        success. Always read it next to task completion.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Numbers that match what callers feel -------------------------------------------------------- */

export function Numbers() {
  const lat = [700, 750, 760, 800, 820, 850, 880, 900, 2900, 3400];
  const mean = Math.round(lat.reduce((a, b) => a + b, 0) / lat.length);
  const rows: [string, string][] = [
    [
      "Word error rate (WER)",
      "(substituted + deleted + inserted words) ÷ words actually said. Lower is better; it can exceed 100%.",
    ],
    [
      "Voice-to-voice latency",
      "From the caller finishing to hearing the reply. A vendor's “model latency” usually leaves out turn detection and network time.",
    ],
    [
      "Task completion",
      "Did the caller get what they rang for? You define what “done” means for each task.",
    ],
    ["Average handling time", "Talk + hold + follow-up work, the classic contact-centre measure."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Numbers that match what callers feel"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted text-[11px]">Ten calls (ms)</p>
            <div className="mt-1 flex flex-wrap gap-1 font-mono">
              {lat.map((l, i) => (
                <span
                  key={i}
                  className={cn("rounded px-1.5 py-0.5", l > 2000 ? "bg-bad/20" : "bg-surface-2")}
                >
                  {l}
                </span>
              ))}
            </div>
            <p className="mt-2">
              Average <span className="font-mono">{mean}</span> · p50{" "}
              <span className="font-mono">850</span> · p90 <span className="font-mono">2900</span>
            </p>
            <p className="text-muted mt-1 text-[11px]">
              The average describes no actual call. p50 is the typical caller; the high percentiles
              are the two who waited three seconds.
            </p>
          </div>
          {rows.map(([t, d]) => (
            <div key={t} className="text-xs">
              <span className="font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Report speed as <Term id="percentile">percentiles</Term>, not averages: p50 is the typical
        call, p95 the bad-but-common case. Callers remember the slow ones.
      </p>
      <p>
        Accuracy has its own measure, <Term id="wer">WER</Term>, but what matters most is whether
        the caller got what they needed. Testing tools such as Coval, Hamming and Cekura, and
        features built into hosted platforms, run simulated callers and report these numbers.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Recording, privacy and disclosure ----------------------------------------------------------- */

export function Recording() {
  const rows: [string, string][] = [
    [
      "Consent to record",
      "US federal law needs one party's consent, but California and about a dozen other states need everyone's. Other countries have their own rules.",
    ],
    [
      "Privacy (GDPR)",
      "Recording needs a lawful basis. A recording becomes sensitive biometric data when it's used to identify who someone is, such as a voiceprint, which needs extra justification.",
    ],
    [
      "Saying it's an AI",
      "The EU AI Act requires telling people they're talking to AI, at first contact, unless it's obvious (from 2 Aug 2026).",
    ],
    [
      "Calling people",
      "In the US, AI-generated voices count as “artificial” under robocall law, so outbound AI calls need prior consent, identification and an opt-out.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Recording, privacy and disclosure"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            &ldquo;Hi, I&apos;m the clinic&apos;s AI assistant. This call may be recorded to improve
            our service.&rdquo;
          </p>
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">A summary, not legal advice.</p>
        </div>
      }
    >
      <p>
        To improve an agent you need real calls to review, and recording them brings duties. The
        safe pattern is one line at the start of every call: say it&apos;s an AI and that the call
        may be recorded.
      </p>
      <p>
        Then keep recordings only as long as you need them, restrict who can listen, and strip out
        card numbers and other sensitive details before they reach your logs.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which number answers it? -------------------------------------------------------------------- */

export function WhichNumber() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which number answers it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-number"
            prompt="Which measure answers each question?"
            categories={[
              { id: "lat", label: "Latency percentiles" },
              { id: "wer", label: "WER" },
              { id: "task", label: "Task completion" },
              { id: "xfer", label: "Transfer rate" },
            ]}
            items={[
              {
                id: "typical",
                label: "Is the agent quick for a typical caller?",
                category: "lat",
                why: "p50 latency.",
              },
              {
                id: "slow",
                label: "How long do the unluckiest callers wait?",
                category: "lat",
                why: "p95 latency.",
              },
              {
                id: "heard",
                label: "Is it hearing the words correctly?",
                category: "wer",
                why: "Word error rate.",
              },
              {
                id: "got",
                label: "Did callers get their booking made?",
                category: "task",
                why: "Task completion, defined per task.",
              },
              {
                id: "human",
                label: "How often does a person have to take over?",
                category: "xfer",
                why: "Transfer rate.",
              },
            ]}
            explanation="Speed: percentiles. Hearing: WER. Success: task completion. And watch transfers and hang-ups so containment can't fool you."
          />
        </div>
      }
    >
      <p>Sort the questions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Test with difficult callers", "Noise, accents, interruptions, changes of mind."],
  ["Percentiles, not averages", "p50 and p95."],
  ["Completion beside containment", "Hang-ups aren't successes."],
  ["Record with care", "Consent, privacy, retention."],
  ["Say it's an AI", "At the start of every call."],
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
      <p>Next: putting the whole course together in one design, a clinic&apos;s phone line.</p>
    </StepLayout>
  );
}
