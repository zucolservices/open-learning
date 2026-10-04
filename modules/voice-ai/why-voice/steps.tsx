"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { feel } from "./model";
import type { WhyState } from "./state";

/* 2 ─ Feel the gap ⭐ ----------------------------------------------------------------------------- */

export function FeelTheGap() {
  const [s, set] = useSceneState<WhyState>();
  const f = feel(s.delay);
  const total = 1600 + s.delay + 2000;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Feel the gap"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <label className="flex items-center gap-3 text-xs">
            <span className="text-muted">reply delay</span>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={s.delay}
              onChange={(e) => set({ delay: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Reply delay in milliseconds"
            />
            <span className="w-16 font-mono font-semibold">{s.delay} ms</span>
          </label>
          <div className="bg-surface-2 relative h-10 rounded">
            <span
              className="bg-viz-data/50 absolute top-1 bottom-1 flex items-center rounded px-2 text-[10px]"
              style={{ left: 0, width: `${(1600 / total) * 100}%` }}
            >
              “Is my order coming today?”
            </span>
            <motion.span
              animate={{ left: `${((1600 + s.delay) / total) * 100}%` }}
              className="bg-accent/60 absolute top-1 bottom-1 flex items-center rounded px-2 text-[10px]"
              style={{ width: `${(2000 / total) * 100}%` }}
            >
              “Yes, by 6 pm.”
            </motion.span>
          </div>
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              f.tone === "good"
                ? "border-good bg-good/10"
                : f.tone === "warn"
                  ? "border-viz-compute bg-viz-compute/10"
                  : "border-bad bg-bad/10",
            )}
          >
            <p className="text-sm font-semibold">{f.label}</p>
            <p className="text-muted text-xs">{f.text}</p>
          </motion.div>
          <div className="text-muted grid grid-cols-4 gap-1 text-center text-[10px]">
            <span>≤ 300 ms: natural</span>
            <span>≤ 800 ms: fine</span>
            <span>≤ 1.5 s: noticeable</span>
            <span>more: broken</span>
          </div>
          <p className="text-subtle text-[10px]">
            A rough guide based on turn-taking research and voice builders&apos; rules of thumb, not
            a standard.
          </p>
        </div>
      }
    >
      <p>
        Drag the delay and imagine the call. Under a third of a second feels like a person. By a
        second and a half, callers wonder if they were heard. At the old voice modes&apos; few
        seconds, people talk over the bot or give up.
      </p>
      <p>
        On a screen, a two-second wait for a chatbot is fine; you can see it typing. On a call,
        silence has meaning, so <Term id="voice-latency">latency</Term> matters far more for voice
        than for text.
      </p>
    </StepLayout>
  );
}

/* 3 ─ From phone menus to talking AI -------------------------------------------------------------- */

export function History() {
  const items: [string, string][] = [
    ["1992", "AT&T rolls out speech recognition on phone calls: “say ‘collect’ or ‘operator’”."],
    ["2011", "Siri arrives on the iPhone 4S."],
    ["2014", "Amazon's Echo puts Alexa in the living room."],
    ["2023", "Voice modes for chat assistants: three models chained, seconds per reply."],
    [
      "2024",
      "GPT-4o shows a model that listens and speaks directly, averaging about 320 ms by OpenAI's measure.",
    ],
    [
      "2025–26",
      "Real-time voice APIs and open-source frameworks make voice agents a mainstream product.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="From phone menus to talking AI"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Talking to computers isn&apos;t new: phone menus have recognised a few words since the
        1990s, and smart speakers followed. What changed is that language models can now hold a real
        conversation.
      </p>
      <p>
        GPT-4o&apos;s voice was announced in May 2024 and reached paying ChatGPT users between July
        and September that year. Since then, many companies have released real-time voice models and
        tools.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where voice AI is used ---------------------------------------------------------------------- */

export function Uses() {
  const items: [string, string][] = [
    ["Contact centres", "Answering calls, booking, rescheduling and routing, around the clock."],
    [
      "Doctors' notes",
      "“Ambient scribes” listen to appointments and draft the notes; one large US health system reported thousands of doctors using them.",
    ],
    ["Cars", "Hands-free assistants that hold a conversation, not just obey commands."],
    [
      "Accessibility",
      "Describing the world to blind users; letting people who can't type use services by voice.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where voice AI is used"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Voice works best where hands and eyes are busy, where people already pick up the phone, or
        where typing is hard. Each brings its own demands: noisy cars, medical vocabulary, callers
        who just want a person.
      </p>
      <p>
        The rest of this track covers how to meet them: listening, speaking, speed, conversation
        design and responsible use.
      </p>
    </StepLayout>
  );
}

/* 5 ─ How would it feel? -------------------------------------------------------------------------- */

export function HowItFeels() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How would it feel?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gap-feel"
            prompt="How would each reply delay feel on a call?"
            categories={[
              { id: "natural", label: "Natural" },
              { id: "noticeable", label: "Noticeable" },
              { id: "broken", label: "Broken" },
            ]}
            items={[
              { id: "200", label: "200 ms", category: "natural", why: "Like a person." },
              {
                id: "1200",
                label: "1.2 seconds",
                category: "noticeable",
                why: "Callers start to wonder.",
              },
              {
                id: "4000",
                label: "4 seconds",
                category: "broken",
                why: "People talk over it or hang up.",
              },
              {
                id: "400",
                label: "400 ms",
                category: "natural",
                why: "Within the usual target range.",
              },
              {
                id: "2800",
                label: "2.8 seconds (early voice modes)",
                category: "broken",
                why: "Far beyond conversational rhythm.",
              },
            ]}
            explanation="People leave gaps of a few hundred milliseconds. Voice agents aim for well under a second; multi-second silences break the conversation."
          />
        </div>
      }
    >
      <p>Sort the delays.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Conversation is fast", "Gaps of about 0–200 ms between people."],
  ["People plan while listening", "Words take ~600 ms to plan."],
  ["Silence has meaning", "Long pauses sound like hesitation."],
  ["Under a second", "The usual target for voice agents."],
  ["Voice is everywhere", "Phones, cars, clinics, accessibility."],
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
      <p>Next: what sound looks like to a computer.</p>
    </StepLayout>
  );
}
