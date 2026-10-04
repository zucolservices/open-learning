"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CLIPS, align } from "./model";
import type { SttState } from "./state";

/* 1 ─ The court stenographer ---------------------------------------------------------------------- */

export function Stenographer() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The court stenographer"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-5 py-4 font-mono text-xs">
            <p>THE WITNESS: I left at seven, or maybe — no, at eight.</p>
            <p className="text-muted mt-2">[inaudible]</p>
            <p className="mt-2">COUNSEL: Eight o&apos;clock?</p>
          </div>
        </div>
      }
    >
      <p>
        A court stenographer types every word as people speak, mumbles, interrupt and correct
        themselves, and marks what they couldn&apos;t hear. Their record is checked against the
        audio later, word by word.
      </p>
      <p>
        <Term id="speech-to-text">Speech recognition</Term> does the stenographer&apos;s job.
        It&apos;s judged the same way: by comparing its transcript with a careful human one and
        counting the mistakes, the <Term id="wer">word error rate</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Score a transcript ⭐ ----------------------------------------------------------------------- */

export function ScoreIt() {
  const [s, set] = useSceneState<SttState>();
  const clip = CLIPS.find((c) => c.id === s.clip) ?? CLIPS[0];
  const r = align(clip.ref, s.hyp);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Score a transcript"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {CLIPS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={s.clip === c.id}
                onClick={() => set({ clip: c.id, hyp: c.hyp, frame: 4 })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.clip === c.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <p className="text-muted text-[10px]">WHAT WAS SAID (REFERENCE)</p>
            <p className="mt-1 font-mono">{clip.ref}</p>
            <label className="text-muted mt-3 block text-[10px]" htmlFor="hyp">
              WHAT THE RECOGNISER WROTE (EDIT IT)
            </label>
            <input
              id="hyp"
              value={s.hyp}
              onChange={(e) => set({ hyp: e.target.value })}
              className="border-line bg-surface-2 mt-1 w-full rounded-md border px-2 py-1 font-mono text-xs"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {r.ops.map((o, i) => (
              <motion.span
                key={`${i}-${o.kind}-${o.ref}-${o.hyp}`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-md border px-1.5 py-0.5 font-mono text-[11px]",
                  o.kind === "ok"
                    ? "border-line bg-surface"
                    : o.kind === "sub"
                      ? "border-viz-compute bg-viz-compute/15"
                      : o.kind === "del"
                        ? "border-bad bg-bad/10 line-through"
                        : "border-accent bg-accent-soft",
                )}
              >
                {o.kind === "sub"
                  ? `${o.ref}→${o.hyp}`
                  : o.kind === "del"
                    ? o.ref
                    : o.kind === "ins"
                      ? `+${o.hyp}`
                      : o.ref}
              </motion.span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
            {[
              ["substitutions", r.S],
              ["deletions", r.D],
              ["insertions", r.I],
              ["reference words", r.N],
            ].map(([k, v]) => (
              <div key={k as string} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-mono text-base font-semibold">{v}</p>
                <p className="text-muted">{k}</p>
              </div>
            ))}
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                r.wer === 0
                  ? "border-good bg-good/10"
                  : r.wer < 0.2
                    ? "border-viz-compute bg-viz-compute/10"
                    : "border-bad bg-bad/10",
              )}
            >
              <p className="font-mono text-base font-semibold">{Math.round(r.wer * 100)}%</p>
              <p className="text-muted">WER</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Punctuation and capitals are ignored, as most scoring does. Clips are illustrative.
          </p>
        </div>
      }
    >
      <p>
        WER = (substitutions + deletions + insertions) ÷ the number of words actually said. Pick a
        clip, then edit the transcript and watch the score change. Try adding extra words: WER can
        go above 100%.
      </p>
      <p>
        Look at &ldquo;Names and codes&rdquo;: writing &ldquo;A4417&rdquo; as &ldquo;a four four one
        seven&rdquo; counts as many errors though the meaning is fine, and &ldquo;Sasha&rdquo; for
        &ldquo;Saoirse&rdquo; costs one word though it breaks the booking. WER treats every word the
        same; real-world harm doesn&apos;t.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Words as you speak -------------------------------------------------------------------------- */

export function Streaming() {
  const [s, set] = useSceneState<SttState>();
  const clip = CLIPS.find((c) => c.id === s.clip) ?? CLIPS[0];
  const last = clip.partials.length - 1;
  const frame = Math.min(s.frame, last);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Words as you speak"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface min-h-24 rounded-xl border p-4">
            <p className="text-muted text-[10px]">
              {frame === last ? "FINAL (is_final: true)" : "INTERIM (may still change)"}
            </p>
            <motion.p
              key={frame}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className={cn(
                "mt-1 font-mono text-sm",
                frame === last ? "text-fg" : "text-muted italic",
              )}
            >
              {clip.partials[frame]}
            </motion.p>
          </div>
          <FrameCaption
            frameKey={frame}
            title={frame === last ? "The final transcript" : `Interim result ${frame + 1}`}
          >
            {frame === last
              ? "After you stop, the recogniser commits to a final transcript."
              : "Guesses stream in as audio arrives, and earlier words can be corrected as more context comes in."}
          </FrameCaption>
          <Stepper step={frame} count={clip.partials.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Live systems can&apos;t wait for you to finish.{" "}
        <Term id="streaming-asr">Streaming recognition</Term> sends interim results as you speak,
        then a final one. Services such as Google Cloud and Deepgram mark which is which with an
        &ldquo;is_final&rdquo; flag.
      </p>
      <p>
        Interim results let a voice agent start thinking early, but they can change: &ldquo;please
        look&rdquo; became &ldquo;please book&rdquo; a moment later. Acting on them too soon is a
        classic bug.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How recognisers learn ----------------------------------------------------------------------- */

export function HowItWorks() {
  const items: [string, string][] = [
    [
      "CTC (2006) and RNN-T (2012)",
      "Ways to train on audio and transcripts without marking exactly when each sound happens; RNN-T is widely used for streaming.",
    ],
    [
      "Whisper (2022)",
      "An encoder–decoder Transformer from OpenAI, trained on 680,000 hours of audio from the web; open-source (MIT). Newer versions in 2023 and 2024.",
    ],
    [
      "Hallucinations",
      "Large recognisers can write words that were never said, especially in silence or noise.",
    ],
    [
      "“Human parity”",
      "Microsoft reported matching human transcribers on one telephone benchmark in 2016 (5.8% vs 5.9%); IBM later found humans could reach 5.1%. It's one test, not all speech.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How recognisers learn"
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
        Modern recognisers learn from huge amounts of transcribed audio. Accuracy depends heavily on
        how much data exists for a language: Whisper&apos;s authors found error rates fall sharply
        as training data grows.
      </p>
      <p>
        New models arrive every few months, from OpenAI, NVIDIA (open Parakeet and Canary models),
        cloud providers and specialists. Leaderboards such as Hugging Face&apos;s Open ASR
        Leaderboard compare them, but the best model on a benchmark may not be the best on your
        callers.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Work out the WER ---------------------------------------------------------------------------- */

export function ComputeWer() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Work out the WER"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="compute-wer"
            prompt="Someone said “turn off the kitchen lights” (5 words). The recogniser wrote “turn of the kitchen light please”. What is the word error rate?"
            options={[
              {
                id: "20",
                label: "20%",
                feedback: "Count again: two words changed and one was added.",
              },
              {
                id: "40",
                label: "40%",
                feedback: "That counts the two substitutions but not the extra word.",
              },
              {
                id: "60",
                label: "60%",
                correct: true,
                feedback:
                  "Yes: of for off, light for lights (2 substitutions) and please added (1 insertion): 3 ÷ 5 = 60%.",
              },
              {
                id: "100",
                label: "100%",
                feedback: "Too high: three of the five reference words are affected, not all.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Work it out.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["WER", "(S + D + I) ÷ words said; can exceed 100%."],
  ["Every word counts the same", "Names and numbers need extra checks."],
  ["Interim then final", "Don't act on guesses too soon."],
  ["Data drives accuracy", "Languages with more data do better."],
  ["Test on your audio", "Benchmarks aren't your callers."],
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
      <p>Next: knowing when someone has finished speaking.</p>
    </StepLayout>
  );
}
