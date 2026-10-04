"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { OUTCOME, SCENARIOS, TRAITS, type Arch } from "./model";
import type { S2sState } from "./state";

/* 1 ─ Interpreter or bilingual friend? ------------------------------------------------------------ */

export function Interpreter() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Interpreter or bilingual friend?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Through an interpreter</p>
            <p className="text-muted mt-1">
              Everything is written down and translated precisely. Slower, and the tone of voice
              gets lost, but there&apos;s a record.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">With a bilingual friend</p>
            <p className="text-muted mt-1">
              Quick and natural; they hear the hesitation and the joke. But nobody wrote anything
              down.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Talking through an interpreter who writes everything down is precise but slow, and flattens
        tone. Talking with a friend who speaks both languages is quick and natural, but leaves no
        record.
      </p>
      <p>
        A cascaded pipeline is the interpreter: speech becomes text, text becomes speech. A{" "}
        <Term id="speech-to-speech">speech-to-speech model</Term> is the friend: one model hears
        audio and answers in audio, with no text step in between.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The same call, two ways ⭐ ------------------------------------------------------------------ */

export function SameCall() {
  const [s, set] = useSceneState<S2sState>();
  const sc = SCENARIOS.find((x) => x.id === s.scenario) ?? SCENARIOS[0];
  const o = OUTCOME[sc.id][s.arch];
  const other = OUTCOME[sc.id][s.arch === "cascade" ? "s2s" : "cascade"];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The same call, two ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {SCENARIOS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.scenario === x.id}
                onClick={() => set({ scenario: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.scenario === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <p className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs italic">
            {sc.setup}
          </p>
          <div className="flex gap-1">
            {(
              [
                ["cascade", "Cascaded pipeline"],
                ["s2s", "Speech-to-speech"],
              ] as [Arch, string][]
            ).map(([k, l]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.arch === k}
                onClick={() => set({ arch: k })}
                className={cn(
                  "flex-1 rounded-md border px-2 py-1.5 text-xs",
                  s.arch === k ? "border-accent bg-accent-soft font-semibold" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <motion.div
            key={`${sc.id}-${s.arch}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              o.good ? "border-good bg-good/10" : "border-bad bg-bad/10",
            )}
          >
            <p className="text-sm">{o.text}</p>
            <p className="text-muted mt-2 text-xs">
              Reply starts after about <span className="font-mono font-semibold">{o.ms} ms</span>{" "}
              (the other architecture: {other.ms} ms).
            </p>
          </motion.div>
          <p className="text-subtle text-[10px]">Illustrative outcomes and timings.</p>
        </div>
      }
    >
      <p>
        Try each call both ways. The speech-to-speech model shines with the upset caller: it hears
        the shaking voice and responds to it, and it answers faster.
      </p>
      <p>
        But with the legal disclosure, the pipeline wins: your code controls the exact words spoken
        and keeps a record. Neither architecture is better everywhere.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What you gain and lose ---------------------------------------------------------------------- */

export function Traits() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What you gain and lose"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="text-muted grid grid-cols-[1fr_6rem_6rem] gap-2 px-3 text-[10px]">
            <span />
            <span className="text-center">Pipeline</span>
            <span className="text-center">Speech-to-speech</span>
          </div>
          {TRAITS.map(([t, c, s], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface grid grid-cols-[1fr_6rem_6rem] items-center gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span>{t}</span>
              <span className={cn("text-center font-semibold", c ? "text-good" : "text-muted")}>
                {c ? "✓" : "–"}
              </span>
              <span className={cn("text-center font-semibold", s ? "text-good" : "text-muted")}>
                {s ? "✓" : "–"}
              </span>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            Simplified: real systems blur these lines, and some offer hybrids.
          </p>
        </div>
      }
    >
      <p>
        OpenAI&apos;s own guide (2025) summarised it this way: speech-to-speech is lower latency and
        more natural, and can hear emotion; the chained pipeline gives a transcript at every step,
        more control and predictability, and an easy way to add voice to an existing text agent.
      </p>
      <p>
        Hybrids exist too: some systems take speech in but write text out, then synthesise it,
        keeping control of the words while hearing the caller&apos;s tone.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Speech-to-speech models today --------------------------------------------------------------- */

export function Landscape() {
  const items: [string, string][] = [
    [
      "OpenAI",
      "Realtime API (beta Oct 2024; generally available with gpt-realtime Aug 2025, adding phone calls and tools); reasoning realtime models in 2026; GPT-Live-1, full duplex, Sept 2026.",
    ],
    [
      "Google",
      "Gemini Live API since Dec 2024, with features such as affective dialogue (matching your tone) and proactive audio (ignoring speech not meant for it) on some models.",
    ],
    [
      "Kyutai",
      "Moshi (Sept 2024): an open-weights, full-duplex research model, about 200 ms in practice.",
    ],
    [
      "Amazon and Microsoft",
      "Nova Sonic and Nova 2 Sonic on AWS (2025); Azure Voice Live, which can run a speech-to-speech model or a cascade behind one interface.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Speech-to-speech models today"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {items.map(([t, d], i) => (
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
        </div>
      }
    >
      <p>
        <Term id="full-duplex">Full-duplex</Term> models go a step further than turn-based
        speech-to-speech: they listen and speak at the same time, so they can say
        &ldquo;mm-hm&rdquo; while you talk and be interrupted naturally.
      </p>
      <p>
        Model names change several times a year and older ones are retired, so check current
        documentation before building.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which suits it? ----------------------------------------------------------------------------- */

export function BestFit() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which suits it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="s2s-fit"
            prompt="Which architecture fits each product best?"
            categories={[
              { id: "cascade", label: "Cascaded pipeline" },
              { id: "s2s", label: "Speech-to-speech" },
            ]}
            items={[
              {
                id: "bank",
                label: "A bank line that must read a legal disclosure word for word",
                category: "cascade",
                why: "Exact wording, controlled by your code.",
              },
              {
                id: "companion",
                label: "A conversation-practice app where warmth and quick back-and-forth matter",
                category: "s2s",
                why: "Speed and expressiveness.",
              },
              {
                id: "retrofit",
                label: "Adding voice to an existing, well-tested text chatbot",
                category: "cascade",
                why: "Keep the agent; add speech around it.",
              },
              {
                id: "pronounce",
                label: "A language tutor that reacts to how you pronounce words",
                category: "s2s",
                why: "It needs to hear the audio itself.",
              },
              {
                id: "insurer",
                label: "An insurer that must log exactly what the AI understood",
                category: "cascade",
                why: "A transcript at every step.",
              },
            ]}
            explanation="Choose a pipeline for control, exact wording and records; choose speech-to-speech for speed, natural conversation and anything that depends on how something was said."
          />
        </div>
      }
    >
      <p>Sort the products.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["One model, audio in and out", "No text step in between."],
  ["Gains", "Speed, tone, natural conversation."],
  ["Losses", "Control, exact wording, step-by-step records."],
  ["Full duplex", "Listening while speaking."],
  ["Pick per use case", "Or a hybrid."],
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
      <p>Next: interruptions, and what happens when the caller cuts in.</p>
    </StepLayout>
  );
}
