"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import bench from "./bench.json";
import { GPUS, MBU, MFU, MODELS, kvBytesPerToken, timing } from "./model";
import type { InferState } from "./state";

const fmtTime = (s: number) =>
  s < 1
    ? `${Math.round(s * 1000)} ms`
    : s < 60
      ? `${s.toFixed(1)} s`
      : `${(s / 60).toFixed(1)} min`;

/* 1 ─ Two phases ⭐ ---------------------------------------------------------------------------------- */

const PROMPT = ["Summarise", "this", "email", "for", "our", "support", "queue", ":", "…"];
const ANSWER = ["Customer", "charged", "twice", ";", "wants", "refund", "."];

const PHASES: { title: string; text: string }[] = [
  {
    title: "A request arrives",
    text: "Think of a chef whose recipes fill a huge pantry. To do anything, the chef has to walk past every shelf: that walk is reading all the model's weights from memory.",
  },
  {
    title: "Prefill: read the whole prompt at once",
    text: "All the prompt's tokens go through the model together, in one walk through the pantry. Lots of arithmetic happens in parallel, so this phase is limited by the GPU's compute.",
  },
  {
    title: "The first token appears",
    text: "The wait until now is the time to first token (TTFT). Longer prompts mean more arithmetic, so a longer wait.",
  },
  {
    title: "Decode: one token per walk",
    text: "Each new token needs another complete walk through the pantry, for very little arithmetic. This phase is limited by how fast memory can be read.",
  },
  {
    title: "Done",
    text: "The answer's speed is measured in time per output token, or tokens per second. A long answer means many walks, which is why long replies feel slow even when they start quickly.",
  },
];

export function TwoPhases() {
  const [s, set] = useSceneState<InferState>();
  const f = Math.min(s.phase, PHASES.length - 1);
  const shown = f >= 4 ? ANSWER.length : f === 3 ? 4 : f === 2 ? 1 : 0;
  return (
    <StepLayout
      eyebrow="Step through"
      title="Two phases"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface grid gap-3 rounded-xl border p-3">
            <div>
              <p className="text-muted mb-1 text-[10px] tracking-wide uppercase">Prompt</p>
              <div className="flex flex-wrap gap-1">
                {PROMPT.map((t, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      scale: f === 1 ? [1, 1.12, 1] : 1,
                      backgroundColor: f >= 1 ? "var(--accent-soft)" : "var(--surface-2)",
                    }}
                    transition={{ duration: 0.6 }}
                    className="rounded px-1.5 py-0.5 font-mono text-xs"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
            <div className="relative">
              <p className="text-muted mb-1 text-[10px] tracking-wide uppercase">
                Model weights (the pantry)
              </p>
              <div className="bg-surface-2 relative h-8 overflow-hidden rounded-lg">
                {Array.from({ length: 24 }, (_, i) => (
                  <span
                    key={i}
                    className="border-line absolute inset-y-1 w-[3%] rounded-sm border"
                    style={{ left: `${2 + i * 4}%` }}
                  />
                ))}
                {(f === 1 || f === 3) && (
                  <motion.span
                    key={`${f}`}
                    className="bg-accent absolute inset-y-0 w-2 rounded"
                    initial={{ left: "0%" }}
                    animate={{ left: "98%" }}
                    transition={{
                      duration: f === 1 ? 1.4 : 0.5,
                      repeat: f === 3 ? Infinity : 0,
                      ease: "linear",
                    }}
                  />
                )}
              </div>
              <p className="text-muted mt-1 text-[11px]">
                {f === 1
                  ? "One walk, all 9 prompt tokens together"
                  : f === 3
                    ? "One walk per new token"
                    : " "}
              </p>
            </div>
            <div>
              <p className="text-muted mb-1 text-[10px] tracking-wide uppercase">Answer</p>
              <div className="flex min-h-7 flex-wrap gap-1">
                <AnimatePresence>
                  {ANSWER.slice(0, shown).map((t, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: f === 3 || f === 4 ? i * 0.15 : 0 }}
                      className="border-accent/50 rounded border px-1.5 py-0.5 font-mono text-xs"
                    >
                      {t}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex h-5 overflow-hidden rounded text-[10px]">
              <motion.div
                animate={{ width: f >= 1 ? "35%" : "0%" }}
                className="bg-viz-compute/70 grid place-items-center overflow-hidden whitespace-nowrap"
              >
                prefill
              </motion.div>
              <motion.div
                animate={{ width: f >= 4 ? "65%" : f === 3 ? "35%" : f === 2 ? "4%" : "0%" }}
                className="bg-accent/70 grid place-items-center overflow-hidden whitespace-nowrap"
              >
                decode
              </motion.div>
            </div>
          </div>
          <Stepper step={f} count={PHASES.length} onChange={(n) => set({ phase: n })} />
          <FrameCaption frameKey={f} title={PHASES[f].title}>
            {PHASES[f].text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Running a trained model to get answers is called <Term id="inference">inference</Term>. From
        pressing Enter to the last word, it happens in two very different phases.
      </p>
      <p>Step through them.</p>
    </StepLayout>
  );
}

/* 2 ─ Measured on a laptop ------------------------------------------------------------------------ */

export function Measured() {
  const runs = bench.runs;
  const W = 520;
  const H = 150;
  const maxT = Math.max(...runs.map((r) => r.ttft));
  const maxP = Math.max(...runs.map((r) => r.prompt));
  const x = (p: number) => 44 + (p / maxP) * (W - 70);
  const yT = (t: number) => H - 22 - (t / maxT) * (H - 40);
  const maxD = 120;
  const yD = (d: number) => H - 22 - (d / maxD) * (H - 40);
  return (
    <StepLayout
      eyebrow="Real measurements"
      title="Measured on a laptop"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-3">
            {(
              [
                [
                  "Time to first token",
                  (r: (typeof runs)[number]) => yT(r.ttft),
                  (r: (typeof runs)[number]) => fmtTime(r.ttft / 1000),
                  "var(--viz-compute)",
                ],
                [
                  "Time per output token",
                  (r: (typeof runs)[number]) => yD(r.tpot),
                  (r: (typeof runs)[number]) => `${Math.round(r.tpot)} ms`,
                  "var(--accent)",
                ],
              ] as const
            ).map(([title, y, label, color]) => (
              <div key={title} className="border-line bg-surface rounded-xl border p-3">
                <p className="text-muted text-[11px]">{title}, by prompt length</p>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title}>
                  <line x1={40} x2={W - 20} y1={H - 22} y2={H - 22} stroke="var(--line-strong)" />
                  <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth={2.5}
                    points={runs.map((r) => `${x(r.prompt)},${y(r)}`).join(" ")}
                  />
                  {runs.map((r) => (
                    <g key={r.prompt}>
                      <circle cx={x(r.prompt)} cy={y(r)} r={4} fill={color} />
                      <text
                        x={x(r.prompt)}
                        y={y(r) - 9}
                        textAnchor="middle"
                        className="fill-fg text-[11px]"
                      >
                        {label(r)}
                      </text>
                      <text
                        x={x(r.prompt)}
                        y={H - 6}
                        textAnchor="middle"
                        className="fill-muted text-[10px]"
                      >
                        {r.prompt}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Measured by us: {bench.model.replace("onnx-community/", "")} ({bench.dtype}) on an Apple
            M3 Pro laptop CPU with Transformers.js, prompts of 73 to 2,053 tokens, 64 output tokens.
            A data-centre GPU is hundreds of times faster, but the shape is the same.
          </p>
        </div>
      }
    >
      <p>
        We timed a real 1.5-billion-parameter model on a laptop, growing the prompt from 73 to 2,053
        tokens.
      </p>
      <p>
        The wait for the first token grew with the prompt, from half a second to 14 seconds: prefill
        has more to read. The time for each following token barely moved, because every decode step
        re-reads the same weights.
      </p>
      <p className="text-muted text-sm">
        It creeps up slightly because each step also reads the growing{" "}
        <Term id="kv-cache">KV cache</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Request timeline ⭐ (simulator) ------------------------------------------------------------- */

const PROMPTS = [100, 500, 2_000, 8_000, 32_000, 100_000];
const ANSWERS = [20, 100, 300, 1_000, 4_000];

export function Timeline() {
  const [s, set] = useSceneState<InferState>();
  const m = MODELS.find((x) => x.id === s.model)!;
  const g = GPUS.find((x) => x.id === s.gpu)!;
  const t = timing(m, g, s.prompt, s.answer);
  const pShare = t.total ? (t.prefill / t.total) * 100 : 0;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A request, start to finish"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Segmented
              size="sm"
              value={s.model}
              options={MODELS.map((x) => [x.id, x.name] as [string, string])}
              onChange={(v) => set({ model: v })}
            />
            <Segmented
              size="sm"
              value={s.gpu}
              options={GPUS.map((x) => [x.id, x.name] as [string, string])}
              onChange={(v) => set({ gpu: v })}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Picker
              label="Prompt length (tokens)"
              values={PROMPTS}
              value={s.prompt}
              onChange={(v) => set({ prompt: v })}
            />
            <Picker
              label="Answer length (tokens)"
              values={ANSWERS}
              value={s.answer}
              onChange={(v) => set({ answer: v })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="flex h-7 overflow-hidden rounded-lg text-[10px]">
              <motion.div
                animate={{ width: `${Math.max(pShare, 1)}%` }}
                className="bg-viz-compute/70 grid place-items-center overflow-hidden whitespace-nowrap"
              >
                {pShare > 12 && "prefill"}
              </motion.div>
              <motion.div
                animate={{ width: `${Math.max(100 - pShare, 1)}%` }}
                className="bg-accent/70 grid place-items-center overflow-hidden whitespace-nowrap"
              >
                {100 - pShare > 12 && `decode × ${s.answer.toLocaleString("en-US")}`}
              </motion.div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Time to first token", fmtTime(t.ttft)],
                ["Tokens per second", `${Math.round(1 / t.tpot)}`],
                ["Whole answer", fmtTime(t.total)],
                ["Weights to read per token", `${t.weightsGB.toFixed(0)} GB`],
              ].map(([l, v]) => (
                <div key={l} className="bg-surface-2 rounded-lg px-2.5 py-1.5">
                  <p className="text-muted text-[10px]">{l}</p>
                  <motion.p
                    key={v}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-sm"
                  >
                    {v}
                  </motion.p>
                </div>
              ))}
            </div>
            {!t.fits && (
              <p className="text-bad mt-2 text-xs">
                Weights plus KV cache won&apos;t fit in this GPU&apos;s memory: you&apos;d need more
                GPUs.
              </p>
            )}
          </div>
          <p className="text-subtle text-[10px]">
            Estimate for one request alone on one GPU. Prefill = 2 × parameters × prompt tokens of
            arithmetic at {MFU * 100}% of peak; each decode step reads all weights plus the KV cache
            at {MBU * 100}% of peak bandwidth. Real engines vary; the attention cost of very long
            prompts is left out.
          </p>
        </div>
      }
    >
      <p>
        Now at data-centre scale. Change the prompt, the answer, the model and the GPU, and see
        which number moves.
      </p>
      <p>
        A long prompt raises the <Term id="ttft">time to first token</Term>. A long answer raises
        the total. A GPU with faster memory raises tokens per second.
      </p>
      <p className="text-muted text-sm">
        Tip: people read roughly 4 to 5 words a second, so anything above about 20 tokens a second
        already streams faster than we read.
      </p>
    </StepLayout>
  );
}

function Picker({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: number[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="text-muted mb-1 text-[11px]">{label}</p>
      <div className="flex flex-wrap gap-1">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={v === value}
            onClick={() => onChange(v)}
            className={cn(
              "rounded-full border px-2 py-0.5 font-mono text-[11px]",
              v === value ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {v >= 1000 ? `${v / 1000}k` : v}
          </button>
        ))}
      </div>
    </div>
  );
}

/* 4 ─ Predict: the bandwidth ceiling ------------------------------------------------------------- */

export function Ceiling() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="The memory speed limit"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="ceiling"
            prompt="Llama 3.1 8B in BF16 has 16 GB of weights. An H100 reads memory at 3.35 TB/s (3,350 GB/s). For a single user, what's the most tokens per second it could possibly generate?"
            min={0}
            max={1000}
            step={10}
            unit=" tokens/s"
            answer={210}
            tolerance={30}
            explanation="About 210: 3,350 GB/s ÷ 16 GB ≈ 209 walks through the weights per second, and each walk makes one token. Real engines reach perhaps 70% of that. It's a ceiling set by memory, not compute: the H100's arithmetic sits mostly idle during decode. Smaller weights (next module) raise the ceiling."
          />
        </div>
      }
    >
      <p>
        During decode, every token needs one complete read of the weights. So{" "}
        <Term id="memory-bandwidth">memory bandwidth</Term> sets a hard speed limit for one user.
      </p>
      <p className="text-muted text-sm">Work it out roughly; it&apos;s a division.</p>
    </StepLayout>
  );
}

/* 5 ─ The KV cache ------------------------------------------------------------------------------------ */

const KV_FRAMES = [
  {
    title: "Without a cache",
    text: "To pick each new token, the model would push the entire text so far through every layer again: the prompt, plus everything it has written.",
  },
  {
    title: "Most of that work repeats",
    text: "The keys and values for earlier tokens never change. Recomputing them every step wastes almost all the work.",
  },
  {
    title: "With the KV cache",
    text: "Keep each token's keys and values in GPU memory. Each step then processes just one new token and reads the cache for the rest.",
  },
  {
    title: "The price: memory",
    text: "The cache grows with every token of every conversation: for Llama 3.1 8B, 128 KiB per token, or 4 GiB for a 32k-token context. It's what fills a GPU when serving many users.",
  },
];

export function KvCache() {
  const [s, set] = useSceneState<InferState>();
  const f = Math.min(s.kv, KV_FRAMES.length - 1);
  const cached = f >= 2;
  const P = 1000;
  const A = 500;
  const without = A * P + (A * (A - 1)) / 2;
  const withCache = P + A;
  const rows = 6;
  return (
    <StepLayout
      eyebrow="Step through"
      title="The KV cache"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[11px]">
              Tokens pushed through the model at each step (4-token prompt, 6 new tokens)
            </p>
            <div className="grid gap-1">
              {Array.from({ length: rows }, (_, r) => (
                <div key={r} className="flex items-center gap-1">
                  <span className="text-muted w-12 text-[10px]">step {r + 1}</span>
                  {Array.from({ length: 4 + r + 1 }, (_, c) => {
                    const isNew = c === 4 + r;
                    const reused = cached && !isNew;
                    return (
                      <motion.span
                        key={c}
                        layout
                        animate={{ opacity: reused ? 0.5 : 1 }}
                        className={cn(
                          "size-4 rounded-sm border",
                          isNew
                            ? "border-accent bg-accent"
                            : reused
                              ? "border-line border-dashed"
                              : f === 1
                                ? "border-bad/60 bg-bad/40"
                                : "border-viz-data/60 bg-viz-data/40",
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                !cached ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[11px]">
                1,000-token prompt, 500-token answer: no cache
              </p>
              <p className="font-mono">{without.toLocaleString("en-US")} token passes</p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                cached ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[11px]">With the KV cache</p>
              <p className="font-mono">
                {withCache.toLocaleString("en-US")} token passes ({Math.round(without / withCache)}×
                less)
              </p>
            </div>
          </div>
          <Stepper step={f} count={KV_FRAMES.length} onChange={(n) => set({ kv: n })} />
          <FrameCaption frameKey={f} title={KV_FRAMES[f].title}>
            {KV_FRAMES[f].text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Recall <Term id="attention">attention</Term>: each token looks back at earlier tokens&apos;
        keys and values. Those never change once computed.
      </p>
      <p>
        So engines keep them: the <Term id="kv-cache">KV cache</Term>. Keeping it between requests
        that share the same beginning is exactly what prompt caching does.
      </p>
      <p className="text-muted text-sm">
        Cache size for this model: {(kvBytesPerToken(MODELS[0]) / 1024).toFixed(0)} KiB per token.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function WhatMoves() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What does each change speed up?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="what-moves"
            prompt="Each change mainly improves one number. Which?"
            categories={[
              { id: "ttft", label: "Time to first token" },
              { id: "tps", label: "Tokens per second" },
            ]}
            items={[
              {
                id: "shorter-prompt",
                label: "Cut the system prompt from 6,000 to 1,500 tokens",
                category: "ttft",
                why: "Less to prefill. Decode speed hardly changes.",
              },
              {
                id: "cache-hit",
                label: "Prompt-cache hits on the shared instructions",
                category: "ttft",
                why: "The cached prefix skips most of the prefill work.",
              },
              {
                id: "bandwidth",
                label: "Move to a GPU with faster memory (H100 → H200)",
                category: "tps",
                why: "Decode reads all the weights for every token: faster memory, more tokens per second.",
              },
              {
                id: "smaller-weights",
                label: "Store the weights in 8 bits instead of 16",
                category: "tps",
                why: "Half the bytes to read per token, so up to twice the decode speed (next module).",
              },
              {
                id: "compute",
                label: "A chip with twice the arithmetic but the same memory speed",
                category: "ttft",
                why: "Prefill is limited by arithmetic; decode wouldn't get faster.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Prefill is limited by arithmetic; decode by memory. Place each change.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Two phases", "Prefill reads the prompt in parallel; decode writes one token at a time."],
  ["Two numbers", "Time to first token grows with the prompt; tokens per second is set by decode."],
  [
    "Memory is the bottleneck",
    "Each token needs a full read of the weights, so bandwidth caps speed.",
  ],
  ["The KV cache", "Saves recomputing the past, at the cost of GPU memory per token."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([tt, d], i) => (
            <motion.div
              key={tt}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{tt}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Weights and the KV cache both live in GPU memory, and memory is finite.</p>
      <p>Next: model size, memory and quantization.</p>
    </StepLayout>
  );
}
