"use client";

import { motion } from "motion/react";
import { Volume2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { APPROACHES, REPLY, timing } from "./model";
import type { TtsState } from "./state";

/* 1 ─ Ransom-note speech -------------------------------------------------------------------------- */

export function Ransom() {
  const bits = [
    "Your",
    " train",
    " to",
    " PUNE",
    " is",
    " de",
    "layed",
    " by",
    " twelve",
    " min",
    "utes",
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Ransom-note speech"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <p className="flex flex-wrap justify-center gap-0.5 text-lg">
            {bits.map((b, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, rotate: i % 2 ? 3 : -3 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.06 * i }}
                className={cn(
                  "rounded px-1",
                  i % 3 === 0
                    ? "bg-viz-data/20 font-serif"
                    : i % 3 === 1
                      ? "bg-accent/15 font-mono"
                      : "bg-viz-compute/20",
                )}
              >
                {b}
              </motion.span>
            ))}
          </p>
        </div>
      }
    >
      <p>
        Station announcements used to sound like a ransom note read aloud: words recorded separately
        and glued together, each with its own pitch and pace. Everyone can hear the joins.
      </p>
      <p>
        <Term id="text-to-speech">Text-to-speech</Term> has come a long way since. Neural models now
        produce voices that listeners rate close to recorded speech. For conversation, there&apos;s
        a second question: how soon does the first sound come out?
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three ways to make a voice ------------------------------------------------------------------ */

export function Approaches() {
  const [s, set] = useSceneState<TtsState>();
  const a = APPROACHES.find((x) => x.id === s.approach) ?? APPROACHES[2];
  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance("Your table for two is booked for seven tonight.");
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      /* speech synthesis unavailable */
    }
  };
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways to make a voice"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {APPROACHES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.approach === x.id}
                onClick={() => set({ approach: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.approach === x.id ? "border-accent bg-accent-soft" : "border-line",
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
            className="border-line bg-surface rounded-xl border p-4"
          >
            <p className="text-muted text-[10px]">{a.era}</p>
            <p className="mt-1 text-sm">{a.note}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-muted w-28">typical rating (1–5)</span>
              <div className="bg-surface-2 h-2 flex-1 overflow-hidden rounded-full">
                <motion.div
                  animate={{ width: `${(a.quality / 5) * 100}%` }}
                  className="bg-accent h-full"
                />
              </div>
              <span className="w-8 font-mono">{a.quality}</span>
            </div>
          </motion.div>
          <button
            type="button"
            onClick={speak}
            className="border-line bg-surface flex w-fit items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs"
          >
            <Volume2 className="size-3.5" /> Hear your browser&apos;s built-in voice
          </button>
          <p className="text-subtle text-[10px]">
            Ratings illustrative. The button uses whatever voice your device provides, which may be
            any of these approaches.
          </p>
        </div>
      }
    >
      <p>
        Older systems either glued recorded snippets together, natural on familiar phrases and
        choppy on new ones, or generated sound from a statistical model, flexible but buzzy.
      </p>
      <p>
        Neural networks changed that. DeepMind&apos;s WaveNet (2016) generated audio sample by
        sample and closed more than half the gap to human speech in listening tests. Google&apos;s
        Tacotron 2 (2017) was rated 4.53 out of 5, against 4.58 for professional recordings, in one
        test.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Speak before you've finished ⭐ ------------------------------------------------------------- */

export function Stream() {
  const [s, set] = useSceneState<TtsState>();
  const t = timing(s.stream);
  const total = 3200;
  const sentences = REPLY.split(/(?<=[.?])\s/);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Speak before you've finished"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.stream}
              onChange={(e) => set({ stream: e.target.checked })}
              className="accent-accent"
            />
            Stream: start speaking each sentence as soon as it&apos;s written
          </label>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border p-3 text-xs">
            <div className="grid grid-cols-[6rem_1fr] items-center gap-2">
              <span className="text-muted">model writes</span>
              <div className="bg-surface-2 relative h-5 rounded">
                <motion.span
                  animate={{ width: `${(t.llmTotal / total) * 100}%` }}
                  className="bg-viz-compute/50 absolute top-0 left-0 h-full rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-[6rem_1fr] items-center gap-2">
              <span className="text-muted">you hear</span>
              <div className="bg-surface-2 relative h-5 rounded">
                <motion.span
                  animate={{ left: `${(t.first / total) * 100}%` }}
                  className="bg-accent/60 absolute top-0 h-full rounded"
                  style={{ width: "50%" }}
                />
              </div>
            </div>
            <div className="text-muted flex justify-between text-[10px]">
              <span>0</span>
              <span>3.2 s</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                t.first < 1000 ? "border-good bg-good/10" : "border-bad bg-bad/10",
              )}
            >
              <p className="font-mono text-lg font-semibold">{t.first} ms</p>
              <p className="text-muted">time to first audio</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-[11px]">
              {sentences.map((x, i) => (
                <p
                  key={i}
                  className={cn(s.stream && i === 0 ? "text-accent font-semibold" : "text-muted")}
                >
                  {x}
                </p>
              ))}
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative timings, measured from when the model starts writing.
          </p>
        </div>
      }
    >
      <p>
        A language model writes its reply a few words at a time. Without streaming, speech synthesis
        waits for the whole reply, then starts. With streaming, it voices the first sentence while
        the model is still writing the rest.
      </p>
      <p>
        For conversation, the number that matters is <Term id="ttfa">time to first audio</Term>: how
        soon the caller hears anything. Vendors quote figures like 75 or 90 milliseconds for their
        fastest models, but those cover the model alone; what callers experience includes the
        network and everything around it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How good does it sound? --------------------------------------------------------------------- */

export function Mos() {
  const scale: [number, string][] = [
    [5, "Excellent"],
    [4, "Good"],
    [3, "Fair"],
    [2, "Poor"],
    [1, "Bad"],
  ];
  const models: [string, string][] = [
    [
      "2023",
      "Neural codec models (Microsoft's VALL-E) imitate an unseen voice from a 3-second sample.",
    ],
    ["2023–24", "Flow-matching and diffusion models refine noise into speech in a few steps."],
    [
      "2025–26",
      "Small open models such as Kokoro and Kyutai TTS; commercial streaming voices from ElevenLabs, Cartesia and others.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How good does it sound?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3 text-xs">
            <p className="text-muted text-[10px]">MEAN OPINION SCORE: LISTENERS RATE EACH CLIP</p>
            {scale.map(([n, l]) => (
              <div key={n} className="flex items-center gap-2">
                <span className="text-accent w-4 font-mono">{n}</span>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {models.map(([d, t]) => (
              <div key={d} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <span className="text-accent font-mono">{d} </span>
                <span className="text-muted">{t}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Naturalness is usually measured with a <Term id="mos">mean opinion score</Term>: listeners
        rate clips from 1 (bad) to 5 (excellent) and the ratings are averaged. The scale comes from
        a telephone-quality standard, ITU-T P.800.
      </p>
      <p>
        Scores from different tests can&apos;t be compared directly: they depend on the listeners,
        the sentences and what else was in the test. Treat &ldquo;highest MOS&rdquo; marketing
        claims with care, and listen with your own text.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Old way or neural? -------------------------------------------------------------------------- */

export function OldOrNew() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Old way or neural?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="old-or-neural"
            prompt="Which generation of speech synthesis does each describe?"
            categories={[
              { id: "old", label: "Older approaches" },
              { id: "neural", label: "Neural approaches" },
            ]}
            items={[
              {
                id: "glue",
                label: "Glues recorded snippets together",
                category: "old",
                why: "Concatenative synthesis.",
              },
              {
                id: "buzzy",
                label: "A smooth, buzzy robot voice from a statistical model",
                category: "old",
                why: "Parametric synthesis.",
              },
              {
                id: "clone",
                label: "Imitates a new voice from a few seconds of audio",
                category: "neural",
                why: "Neural codec models, from 2023.",
              },
              {
                id: "samples",
                label: "Generates audio one sample at a time with a deep network",
                category: "neural",
                why: "WaveNet, 2016.",
              },
              {
                id: "joins",
                label: "Perfect on fixed phrases, choppy on new sentences",
                category: "old",
                why: "The joins show on unseen text.",
              },
            ]}
            explanation="Older systems glued recordings or used buzzy statistical models. Neural systems, from WaveNet in 2016, generate natural speech and can imitate voices."
          />
        </div>
      }
    >
      <p>Sort the descriptions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["From glue to neural", "Snippets, then statistics, then deep networks."],
  ["Near-human ratings", "In listening tests, for some voices."],
  ["Stream it", "Speak the first sentence while the rest is written."],
  ["Time to first audio", "The latency callers feel."],
  ["MOS has limits", "Don't compare scores across tests."],
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
      <p>Next: writing replies that sound right when spoken.</p>
    </StepLayout>
  );
}
