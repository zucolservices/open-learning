"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { budget } from "./model";
import type { LatState } from "./state";

/* 1 ─ Thirty minutes or it's free ----------------------------------------------------------------- */

export function Pizza() {
  const parts: [string, number][] = [
    ["Take the order", 3],
    ["Make the pizza", 8],
    ["Bake", 10],
    ["Box it", 2],
    ["Drive", 7],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Thirty minutes or it's free"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex h-10 overflow-hidden rounded-lg">
            {parts.map(([l, m], i) => (
              <motion.div
                key={l}
                initial={{ width: 0 }}
                animate={{ width: `${(m / 30) * 100}%` }}
                transition={{ delay: 0.15 * i }}
                className={cn(
                  "flex items-center justify-center text-[10px]",
                  i % 2 ? "bg-accent/40" : "bg-viz-data/40",
                )}
              >
                {l} · {m}m
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-center text-xs">
            Every step has a share of the thirty minutes.
          </p>
        </div>
      }
    >
      <p>
        A pizza shop promising delivery in thirty minutes plans each step: three minutes to take the
        order, ten to bake, seven to drive. If baking runs long, something else must get faster.
      </p>
      <p>
        A voice agent works the same way. From the moment you stop talking, every stage takes a
        slice of the time before you hear a reply. Adding them up gives the{" "}
        <Term id="latency-budget">latency budget</Term>, and keeping the total under about a second
        is the core engineering challenge of voice AI.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build the latency budget ⭐ ----------------------------------------------------------------- */

export function Budget() {
  const [s, set] = useSceneState<LatState>();
  const b = budget({
    semantic: s.semantic,
    smallModel: s.smallModel,
    cache: s.cache,
    stream: s.stream,
    colocate: s.colocate,
  });
  const max = 2900;
  const toggles: [keyof LatState, string][] = [
    ["stream", "Stream the reply into speech, sentence by sentence"],
    ["semantic", "Semantic turn detection instead of a fixed silence"],
    ["smallModel", "A smaller, faster model for this conversation"],
    ["cache", "Cache the unchanging start of the prompt"],
    ["colocate", "Run everything in one region, near callers"],
  ];
  const tone = b.total <= 800 ? "good" : b.total <= 1500 ? "warn" : "bad";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Build the latency budget"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {toggles.map(([k, l]) => (
              <label key={k} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={s[k] as boolean}
                  onChange={(e) => set({ [k]: e.target.checked })}
                  className="accent-accent"
                />
                {l}
              </label>
            ))}
          </div>
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3">
            {b.stages.map((st) => (
              <div
                key={st.id}
                className="grid grid-cols-[minmax(0,11rem)_1fr_3.5rem] items-center gap-2 text-[11px]"
              >
                <span className="truncate">{st.label}</span>
                <span className="bg-surface-2 h-2.5 overflow-hidden rounded">
                  <motion.span
                    layout
                    className={cn("block h-full rounded", st.big ? "bg-accent" : "bg-viz-data/60")}
                    style={{ width: `${(st.ms / 1200) * 100}%` }}
                  />
                </span>
                <span className="text-right font-mono">{st.ms} ms</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-surface-2 relative h-4 flex-1 overflow-hidden rounded-full">
              <motion.div
                animate={{ width: `${Math.min(100, (b.total / max) * 100)}%` }}
                className={cn(
                  "h-full",
                  tone === "good" ? "bg-good" : tone === "warn" ? "bg-viz-compute" : "bg-bad",
                )}
              />
              <span
                className="border-fg/40 absolute top-0 h-full border-l border-dashed"
                style={{ left: `${(800 / max) * 100}%` }}
              />
            </div>
            <span
              className={cn(
                "w-20 font-mono text-lg font-semibold",
                tone === "good" ? "text-good" : tone === "bad" ? "text-bad" : "",
              )}
            >
              {b.total} ms
            </span>
          </div>
          <p className="text-muted text-[11px]">
            {tone === "good"
              ? "Under 800 ms: feels conversational."
              : tone === "warn"
                ? "Usable, like many voice agents today (often around 1.1–1.3 s), but noticeable."
                : "Too slow: callers will talk over it or give up."}{" "}
            Dashed line: 800 ms.
          </p>
          <p className="text-subtle text-[10px]">
            Illustrative numbers, shaped by vendor breakdowns from Pipecat, Twilio and others.
          </p>
        </div>
      }
    >
      <p>
        Here&apos;s one turn of a cascaded voice agent, from the moment you stop talking until you
        hear the first sound. Start by switching on streaming, then work through the other levers.
        Which ones save the most?
      </p>
      <p>
        Two slices dominate: deciding you&apos;ve finished (endpointing) and the language
        model&apos;s <Term id="ttft">time to first token</Term>. The network matters too: services
        far apart add a round trip twice over.
      </p>
    </StepLayout>
  );
}

/* 3 ─ A published breakdown ----------------------------------------------------------------------- */

export function Breakdown() {
  const rows: [string, number][] = [
    ["Transcription and endpointing", 300],
    ["LLM time to first byte", 650],
    ["TTS time to first byte", 120],
    ["Audio, encoding and network (several steps)", 223],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="A published breakdown"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([l, m], i) => (
            <div key={l} className="grid grid-cols-[1fr_4rem] items-center gap-2 text-xs">
              <div>
                <p>{l}</p>
                <div className="bg-surface-2 mt-1 h-2 overflow-hidden rounded">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(m / 700) * 100}%` }}
                    transition={{ delay: 0.1 * i }}
                    className="bg-accent h-full"
                  />
                </div>
              </div>
              <span className="text-right font-mono">{m} ms</span>
            </div>
          ))}
          <p className="border-line mt-2 border-t pt-2 text-right font-mono text-sm font-semibold">
            ≈ 1,293 ms
          </p>
          <p className="text-subtle text-[10px]">
            Pipecat&apos;s voice AI guide (updated June 2026), a vendor estimate for a typical
            cascaded agent.
          </p>
        </div>
      }
    >
      <p>
        Pipecat&apos;s open guide to voice agents adds up a typical cascaded pipeline to about 1.3
        seconds, and calls 1.5 seconds an important target. Twilio describes about 1.1 seconds for a
        well-built agent. Its rule of thumb: keep the language model&apos;s time to first token at
        or under about 600 ms.
      </p>
      <p>
        A tuned, fully colocated demo by Daily in 2024 reached about 700 ms. These are vendor
        numbers and move every few months as models get faster, but the shape of the budget is
        stable.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Measure what callers hear ------------------------------------------------------------------- */

export function Measure() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Measure what callers hear"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[10px]">RECORDING OF A CALL</p>
            <div className="mt-2 flex h-10 items-center gap-0.5">
              {Array.from({ length: 60 }, (_, i) => {
                const user = i < 22;
                const bot = i > 36;
                const h = user || bot ? 30 + 60 * Math.abs(Math.sin(i * 1.3)) : 4;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-sm",
                      user ? "bg-viz-data" : bot ? "bg-accent" : "bg-surface-2",
                    )}
                    style={{ height: `${h}%` }}
                  />
                );
              })}
            </div>
            <div className="text-muted mt-1 flex justify-between text-[10px]">
              <span>caller speaking</span>
              <span>← the gap you measure →</span>
              <span>agent speaking</span>
            </div>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">A different number</p>
            <p className="text-muted">
              The phone-network standard ITU-T G.114 (2003) says one-way transmission under 150 ms
              feels transparent. That&apos;s the delay of the line itself, not an AI&apos;s thinking
              time, so don&apos;t confuse the two.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Providers&apos; latency figures usually cover only their own model. What matters is the gap
        the caller hears, so measure it from the outside: record test calls and measure from the end
        of the caller&apos;s speech to the start of the agent&apos;s, across many calls, and watch
        the slow ones (the 95th percentile), not just the average.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What would you fix first? ------------------------------------------------------------------- */

export function FirstFix() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What would you fix first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="latency-first"
            prompt="Your voice agent replies after 1.9 seconds. Profiling shows: endpointing 300 ms, transcript 80 ms, model's first token 1,100 ms, speech synthesis 110 ms, network 200 ms. What should you tackle first?"
            options={[
              {
                id: "tts",
                label: "Switch to a faster speech-synthesis provider",
                feedback: "Synthesis is only 110 ms; even halving it barely helps.",
              },
              {
                id: "llm",
                label:
                  "Cut the model's time to first token: a smaller model for this step, a shorter or cached prompt",
                correct: true,
                feedback:
                  "Yes: at 1,100 ms it's over half the budget, and well above the ~600 ms rule of thumb.",
              },
              {
                id: "net",
                label: "Move servers closer to callers",
                feedback: "Worth doing, but the network is 200 ms; the model is the big slice.",
              },
              {
                id: "endpoint",
                label: "Reply before the caller finishes speaking",
                feedback:
                  "That trades latency for interrupting people; the model is the real bottleneck here.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Every stage takes a slice", "Add them up: the latency budget."],
  ["Two big slices", "Endpointing and the model's first token."],
  ["Stream everything", "Never wait for a whole reply."],
  ["Colocate", "Network round trips count twice."],
  ["Measure from outside", "What callers hear, at the 95th percentile."],
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
      <p>Next: speech-to-speech models, which collapse several stages into one.</p>
    </StepLayout>
  );
}
