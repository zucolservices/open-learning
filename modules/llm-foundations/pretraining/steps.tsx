"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PARAMS, START_LOSS, generate, init, train, type Model } from "./tiny-lm";
import { loss, optimum, tokensFor } from "./scaling";
import type { PretrainState } from "./state";

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 1 ─ Watch a model learn ⭐ ------------------------------------------------------------------------ */

const MAX_STEPS = 2500;

export function WatchItLearn() {
  const model = useRef<Model>(init(1));
  const [curve, setCurve] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [sample, setSample] = useState(() => generate(init(1), "the ", 70, 1));
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (model.current.step >= MAX_STEPS) {
        setRunning(false);
        return;
      }
      const l = train(model.current, 20);
      setCurve((c) => [...c, l]);
      setStep(model.current.step);
      if (model.current.step % 100 === 0) setSample(generate(model.current, "the ", 70, 1));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  const reset = () => {
    model.current = init(1);
    setCurve([]);
    setStep(0);
    setRunning(false);
    setSample(generate(model.current, "the ", 70, 1));
  };
  const W = 360;
  const H = 120;
  const x = (i: number) => 28 + (i / (MAX_STEPS / 20)) * (W - 36);
  const y = (v: number) => 10 + (1 - v / 3.4) * (H - 26);
  const path = curve.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const last = curve[curve.length - 1] ?? START_LOSS;
  return (
    <StepLayout
      eyebrow="Real training"
      title="Watch a model learn"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRunning(!running)}
              disabled={step >= MAX_STEPS}
              className="bg-accent text-accent-fg inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}{" "}
              {running ? "Pause" : step ? "Resume training" : "Start training"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
            >
              <RotateCcw className="size-3.5" /> Start over
            </button>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Training loss over steps"
            >
              <line
                x1={28}
                x2={W - 8}
                y1={y(START_LOSS)}
                y2={y(START_LOSS)}
                stroke="var(--line-strong)"
                strokeDasharray="3 3"
              />
              <text
                x={W - 8}
                y={y(START_LOSS) - 3}
                textAnchor="end"
                className="fill-muted text-[7px]"
              >
                random guessing
              </text>
              <path d={path} fill="none" stroke="var(--accent)" strokeWidth={1.8} />
              {[0, 1, 2, 3].map((v) => (
                <text
                  key={v}
                  x={24}
                  y={y(v) + 3}
                  textAnchor="end"
                  className="fill-subtle text-[7px]"
                >
                  {v}
                </text>
              ))}
              <text x={28} y={H - 2} className="fill-subtle text-[7px]">
                0
              </text>
              <text x={W - 8} y={H - 2} textAnchor="end" className="fill-subtle text-[7px]">
                {MAX_STEPS} steps
              </text>
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Training steps" value={step.toLocaleString("en-IN")} />
            <Stat label="Loss" value={last.toFixed(2)} />
            <Stat label="Parameters" value={PARAMS.toLocaleString("en-IN")} />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 text-[10px]">The model continues “the ”</p>
            <p className="font-mono text-sm break-all">{sample}</p>
          </div>
        </div>
      }
    >
      <p>
        A new model is like a baby&apos;s babble: random noises. Training shows it text, asks it to
        guess each next character, and nudges its numbers a little every time it&apos;s wrong.
      </p>
      <p>
        This is real training, in your browser: a tiny neural network with 3,352 numbers learning
        the café text from module 1. Press start and watch the <Term id="loss">loss</Term> (how
        surprised it is by the right answer) fall, and its writing change.
      </p>
      <p className="text-muted text-sm">
        This model soon memorises its tiny text and starts looping. Real{" "}
        <Term id="pretraining">pretraining</Term> uses trillions of tokens, far too many to
        memorise, which forces models to learn general patterns instead.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Spend a compute budget ⭐ -------------------------------------------------------------------- */

const BUDGETS: { label: string; c: number; note: string }[] = [
  { label: "10²¹ FLOPs", c: 1e21, note: "A small research run" },
  {
    label: "Chinchilla's budget",
    c: 6 * 70e9 * 1.4e12,
    note: "≈ 5.9 × 10²³ FLOPs (DeepMind, 2022)",
  },
  { label: "Llama 3.1 405B's budget", c: 3.8e25, note: "3.8 × 10²⁵ FLOPs (Meta, 2024)" },
];

function fmtN(n: number) {
  return n >= 1e12
    ? `${(n / 1e12).toFixed(1)}T`
    : n >= 1e9
      ? `${(n / 1e9).toFixed(n < 1e10 ? 1 : 0)}B`
      : `${Math.round(n / 1e6)}M`;
}

export function Budget() {
  const [s, set] = useSceneState<PretrainState>();
  const b = BUDGETS[s.budget];
  const n = 10 ** s.logN;
  const d = tokensFor(b.c, n);
  const l = loss(n, d);
  const opt = optimum(b.c);
  const W = 360;
  const H = 140;
  const lo = 7.5;
  const hi = 12.5;
  const xs = Array.from({ length: 101 }, (_, i) => lo + ((hi - lo) * i) / 100);
  const ls = xs.map((lg) => loss(10 ** lg, tokensFor(b.c, 10 ** lg)));
  const ymin = Math.min(...ls);
  const ymax = Math.min(ymin + 1.2, Math.max(...ls));
  const x = (lg: number) => 28 + ((lg - lo) / (hi - lo)) * (W - 36);
  const y = (v: number) => H - 20 - ((Math.min(v, ymax) - ymin) / (ymax - ymin)) * (H - 34);
  const path = xs.map((lg, i) => `${i === 0 ? "M" : "L"}${x(lg)},${y(ls[i])}`).join(" ");
  const off = l - opt.l;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Spend a compute budget"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={String(s.budget)}
            options={BUDGETS.map((x2, i) => [String(i), x2.label] as [string, string])}
            onChange={(v) =>
              set({ budget: Number(v), logN: Math.log10(optimum(BUDGETS[Number(v)].c).n) + 0.6 })
            }
          />
          <p className="text-muted text-xs">{b.note}</p>
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Final loss against model size for a fixed compute budget"
            >
              <path d={path} fill="none" stroke="var(--line-strong)" strokeWidth={1.5} />
              <circle cx={x(Math.log10(opt.n))} cy={y(opt.l)} r={3.5} fill="var(--good)" />
              {s.budget === 1 && (
                <>
                  <circle
                    cx={x(Math.log10(280e9))}
                    cy={y(loss(280e9, tokensFor(b.c, 280e9)))}
                    r={3}
                    fill="var(--viz-meta)"
                  />
                  <text
                    x={x(Math.log10(280e9)) + 4}
                    y={y(loss(280e9, tokensFor(b.c, 280e9))) - 6}
                    textAnchor="start"
                    className="fill-muted text-[7px]"
                  >
                    Gopher 280B
                  </text>
                  <text
                    x={x(Math.log10(70e9)) - 4}
                    y={y(loss(70e9, 1.4e12)) - 8}
                    textAnchor="end"
                    className="fill-muted text-[7px]"
                  >
                    Chinchilla 70B
                  </text>
                </>
              )}
              <motion.circle
                cx={x(s.logN)}
                cy={y(l)}
                r={5}
                fill="var(--accent)"
                initial={false}
                animate={{ cx: x(s.logN), cy: y(l) }}
              />
              {[8, 9, 10, 11, 12].map((lg) => (
                <text
                  key={lg}
                  x={x(lg)}
                  y={H - 4}
                  textAnchor="middle"
                  className="fill-subtle text-[7px]"
                >
                  {fmtN(10 ** lg)}
                </text>
              ))}
              <text x={28} y={8} className="fill-muted text-[7px]">
                final loss (lower is better)
              </text>
            </svg>
          </div>
          <label className="flex items-center gap-3 text-xs">
            <span className="text-muted shrink-0">Model size</span>
            <input
              type="range"
              min={lo}
              max={hi}
              step={0.01}
              value={s.logN}
              onChange={(e) => set({ logN: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Model size"
            />
            <span className="w-16 text-right font-mono">{fmtN(n)}</span>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Parameters" value={fmtN(n)} />
            <Stat label="Training tokens" value={fmtN(d)} />
            <Stat label="Tokens per parameter" value={(d / n).toFixed(d / n < 10 ? 1 : 0)} />
            <Stat label="Final loss" value={l.toFixed(3)} bad={off > 0.008} />
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              off > 0.008 ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
            )}
          >
            {off <= 0.008
              ? `Near the sweet spot: about ${fmtN(opt.n)} parameters trained on ${fmtN(tokensFor(b.c, opt.n))} tokens, roughly 20 tokens per parameter.`
              : d / n < 20
                ? "Too big for this budget: the model is starved of data and never gets to learn what its size allows."
                : "Too small for this budget: extra data can't make up for too little capacity."}
          </p>
        </div>
      }
    >
      <p>
        Training costs compute: roughly 6 × parameters × tokens operations. With a fixed budget, you
        choose how to split it: a bigger model on less data, or a smaller one on more.
      </p>
      <p>
        Move the model size and find the lowest loss. In 2022 DeepMind showed that Gopher (280B) had
        been too big for its data: Chinchilla (70B, 4× the tokens) did better on the same budget.
      </p>
      <p className="text-muted text-sm">
        Curve from a published <Term id="scaling-law">scaling law</Term> fitted to DeepMind&apos;s
        experiments (as re-fitted by Epoch AI in 2024). Real results vary with data and design.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Predict ------------------------------------------------------------------------------------- */

export function PredictTokens() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="How much data for 70B?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="chinchilla-tokens"
            prompt="Using the rule of thumb of about 20 training tokens per parameter, how many tokens (in billions) should a compute-optimal 70-billion-parameter model train on?"
            min={0}
            max={5000}
            step={50}
            unit=" billion"
            answer={1400}
            tolerance={150}
            explanation="70 billion × 20 = 1.4 trillion tokens: exactly what Chinchilla was trained on. (Many modern models deliberately train far longer; see the next steps.)"
          />
        </div>
      }
    >
      <p>The rule of thumb that came out of the Chinchilla paper is worth remembering.</p>
    </StepLayout>
  );
}

/* 4 ─ The scale of it ------------------------------------------------------------------------------ */

const SCALE: [string, string, string][] = [
  ["GPT-3 (2020)", "175B parameters", "300 billion tokens"],
  ["Chinchilla (2022)", "70B", "1.4 trillion tokens"],
  ["Llama 3 (2024)", "8B to 405B", "about 15 trillion tokens"],
  ["DeepSeek-V3 (2024)", "671B (37B active)", "14.8 trillion tokens; 2.8M GPU-hours"],
  [
    "FineWeb (2024, open dataset)",
    "96 Common Crawl snapshots",
    "15 trillion tokens of cleaned web text",
  ],
];

export function Scale() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="The scale of it"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <div className="border-line bg-surface divide-line divide-y rounded-xl border">
            {SCALE.map(([m, p, d], i) => (
              <motion.div
                key={m}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="grid gap-0.5 px-3 py-2 text-xs sm:grid-cols-[1fr_auto]"
              >
                <span>
                  <span className="font-medium">{m}</span> <span className="text-muted">· {p}</span>
                </span>
                <span className="font-mono">{d}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Pretraining data is mostly filtered web pages, plus books, code, papers and more, cleaned of
        duplicates, spam and low-quality text. Data quality matters as much as quantity.
      </p>
      <p className="text-muted text-sm">
        Costs: Llama 3.1 405B used about 3.8 × 10²⁵ operations. DeepSeek reported about $5.6M of GPU
        time for V3&apos;s final training run, excluding earlier research and experiments.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: overtraining ---------------------------------------------------------------------- */

export function Overtrain() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why train past the sweet spot?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="overtrain"
            prompt="Llama 3 8B was trained on about 15 trillion tokens: nearly 2,000 tokens per parameter, 100× the compute-optimal ratio. Why would Meta do that?"
            options={[
              {
                id: "serve",
                label:
                  "A small model is far cheaper to run for millions of users; extra training keeps improving it, so paying more once saves on every answer",
                correct: true,
                feedback:
                  "Right. Compute-optimal minimises training cost for a given quality. If you'll serve the model billions of times, a smaller, longer-trained model wins overall.",
              },
              {
                id: "mistake",
                label: "They didn't know about Chinchilla",
                feedback:
                  "They did; it's a deliberate choice driven by the cost of using the model.",
              },
              {
                id: "memorise",
                label: "To make it memorise the internet",
                feedback:
                  "More data reduces memorisation of any one text; the aim is better general ability at a small size.",
              },
              {
                id: "free",
                label: "Data is free, so more is always better",
                feedback: "Data and compute both cost money; the trade is about serving cost.",
              },
            ]}
            explanation="Scaling laws answer 'best model for a training budget'. Products ask 'best model for a total budget, including inference', which usually means smaller models trained on far more data."
          />
        </div>
      }
    >
      <p>Scaling laws are a guide, not a rule. The question they answer matters.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Learning = reducing surprise",
    "Training nudges numbers to make the right next token likelier.",
  ],
  ["Loss falls predictably", "Bigger models and more data lower loss along smooth curves."],
  ["Balance size and data", "For a training budget, roughly 20 tokens per parameter is best."],
  ["Then overtrain for serving", "Small models trained long are cheaper to run."],
  ["Data quality matters", "Trillions of tokens, carefully filtered."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d2], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d2}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>A freshly pretrained model continues text. It doesn&apos;t yet answer questions.</p>
      <p>Next: turning a base model into an assistant.</p>
    </StepLayout>
  );
}
