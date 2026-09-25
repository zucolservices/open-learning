"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Dices } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MODEL_NAME, PROMPTS, distribution, draw } from "./dist";
import type { SampleState } from "./state";

const show = (t: string) => t.replace(/^ /, "·").replace(/\n/g, "↵");

/* 1 ─ Turn the dials ⭐ ------------------------------------------------------------------------------- */

export function Dials() {
  const [s, set] = useSceneState<SampleState>();
  const pr = PROMPTS[s.prompt];
  const d = useMemo(
    () => distribution(pr, { temperature: s.temperature, topK: s.topK, topP: s.topP }),
    [pr, s.temperature, s.topK, s.topP],
  );
  const samples = useMemo(() => (s.drawn ? draw(d, 20, s.seed) : []), [d, s.drawn, s.seed]);
  const counts = samples.reduce<Record<string, number>>(
    (a, t) => ((a[t] = (a[t] ?? 0) + 1), a),
    {},
  );
  const top = d.probs.slice(0, 10);
  const max = Math.max(...top.map((x) => x.p), d.tail, 0.01);
  return (
    <StepLayout
      eyebrow="Real model"
      title="Turn the dials"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PROMPTS.map((x, i) => (
              <button
                key={x.prompt}
                type="button"
                onClick={() => set({ prompt: i, drawn: false })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.prompt === i
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.prompt} …
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
              <span className="flex justify-between">
                <span className="text-muted">Temperature</span>
                <span className="font-mono">{s.temperature.toFixed(1)}</span>
              </span>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={s.temperature}
                onChange={(e) => set({ temperature: Number(e.target.value) })}
                className="mt-1 w-full accent-[var(--accent)]"
                aria-label="Temperature"
              />
            </label>
            <div className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
              <p className="text-muted mb-1">Top-k</p>
              <Segmented
                size="sm"
                value={String(s.topK)}
                options={[
                  ["0", "off"],
                  ["1", "1"],
                  ["5", "5"],
                  ["40", "40"],
                ]}
                onChange={(v) => set({ topK: Number(v) })}
              />
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
              <p className="text-muted mb-1">Top-p</p>
              <Segmented
                size="sm"
                value={String(s.topP)}
                options={[
                  ["1", "off"],
                  ["0.9", "0.9"],
                  ["0.5", "0.5"],
                ]}
                onChange={(v) => set({ topP: Number(v) })}
              />
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[10px]">
              Next-token probabilities after “{pr.prompt}” · tokens still possible:{" "}
              <span className="text-fg font-mono">{d.inPlay.toLocaleString("en-IN")}</span>
            </p>
            <div className="grid gap-1">
              {top.map((x) => (
                <div
                  key={x.t}
                  className={cn("flex items-center gap-2 text-xs", x.p === 0 && "opacity-35")}
                >
                  <span className="w-24 shrink-0 truncate text-right font-mono">{show(x.t)}</span>
                  <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
                    <motion.span
                      className="bg-accent absolute inset-y-0 left-0 rounded"
                      initial={false}
                      animate={{ width: `${(x.p / max) * 100}%` }}
                      transition={{ duration: 0.35 }}
                    />
                  </span>
                  <span className="text-muted w-12 text-right font-mono">
                    {(x.p * 100).toFixed(1)}%
                  </span>
                  {s.drawn && (
                    <span className="text-accent w-6 text-right font-mono">
                      {counts[x.t] ?? ""}
                    </span>
                  )}
                </div>
              ))}
              <div className={cn("flex items-center gap-2 text-xs", d.tail === 0 && "opacity-35")}>
                <span className="text-muted w-24 shrink-0 truncate text-right">
                  everything else*
                </span>
                <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
                  <motion.span
                    className="bg-viz-idle absolute inset-y-0 left-0 rounded"
                    initial={false}
                    animate={{ width: `${(d.tail / max) * 100}%` }}
                  />
                </span>
                <span className="text-muted w-12 text-right font-mono">
                  {(Math.max(0, 1 - top.reduce((a, x) => a + x.p, 0)) * 100).toFixed(1)}%
                </span>
                {s.drawn && (
                  <span className="text-accent w-6 text-right font-mono">
                    {samples.filter((t) => !top.some((x) => x.t === t)).length || ""}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => set({ drawn: true, seed: s.seed + 1 })}
              className="bg-accent text-accent-fg inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
            >
              <Dices className="size-3.5" /> Draw 20 times
            </button>
            {s.drawn && (
              <p className="text-muted font-mono text-[11px]">{samples.map(show).join(" ")}</p>
            )}
          </div>
          <p className="text-subtle text-[10px]">
            Real scores from {MODEL_NAME}. *Everything beyond the top 10; the rarest ~49,000 tokens
            are approximated.
          </p>
        </div>
      }
    >
      <p>
        The model gives every one of its 50,257 tokens a probability.{" "}
        <Term id="sampling">Sampling</Term> settings decide how the next one is picked.
      </p>
      <p>
        <Term id="temperature">Temperature</Term> sharpens (below 1) or flattens (above 1) the
        distribution. <Term id="top-k">Top-k</Term> keeps only the k most likely tokens;{" "}
        <Term id="top-p">top-p</Term> keeps the smallest set that covers p of the probability. Try
        them on real GPT-2 predictions, then draw.
      </p>
      <p className="text-muted text-sm">
        At high temperature small models produce nonsense tokens like “·Sk”: that long tail is why
        top-p exists.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The arithmetic --------------------------------------------------------------------------------- */

const TOKS = PROMPTS[1].top.slice(0, 4);
const MATH = [
  {
    title: "Scores (logits)",
    text: "The model's last layer gives each token a raw score, any number. These are GPT-2's real scores for four tokens after “…a cup of”.",
  },
  {
    title: "Divide by the temperature",
    text: "Temperature 0.5 doubles every score's distance from the others, making the leader stand out; temperature 2 halves it, making everything more alike.",
  },
  {
    title: "Exponentiate",
    text: "e to the power of each score makes every value positive and exaggerates the gaps.",
  },
  {
    title: "Normalise: softmax",
    text: "Divide each by the total so they add up to 100%. (Here only four tokens, so the shares differ from the full 50,257-token distribution.)",
  },
];

export function Arithmetic() {
  const [s, set] = useSceneState<SampleState>();
  const step = Math.min(s.mathFrame, MATH.length - 1);
  const f = MATH[step];
  const T = 0.5;
  const scaled = TOKS.map((t) => t.l / T);
  const m = Math.max(...scaled);
  const ex = scaled.map((x) => Math.exp(x - m));
  const sum = ex.reduce((a, b) => a + b, 0);
  return (
    <StepLayout
      eyebrow="Step through"
      title="From scores to probabilities"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface overflow-x-auto rounded-xl border p-3">
            <table className="w-full min-w-[20rem] text-left font-mono text-xs">
              <thead className="text-muted text-[10px]">
                <tr>
                  <th className="py-1 font-normal">token</th>
                  <th className="font-normal">score</th>
                  {step >= 1 && <th className="font-normal">÷ 0.5</th>}
                  {step >= 2 && <th className="font-normal">e^x (relative)</th>}
                  {step >= 3 && <th className="font-normal">probability</th>}
                </tr>
              </thead>
              <tbody>
                {TOKS.map((t, i) => (
                  <tr key={t.t} className={cn(i === 0 && step >= 3 && "text-accent font-semibold")}>
                    <td className="py-1">{show(t.t)}</td>
                    <td>{t.l.toFixed(2)}</td>
                    {step >= 1 && <td>{scaled[i].toFixed(2)}</td>}
                    {step >= 2 && <td>{ex[i].toFixed(3)}</td>}
                    {step >= 3 && <td>{((ex[i] / sum) * 100).toFixed(1)}%</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Stepper step={step} count={MATH.length} onChange={(n) => set({ mathFrame: n })} />
          <FrameCaption frameKey={step} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Behind the dials is one short formula, <Term id="softmax">softmax</Term> with a temperature.
        Step through it at temperature 0.5.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: temperature 0 ------------------------------------------------------------------------ */

export function Deterministic() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Is temperature 0 repeatable?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="temp-zero"
            prompt="A team sets temperature to 0 so their test answers are exactly repeatable. Is that guaranteed?"
            options={[
              {
                id: "no",
                label:
                  "No: it picks the top token each time, but tiny numerical differences on busy servers can change which token is on top, so outputs can still vary",
                correct: true,
                feedback:
                  "Right. Providers say so in their docs, and researchers traced it to calculations that depend on how requests are batched together. One study got 80 different completions from 1,000 identical runs.",
              },
              {
                id: "yes",
                label: "Yes, temperature 0 is always identical",
                feedback: "Close in practice, but not guaranteed on shared servers.",
              },
              {
                id: "seed",
                label: "Only if you also set top-k to 1",
                feedback:
                  "Top-k 1 is the same as greedy; the variation comes from the hardware maths, not the settings.",
              },
              {
                id: "never",
                label: "No, temperature 0 still samples randomly",
                feedback:
                  "Temperature 0 means greedy: always the top token. The variation is elsewhere.",
              },
            ]}
            explanation="For repeatable tests, compare meaning and structure rather than exact strings, and record the full output alongside any score."
          />
        </div>
      }
    >
      <p>
        The dials are about choice. But even without choice, is the same input always the same
        output?
      </p>
    </StepLayout>
  );
}

/* 4 ─ Settings you'll meet ------------------------------------------------------------------------ */

const SETTINGS: [string, string][] = [
  [
    "OpenAI",
    "temperature 0–2 and top_p. Reasoning models reject them when reasoning is on: you steer with reasoning effort instead.",
  ],
  [
    "Anthropic",
    "Newer Claude models accept only the default temperature (1.0) and reject top_k; thinking effort replaces most tuning.",
  ],
  [
    "Google Gemini",
    "temperature 0–2; for Gemini 3 models Google recommends keeping the default 1.0, as lower values can cause loops.",
  ],
  [
    "Open-weight models",
    "Full control when you run them yourself (for example with vLLM): temperature, top-k, top-p, min-p and more.",
  ],
];

export function Settings() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Sampling settings you'll meet"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {SETTINGS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The trend: newer hosted models tune sampling themselves, especially reasoning models.
        You&apos;ll still meet these dials with open models and older APIs.
      </p>
      <p className="text-muted text-sm">
        As of September 2026; check your provider&apos;s current docs.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["A score for every token", "Softmax turns scores into probabilities."],
  ["Temperature", "Below 1 sharpens toward the favourite; above 1 flattens toward the tail."],
  ["Top-k and top-p", "Cut the long tail of unlikely tokens before choosing."],
  ["Greedy isn't guaranteed repeatable", "Server maths can still vary outputs."],
  ["Newer models tune it for you", "Reasoning models steer with effort, not temperature."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>That completes the inside of the transformer.</p>
      <p>Next chapter: how models learn in the first place, starting with pretraining.</p>
    </StepLayout>
  );
}
