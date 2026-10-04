"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES, STAGES, type Arch } from "./model";
import type { PipeState } from "./state";

/* 1 ─ A relay race -------------------------------------------------------------------------------- */

export function RelayRace() {
  const legs = [
    "notice you're talking",
    "write down the words",
    "think of a reply",
    "say it out loud",
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="A relay race"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-lg flex-wrap items-center justify-center gap-1.5">
            {legs.map((l, i) => (
              <motion.span
                key={l}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * i }}
                className="flex items-center gap-1.5 text-xs"
              >
                {i > 0 && <span className="text-muted">→</span>}
                <span className="border-line bg-surface rounded-lg border px-3 py-2">{l}</span>
              </motion.span>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A relay race is only as fast as its runners and its baton handoffs. A slow runner or a
        fumbled handoff and the whole team loses time.
      </p>
      <p>
        Most voice assistants are a relay team. One part notices you&apos;re talking, one writes
        down your words, a language model writes a reply, and another voices it. This is a cascaded{" "}
        <Term id="voice-pipeline">voice pipeline</Term>. Newer models run the whole race alone.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One question, five stages ⭐ ---------------------------------------------------------------- */

export function Trace() {
  const [s, set] = useSceneState<PipeState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  const idx = STAGES.findIndex((x) => x.id === f.stage);
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="One question, five stages"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1">
            {STAGES.map((st, i) => (
              <span key={st.id} className="flex items-center gap-1">
                {i > 0 && (
                  <span className={cn("text-xs", i <= idx ? "text-accent" : "text-muted")}>→</span>
                )}
                <motion.span
                  animate={{ scale: i === idx ? 1.08 : 1 }}
                  className={cn(
                    "rounded-lg border px-2 py-1 text-[11px]",
                    i === idx
                      ? "border-accent bg-accent-soft font-semibold"
                      : i < idx
                        ? "border-accent/50 bg-surface"
                        : "border-line bg-surface text-muted",
                  )}
                >
                  {st.label}
                </motion.span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">since you stopped talking</span>
            <div className="bg-surface-2 h-2 flex-1 overflow-hidden rounded-full">
              <motion.div
                animate={{ width: `${(f.t / 1000) * 100}%` }}
                className="bg-accent h-full"
              />
            </div>
            <span className="w-14 font-mono">{f.t} ms</span>
          </div>
          <Code>{f.show}</Code>
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.caption}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <p className="text-subtle text-[10px]">
            Timings illustrative; module 10 builds the full latency budget.
          </p>
        </div>
      }
    >
      <p>
        Follow one question through a cascaded pipeline. A{" "}
        <Term id="vad">voice activity detector</Term> notices speech and decides when you&apos;ve
        finished. <Term id="speech-to-text">Speech-to-text</Term> writes it down, a language model
        replies, and <Term id="text-to-speech">text-to-speech</Term> voices the reply.
      </p>
      <p>
        The trick that makes it fast enough: every stage streams. Nobody waits for the previous
        stage to finish completely; each passes its first results along as soon as it has them.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three ways to build it ---------------------------------------------------------------------- */

const ARCHS: { id: Arch; label: string; flow: string[]; pros: string; cons: string }[] = [
  {
    id: "cascade",
    label: "Cascaded pipeline",
    flow: ["VAD", "speech to text", "language model", "text to speech"],
    pros: "A text transcript at every step; swap in any model; exact scripted wording; easy tool use.",
    cons: "Each handoff adds delay; tone of voice is lost in the text step.",
  },
  {
    id: "s2s",
    label: "Speech-to-speech",
    flow: ["one model: audio in → audio out"],
    pros: "Usually faster; hears and keeps tone, emotion, laughter.",
    cons: "Harder to inspect and control; fewer models to choose from; transcripts are secondary.",
  },
  {
    id: "duplex",
    label: "Full duplex",
    flow: ["one model listening and speaking at the same time"],
    pros: "Like a real phone call: it can say “mm-hm”, overlap and be interrupted naturally.",
    cons: "Newest and least predictable; even harder to control.",
  },
];

export function Architectures() {
  const [s, set] = useSceneState<PipeState>();
  const a = ARCHS.find((x) => x.id === s.arch) ?? ARCHS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways to build it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {ARCHS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.arch === x.id}
                onClick={() => set({ arch: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.arch === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <span className="border-line bg-surface-2 rounded-md border px-2 py-1">🎙 you</span>
              {a.flow.map((n) => (
                <span key={n} className="flex items-center gap-1">
                  <span className="text-muted">→</span>
                  <span className="border-accent bg-accent-soft rounded-md border px-2 py-1">
                    {n}
                  </span>
                </span>
              ))}
              <span className="text-muted">→</span>
              <span className="border-line bg-surface-2 rounded-md border px-2 py-1">🔊 you</span>
            </div>
            <p className="border-good bg-good/10 rounded-lg border px-3 py-2 text-xs">
              <span className="font-semibold">Strengths: </span>
              {a.pros}
            </p>
            <p className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
              <span className="font-semibold">Weaknesses: </span>
              {a.cons}
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        <Term id="speech-to-speech">Speech-to-speech</Term> models skip the text step: one model
        hears audio and answers in audio. Full-duplex models go further and listen while they speak,
        like a phone call rather than a walkie-talkie.
      </p>
      <p>
        Experts disagree on the default. LiveKit recommends pipelines for most production agents
        because they are easier to control; OpenAI promotes its speech-to-speech and live models.
        Many teams start with a pipeline and test both.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Models that listen and speak ---------------------------------------------------------------- */

export function Models() {
  const items: [string, string][] = [
    ["Sept 2024", "Kyutai's Moshi: an early full-duplex research model, with open weights."],
    [
      "Oct 2024",
      "OpenAI's Realtime API in beta; generally available with gpt-realtime in Aug 2025.",
    ],
    ["Dec 2024", "Google's Gemini Live API; native-audio models from May 2025."],
    ["Apr 2025", "Amazon Nova Sonic (English at launch); Nova 2 Sonic in Dec 2025."],
    ["Jul–Sep 2026", "OpenAI's GPT-Live, a full-duplex model, in ChatGPT and then the API."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Models that listen and speak"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[6rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            Model names and versions change several times a year; check current docs.
          </p>
        </div>
      }
    >
      <p>
        Speech-to-speech went from research to every major provider in about two years. Voice
        activity detectors, the small first stage of pipelines, are mature: open-source Silero VAD
        and Google&apos;s WebRTC VAD are widely used.
      </p>
      <p>Module 11 compares cascaded and speech-to-speech systems in depth.</p>
    </StepLayout>
  );
}

/* 5 ─ Pipeline or speech-to-speech? --------------------------------------------------------------- */

export function WhichWins() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pipeline or speech-to-speech?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-arch"
            prompt="Which architecture does each strength belong to?"
            categories={[
              { id: "cascade", label: "Cascaded pipeline" },
              { id: "s2s", label: "Speech-to-speech" },
            ]}
            items={[
              {
                id: "log",
                label: "A text record of exactly what was understood at each step",
                category: "cascade",
                why: "Each stage passes text.",
              },
              {
                id: "tone",
                label: "Hears the caller's tone and answers warmly",
                category: "s2s",
                why: "Audio isn't flattened to text.",
              },
              {
                id: "swap",
                label: "Use any language model you like",
                category: "cascade",
                why: "Parts are interchangeable.",
              },
              {
                id: "fast",
                label: "Usually responds faster",
                category: "s2s",
                why: "No handoffs between models.",
              },
              {
                id: "legal",
                label: "Reads required legal wording exactly as written",
                category: "cascade",
                why: "Text goes straight to synthesis.",
              },
            ]}
            explanation="Pipelines give control and transparency; speech-to-speech gives speed and expressiveness. The right choice depends on what your use case can't do without."
          />
        </div>
      }
    >
      <p>Sort the strengths.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Four stages", "Detect, transcribe, reply, speak."],
  ["Stream everything", "Pass first results along immediately."],
  ["Speech-to-speech", "One model, faster, more expressive."],
  ["Full duplex", "Listening while speaking."],
  ["Control vs speed", "The central trade-off."],
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
      <p>Next: speech recognition, turning sound into words.</p>
    </StepLayout>
  );
}
