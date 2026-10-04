"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BITS, RATES, clip, energy, samples } from "./model";
import type { SoundState } from "./state";

/* 1 ─ A flipbook of air --------------------------------------------------------------------------- */

export function Flipbook() {
  const pts = Array.from(
    { length: 60 },
    (_, i) => Math.sin(i / 3) * 0.6 + Math.sin(i / 1.3) * 0.25,
  );
  return (
    <StepLayout
      eyebrow="Story"
      title="A flipbook of air"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <svg
            viewBox="0 0 300 120"
            className="w-full max-w-md"
            role="img"
            aria-label="A sound wave measured at regular moments"
          >
            <polyline
              points={pts.map((v, i) => `${10 + i * 4.7},${60 - v * 40}`).join(" ")}
              className="stroke-viz-data fill-none"
              strokeWidth={1.5}
              opacity={0.5}
            />
            {pts.map((v, i) =>
              i % 3 === 0 ? (
                <g key={i}>
                  <line
                    x1={10 + i * 4.7}
                    y1={60}
                    x2={10 + i * 4.7}
                    y2={60 - v * 40}
                    className="stroke-accent"
                    strokeWidth={1}
                  />
                  <circle cx={10 + i * 4.7} cy={60 - v * 40} r={2.2} className="fill-accent" />
                </g>
              ) : null,
            )}
            <line x1={10} y1={60} x2={290} y2={60} className="stroke-line-strong" />
            <text x={10} y={112} className="fill-muted text-[9px]">
              dots: the numbers a computer stores, thousands per second
            </text>
          </svg>
        </div>
      }
    >
      <p>
        A film is a quick series of still photos; played fast enough, it looks like motion. Sound
        recording works the same way. A microphone turns the wobbling air pressure of your voice
        into a wobbling voltage, and the computer measures it thousands of times a second.
      </p>
      <p>
        Each measurement is a <Term id="audio-sample">sample</Term>. How often you take them, the{" "}
        <Term id="sample-rate">sample rate</Term>, and how precisely you store each one, the{" "}
        <Term id="bit-depth">bit depth</Term>, decide what survives.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Sample a word ⭐ ---------------------------------------------------------------------------- */

const MAXF = 11000;
const TB = 36;
const FB = 28;

export function Sampler() {
  const [s, set] = useSceneState<SoundState>();
  const nyq = s.rate / 2;
  const wave = samples(s.rate, s.bits);
  const play = () => {
    try {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const data = clip(s.rate, s.bits);
      const buf = ctx.createBuffer(1, data.length, s.rate);
      buf.copyToChannel(data, 0);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start();
      src.onended = () => ctx.close();
    } catch {
      /* audio unavailable: the pictures still teach the idea */
    }
  };
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Sample a word"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-muted mr-1">sample rate</span>
            {RATES.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={s.rate === r}
                onClick={() => set({ rate: r })}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono",
                  s.rate === r ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {r / 1000} kHz
              </button>
            ))}
            <span className="text-muted mr-1 ml-3">bit depth</span>
            {BITS.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={s.bits === b}
                onClick={() => set({ bits: b })}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono",
                  s.bits === b ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {b}-bit
              </button>
            ))}
            <button
              type="button"
              onClick={play}
              className="border-accent bg-accent-soft ml-auto flex items-center gap-1 rounded-md border px-2 py-1"
            >
              <Play className="size-3" /> Play “sun”
            </button>
          </div>
          <div className="border-line bg-surface rounded-xl border p-2">
            <p className="text-muted text-[10px]">
              SPECTROGRAM: TIME → , PITCH ↑ , LOUDNESS = BRIGHTNESS
            </p>
            <svg
              viewBox={`0 0 ${TB * 10 + 40} ${FB * 5 + 14}`}
              className="w-full"
              role="img"
              aria-label="Spectrogram of the word sun"
            >
              {Array.from({ length: TB }, (_, ti) =>
                Array.from({ length: FB }, (_, fi) => {
                  const f = ((fi + 0.5) / FB) * MAXF;
                  const lost = f > nyq;
                  const e = energy(ti / TB, f);
                  return (
                    <rect
                      key={`${ti}-${fi}`}
                      x={36 + ti * 10}
                      y={(FB - fi - 1) * 5}
                      width={10}
                      height={5}
                      className={lost ? "fill-surface-2" : "fill-accent"}
                      opacity={lost ? 1 : Math.max(0.04, e)}
                    />
                  );
                }),
              )}
              <line
                x1={36}
                y1={(1 - nyq / MAXF) * FB * 5}
                x2={TB * 10 + 36}
                y2={(1 - nyq / MAXF) * FB * 5}
                className={cn(s.rate < 44100 ? "stroke-bad" : "stroke-none")}
                strokeDasharray="3 2"
              />
              {[0, 4000, 8000].map((f) => (
                <text
                  key={f}
                  x={32}
                  y={(1 - f / MAXF) * FB * 5 + 3}
                  textAnchor="end"
                  className="fill-muted text-[7px]"
                >
                  {f / 1000}k
                </text>
              ))}
              {[
                ["s", 0.15],
                ["u", 0.54],
                ["n", 0.89],
              ].map(([l, x]) => (
                <text
                  key={l as string}
                  x={36 + (x as number) * TB * 10}
                  y={FB * 5 + 11}
                  textAnchor="middle"
                  className="fill-fg font-mono text-[8px]"
                >
                  {l}
                </text>
              ))}
            </svg>
          </div>
          <div className="border-line bg-surface rounded-xl border p-2">
            <p className="text-muted text-[10px]">
              12 MS OF THE VOWEL, AS STORED: {wave.length} SAMPLES, {2 ** s.bits} LEVELS
            </p>
            <svg viewBox="0 0 400 70" className="w-full" role="img" aria-label="Sampled waveform">
              <line x1={0} y1={35} x2={400} y2={35} className="stroke-line" />
              <polyline
                points={wave
                  .map((v, i) => `${(i / Math.max(1, wave.length - 1)) * 400},${35 - v * 30}`)
                  .join(" ")}
                className="stroke-viz-data fill-none"
                strokeWidth={1.2}
              />
              {wave.length < 120 &&
                wave.map((v, i) => (
                  <circle
                    key={i}
                    cx={(i / Math.max(1, wave.length - 1)) * 400}
                    cy={35 - v * 30}
                    r={1.6}
                    className="fill-viz-data"
                  />
                ))}
            </svg>
          </div>
          <motion.p
            key={`${s.rate}-${s.bits}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted text-xs"
          >
            {s.rate === 8000
              ? "At 8 kHz nothing above 4 kHz survives: the hiss of the “s” is gone, so “sun”, “fun” and “thumb” sound alike. That's an old phone line."
              : s.rate === 16000
                ? "At 16 kHz, sounds up to 8 kHz survive: enough for clear speech, which is why speech recognisers usually use it."
                : "At 44.1 kHz (CD quality) everything people can hear survives."}{" "}
            {s.bits === 4
              ? "With only 16 levels, the wave becomes a staircase and adds harsh noise."
              : s.bits === 8
                ? "8 bits give 256 levels: audible hiss on quiet sounds."
                : ""}
          </motion.p>
          <p className="text-subtle text-[10px]">
            A synthetic word with simplified acoustics, not a real recording.
          </p>
        </div>
      }
    >
      <p>
        Here is a synthetic spoken &ldquo;sun&rdquo;: a hissy &ldquo;s&rdquo;, a vowel made of
        evenly spaced pitches, and a hum. Change the sample rate and the spectrogram loses
        everything above half that rate. Change the bit depth and the wave turns into steps.
      </p>
      <p>
        The rule behind it, from Shannon in 1949: to capture a frequency you must sample more than
        twice as fast. A <Term id="spectrogram">spectrogram</Term> like this one is what most speech
        models actually look at.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Phones, CDs and speech models --------------------------------------------------------------- */

export function Rates() {
  const rows: [string, string, string][] = [
    ["Classic phone call", "8 kHz", "keeps roughly 300–3,400 Hz"],
    ["“HD voice” call", "16 kHz", "keeps roughly 50–7,000 Hz"],
    [
      "Speech recognisers (e.g. Whisper)",
      "16 kHz",
      "audio is converted to this before transcribing",
    ],
    ["Real-time voice APIs", "often 24 kHz", "for natural-sounding speech output"],
    ["Music CD", "44.1 kHz, 16-bit", "everything people can hear"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Phones, CDs and speech models"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {rows.map(([t, r, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[1fr_7rem] gap-2 rounded-lg border px-3 py-2 text-xs sm:grid-cols-[14rem_7rem_1fr]"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-accent font-mono">{r}</span>
              <span className="text-muted col-span-2 sm:col-span-1">{d}</span>
            </motion.div>
          ))}
          <p className="text-muted mt-1 text-[11px]">
            Each extra bit adds about 6 dB of range between the quietest and loudest sound: 16-bit
            gives about 96 dB in theory.
          </p>
        </div>
      }
    >
      <p>
        Different jobs use different rates. Phone networks were designed around 8 kHz, which is why
        calls sound muffled and why voice agents answering phone calls start with less information
        than ones in a browser.
      </p>
      <p>
        A typical speaking pitch is around 125 Hz for adult men and 200 Hz for women, but the
        consonants that tell words apart, like &ldquo;s&rdquo; and &ldquo;f&rdquo;, live much
        higher.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Hearing like an ear ------------------------------------------------------------------------- */

export function Mel() {
  const hz = [100, 500, 1000, 2000, 4000, 8000];
  const mel = (f: number) => 2595 * Math.log10(1 + f / 700);
  const max = mel(8000);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Hearing like an ear"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex flex-col gap-1 text-xs">
            <p className="text-muted text-[10px]">EQUAL STEPS IN HERTZ</p>
            <div className="bg-surface-2 relative h-6 rounded">
              {hz.map((f) => (
                <span
                  key={f}
                  className="bg-viz-data absolute top-0 h-full w-0.5"
                  style={{ left: `${(f / 8000) * 100}%` }}
                />
              ))}
            </div>
            <p className="text-muted mt-2 text-[10px]">THE SAME PITCHES ON THE MEL SCALE</p>
            <div className="bg-surface-2 relative h-6 rounded">
              {hz.map((f) => (
                <span
                  key={f}
                  className="bg-accent absolute top-0 h-full w-0.5"
                  style={{ left: `${(mel(f) / max) * 100}%` }}
                >
                  <span className="text-muted absolute top-6 -translate-x-1/2 text-[9px] whitespace-nowrap">
                    {f >= 1000 ? `${f / 1000}k` : f}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <p className="text-muted mt-3 text-xs">
            Whisper, for example, converts audio to 16 kHz, then to a log-Mel spectrogram: slices 25
            ms long, one every 10 ms, each split into 80 Mel bands (128 in its latest large model).
          </p>
        </div>
      }
    >
      <p>
        Our ears are fussy about low pitches and relaxed about high ones: the difference between 100
        and 200 Hz is obvious, between 7,100 and 7,200 Hz barely noticeable. The{" "}
        <Term id="mel-scale">mel scale</Term>, from a 1937 study of how people perceive pitch,
        spaces frequencies the way ears hear them.
      </p>
      <p>
        Speech models use it too: spending detail where hearing is sharpest makes a smaller, more
        useful picture of speech.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which sample rate? -------------------------------------------------------------------------- */

export function WhichRate() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which sample rate?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-rate"
            prompt="Which sample rate does each usually use?"
            categories={[
              { id: "8", label: "8 kHz" },
              { id: "16", label: "16 kHz" },
              { id: "44", label: "44.1 kHz" },
            ]}
            items={[
              {
                id: "phone",
                label: "A classic landline phone call",
                category: "8",
                why: "Narrowband telephony.",
              },
              {
                id: "whisper",
                label: "Audio going into Whisper",
                category: "16",
                why: "Resampled to 16 kHz first.",
              },
              { id: "cd", label: "A music CD", category: "44", why: "CD standard." },
              {
                id: "hd",
                label: "An “HD voice” mobile call",
                category: "16",
                why: "Wideband telephony.",
              },
            ]}
            explanation="Phone calls traditionally use 8 kHz, speech recognition and HD voice 16 kHz, music 44.1 kHz. Half the sample rate is the highest frequency kept."
          />
        </div>
      }
    >
      <p>Sort them.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Samples", "Measurements of air pressure, thousands per second."],
  ["Sample rate", "Keeps frequencies up to half of it."],
  ["Bit depth", "Precision of each sample; ~6 dB per bit."],
  ["Phones lose detail", "8 kHz: consonants blur."],
  ["Spectrograms and mel", "How models see speech."],
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
      <p>Next: the pipeline that turns your voice into an answer.</p>
    </StepLayout>
  );
}
