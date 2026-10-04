"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { APPROACHES, GRID, LAYERS, type ApproachId } from "./model";
import type { PlatformsState } from "./state";

/* 1 ─ Cook, kit or takeaway ----------------------------------------------------------------------- */

export function Kitchen() {
  const opts: [string, string][] = [
    ["Cook from scratch", "Buy raw ingredients, own every step. Most work, most control."],
    ["Meal kit", "Pre-measured parts from different suppliers; you assemble them."],
    ["Supermarket range", "Everything from one big shop you already use."],
    ["Takeaway", "Order it ready-made. Fastest, but you eat what's on the menu."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Cook, kit or takeaway"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {opts.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        There are four ways to get dinner, and the same four ways to get a voice agent: run open
        models yourself, mix specialist services, take everything from one cloud provider, or rent a
        ready-made agent from a hosted platform.
      </p>
      <p>
        None is &ldquo;right&rdquo;. Most teams start with one and mix in others, swapping parts as
        models get better. The names below are examples, not recommendations.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The voice stack map ⭐ ---------------------------------------------------------------------- */

export function StackMap() {
  const [s, set] = useSceneState<PlatformsState>();
  const grid = GRID[s.approach];
  const owned = LAYERS.filter((l) => grid[l.id].own).length;
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="The voice stack map"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {APPROACHES.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-pressed={s.approach === a.id}
                onClick={() => set({ approach: a.id as ApproachId })}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-left text-[11px] leading-tight",
                  s.approach === a.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {a.name}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{APPROACHES.find((a) => a.id === s.approach)?.blurb}</p>
          <div className="flex flex-col gap-1">
            {LAYERS.map((l, i) => {
              const c = grid[l.id];
              return (
                <motion.div
                  key={`${s.approach}-${l.id}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={cn(
                    "grid grid-cols-[7.5rem_1fr_auto] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
                    c.own
                      ? "border-viz-compute/60 bg-viz-compute/10"
                      : "border-viz-data/60 bg-viz-data/10",
                  )}
                >
                  <span>
                    <span className="block font-semibold">{l.name}</span>
                    <span className="text-subtle text-[10px] leading-tight">{l.job}</span>
                  </span>
                  <span>{c.who}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px]",
                      c.own ? "bg-viz-compute/25" : "bg-viz-data/25",
                    )}
                  >
                    {c.own ? "you run" : "you rent"}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <p className="text-subtle text-[10px]">
            You run {owned} of {LAYERS.length} layers. A speech-to-speech model (OpenAI&apos;s
            Realtime API, Gemini Live, Kyutai&apos;s open Moshi) covers Hear, Think and Speak in
            one.
          </p>
        </div>
      }
    >
      <p>
        Every voice agent has the same layers, from carrying the audio to the phone numbers and
        dashboards. Switch between the four ways of building and see who provides each layer, and
        how much you run yourself.
      </p>
      <p>
        <Term id="open-weights">Open-weights</Term> models such as Whisper (MIT licence) or Kokoro
        (Apache 2.0) run on your own servers, which helps with privacy and cost at scale. A{" "}
        <Term id="hosted-voice-platform">hosted voice platform</Term> hides all of it behind a
        dashboard.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The glue: open frameworks ------------------------------------------------------------------- */

export function Frameworks() {
  const fw: [string, string, string][] = [
    ["Pipecat", "Python, from Daily", "BSD-2-Clause"],
    ["LiveKit Agents", "Python and Node, from LiveKit", "Apache 2.0"],
    ["TEN", "From Agora", "Apache 2.0 plus Agora's extra conditions"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The glue: open frameworks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`# Simplified, Pipecat-style: a voice agent is a chain of parts
pipeline = Pipeline([
    transport.input(),    # audio in (WebRTC or phone)
    stt,                  # any speech-to-text service
    llm,                  # any language model
    tts,                  # any voice
    transport.output(),   # audio out
])`}</Code>
          <div className="flex flex-col gap-1">
            {fw.map(([n, w, l]) => (
              <div
                key={n}
                className="border-line bg-surface grid grid-cols-[7rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-xs sm:grid-cols-[7rem_1fr_1fr]"
              >
                <span className="font-semibold">{n}</span>
                <span className="text-muted">{w}</span>
                <span className="text-muted col-span-2 sm:col-span-1">{l}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A <Term id="voice-framework">voice agent framework</Term> handles the hard real-time
        plumbing from earlier modules: streaming audio, turn detection, interruptions and tool
        calls. Each part is a plug-in, so swapping speech providers is often a one-line change.
      </p>
      <p>
        Check the licence before you ship. Pipecat and LiveKit Agents use standard permissive
        licences; TEN adds conditions of its own, such as not running it on end-user devices.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Build for swapping -------------------------------------------------------------------------- */

export function Swappable() {
  const events: [string, string][] = [
    ["Jul 2025", "Meta buys PlayAI; its PlayHT voice service later closes. Customers had to move."],
    ["Aug 2025", "OpenAI's Realtime API leaves beta, adding phone calls over SIP."],
    ["Sep 2025", "ElevenLabs renames Conversational AI to ElevenLabs Agents."],
    ["Oct 2025", "Deepgram launches Flux, speech-to-text with built-in turn detection."],
    [
      "Jan 2026",
      "Hume AI's CEO and several engineers join Google DeepMind under a licensing deal; Hume carries on.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Build for swapping"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {events.map(([d, t], i) => (
            <motion.div
              key={d + t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Voice moves fast. In one year, a popular voice service closed, products were renamed and new
        kinds of model appeared. Model names change every few months.
      </p>
      <p>
        So avoid <Term id="vendor-lock-in">lock-in</Term>: keep a thin layer of your own code around
        each provider, keep your prompts and test calls in your own repository, and re-test when you
        swap. The next module is about that testing.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which layer? -------------------------------------------------------------------------------- */

export function WhichLayer() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which layer?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-layer"
            prompt="Which part of a voice agent does each provide?"
            categories={[
              { id: "hear", label: "Hear" },
              { id: "speak", label: "Speak" },
              { id: "glue", label: "Glue" },
              { id: "all", label: "All-in-one" },
            ]}
            items={[
              {
                id: "whisper",
                label: "Whisper",
                category: "hear",
                why: "OpenAI's open speech-to-text model.",
              },
              {
                id: "flux",
                label: "Deepgram Flux",
                category: "hear",
                why: "Speech-to-text with turn detection.",
              },
              {
                id: "kokoro",
                label: "Kokoro",
                category: "speak",
                why: "A small open text-to-speech model.",
              },
              {
                id: "cartesia",
                label: "Cartesia Sonic",
                category: "speak",
                why: "A text-to-speech API.",
              },
              {
                id: "pipecat",
                label: "Pipecat",
                category: "glue",
                why: "An open framework that wires the parts together.",
              },
              {
                id: "livekit",
                label: "LiveKit Agents",
                category: "glue",
                why: "An open framework that wires the parts together.",
              },
              {
                id: "realtime",
                label: "OpenAI Realtime API",
                category: "all",
                why: "Speech-to-speech: hears, thinks and speaks.",
              },
              {
                id: "moshi",
                label: "Kyutai Moshi",
                category: "all",
                why: "An open full-duplex speech-to-speech model.",
              },
            ]}
            explanation="Speech-to-text hears, text-to-speech speaks, frameworks glue them together, and speech-to-speech models do all three at once."
          />
        </div>
      }
    >
      <p>Sort the names.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Same layers everywhere", "Carry, hear, think, speak, glue, phones."],
  ["Four ways to build", "Open, specialist mix, one cloud, hosted."],
  ["Frameworks are the glue", "Swap providers in a line."],
  ["Read the licence", "Permissive isn't universal."],
  ["Expect change", "Wrap providers; re-test on swap."],
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
      <p>Next: testing a voice agent with simulated callers before real ones ring.</p>
    </StepLayout>
  );
}
