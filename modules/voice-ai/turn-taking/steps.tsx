"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TURNS, judge } from "./model";
import type { TurnState } from "./state";

/* 1 ─ Over and out -------------------------------------------------------------------------------- */

export function Walkie() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Over and out"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Walkie-talkie</p>
            <p className="text-muted mt-1">
              &ldquo;Meet at the gate. Over.&rdquo; Nobody has to guess when you&apos;ve finished:
              you say so.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Real conversation</p>
            <p className="text-muted mt-1">
              &ldquo;My number is… um… 2291.&rdquo; No &ldquo;over&rdquo;. Listeners judge from the
              words, the tune of the voice and the pauses.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Walkie-talkie users say &ldquo;over&rdquo; so the other side knows when to talk. In real
        conversation nobody does; we judge whether someone has finished from what they said and how
        they said it, and we wait through thinking pauses.
      </p>
      <p>
        A voice agent has to make the same call, called <Term id="endpointing">endpointing</Term>:
        decide when you&apos;ve finished your turn. Too early and it cuts you off; too late and it
        feels slow.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tune the end of a turn ⭐ ------------------------------------------------------------------- */

export function Endpoint() {
  const [s, set] = useSceneState<TurnState>();
  const r = judge(s.timeout, s.semantic);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Tune the end of a turn"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex flex-1 items-center gap-2">
              <span className="text-muted">silence before replying</span>
              <input
                type="range"
                min={200}
                max={2000}
                step={100}
                value={s.timeout}
                onChange={(e) => set({ timeout: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Silence timeout in milliseconds"
              />
              <span className="w-16 font-mono">{s.timeout} ms</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.semantic}
                onChange={(e) => set({ semantic: e.target.checked })}
                className="accent-accent"
              />
              Add a semantic turn detector
            </label>
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border p-3">
            {TURNS.map((segs, ti) => (
              <div key={ti} className="flex flex-wrap items-center gap-1 text-xs">
                <span className="text-muted w-12 text-[10px]">caller</span>
                {segs.map((sg, si) => {
                  const m = r.marks.find((x) => x.turn === ti && x.seg === si);
                  return (
                    <span key={si} className="flex items-center gap-1">
                      <span className="bg-viz-data/20 rounded px-1.5 py-0.5">{sg.text}</span>
                      {sg.pauseAfter !== undefined && (
                        <motion.span
                          key={`${s.timeout}-${s.semantic}`}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            "rounded px-1.5 py-0.5 font-mono text-[10px]",
                            m?.cut ? "bg-bad/20 text-bad font-semibold" : "bg-surface-2 text-muted",
                          )}
                        >
                          {m?.cut
                            ? `✂ cut off (${sg.pauseAfter} ms pause)`
                            : `… ${sg.pauseAfter} ms`}
                        </motion.span>
                      )}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                r.cuts ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              <p className="font-mono text-lg font-semibold">{r.cuts}</p>
              <p className="text-muted">times the agent cut the caller off</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                r.avgWait > 1000 ? "border-bad bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="font-mono text-lg font-semibold">{r.avgWait} ms</p>
              <p className="text-muted">wait after the caller really finished</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative call; a semantic detector can still misjudge, as “Actually, wait.” shows.
          </p>
        </div>
      }
    >
      <p>
        The simplest rule: reply after a set amount of silence. OpenAI&apos;s Realtime API waits 500
        ms by default. Slide it: short timeouts cut people off mid-thought; long ones make every
        reply slow, even after a clear &ldquo;yes&rdquo;.
      </p>
      <p>
        No single number works. Add a{" "}
        <Term id="semantic-turn-detection">semantic turn detector</Term>, which judges from the
        words whether the sentence is finished: it waits through &ldquo;The booking number
        is…&rdquo; and replies quickly after a complete sentence. It still gets fooled by
        &ldquo;Actually, wait.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Is anyone speaking? ------------------------------------------------------------------------- */

export function VadFrames() {
  const [s, set] = useSceneState<TurnState>();
  const probs = Array.from({ length: 48 }, (_, i) => {
    if (i < 4 || (i > 20 && i < 25) || i > 42) return 0.05 + 0.1 * Math.abs(Math.sin(i * 1.7));
    if (i === 30 || i === 31) return 0.42;
    return 0.75 + 0.2 * Math.abs(Math.sin(i));
  });
  const t = s.threshold / 100;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Is anyone speaking?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">speech threshold</span>
            <input
              type="range"
              min={10}
              max={90}
              value={s.threshold}
              onChange={(e) => set({ threshold: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Speech probability threshold"
            />
            <span className="w-10 font-mono">{t.toFixed(2)}</span>
          </label>
          <div className="border-line bg-surface relative flex h-32 items-end gap-0.5 rounded-xl border p-2">
            <div
              className="border-accent absolute right-2 left-2 border-t border-dashed"
              style={{ bottom: `calc(0.5rem + ${t * 100}% * 0.85)` }}
            />
            {probs.map((p, i) => (
              <div
                key={i}
                className={cn("flex-1 rounded-t-sm", p >= t ? "bg-viz-data" : "bg-surface-2")}
                style={{ height: `${p * 85}%` }}
              />
            ))}
          </div>
          <p className="text-muted text-xs">
            Each bar is one ~32 ms slice of audio and the model&apos;s confidence that it contains
            speech. Bars above the line count as speech. The short dip in the middle is a quiet
            syllable: set the line too high and it looks like silence.
          </p>
        </div>
      }
    >
      <p>
        Underneath, a <Term id="vad">voice activity detector</Term> scores every slice of audio.
        Silero VAD, a popular open-source model (MIT licence), looks at about 32 ms at a time;
        Google&apos;s WebRTC VAD uses 10 to 30 ms frames. Both run easily on an ordinary processor.
      </p>
      <p>
        The threshold is a trade-off too: too low and background noise counts as speech; too high
        and quiet speakers get missed.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Listening for meaning ----------------------------------------------------------------------- */

export function Semantic() {
  const items: [string, string][] = [
    [
      "Text-based",
      "LiveKit's turn detector reads the transcript so far and predicts whether the sentence is complete (open weights, licensed for use with LiveKit Agents).",
    ],
    [
      "Audio-based",
      "Pipecat's Smart Turn listens to the last few seconds of audio, including tone, to judge the end of a turn (open source, BSD-2). Krisp sells another.",
    ],
    [
      "Built into APIs",
      "OpenAI's semantic VAD has an “eagerness” setting from low to high; Deepgram's Flux model detects end of turn itself.",
    ],
    [
      "Research",
      "Voice Activity Projection (2022) trains models to predict who will speak next, including short backchannels like “mm-hm”.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Listening for meaning"
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
        People use words, rising or falling tone, and breath to judge when a turn ends. Semantic
        turn detection tries to do the same, combining a short silence with a judgement of whether
        the person sounds finished.
      </p>
      <p>
        Most production agents combine both: a VAD for &ldquo;is there speech?&rdquo; and a turn
        model for &ldquo;are they done?&rdquo;, with a maximum wait so a confused model never leaves
        the line silent for long.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Reply now, or wait? ------------------------------------------------------------------------- */

export function ReplyNow() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Reply now, or wait?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="reply-now"
            prompt="The caller has just paused for half a second. Should the agent reply?"
            categories={[
              { id: "reply", label: "Reply now" },
              { id: "wait", label: "Keep waiting" },
            ]}
            items={[
              {
                id: "acct",
                label: "“My account number is…”",
                category: "wait",
                why: "The sentence is unfinished.",
              },
              {
                id: "thanks",
                label: "“That's all, thanks.”",
                category: "reply",
                why: "A clear end.",
              },
              { id: "um", label: "“Um…”", category: "wait", why: "Still thinking." },
              {
                id: "question",
                label: "“Can you check my order?”",
                category: "reply",
                why: "A complete question.",
              },
              {
                id: "well",
                label: "“So the problem is, well,”",
                category: "wait",
                why: "Mid-sentence.",
              },
            ]}
            explanation="A pause alone doesn't mean a turn is over. Unfinished sentences and fillers mean wait; complete questions and sign-offs mean reply."
          />
        </div>
      }
    >
      <p>Sort the moments.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Endpointing", "Deciding when the caller has finished."],
  ["Silence timers trade off", "Cut-offs vs slowness."],
  ["VAD scores slices", "Speech or not, every ~30 ms."],
  ["Semantic detectors", "Judge completeness from words or tone."],
  ["Combine and cap", "VAD + turn model + a maximum wait."],
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
      <p>Next: noise, echoes, accents and more than one speaker.</p>
    </StepLayout>
  );
}
