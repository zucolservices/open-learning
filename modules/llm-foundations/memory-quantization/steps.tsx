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
import data from "./data.json";
import { GPUS, MODELS, PRECISIONS, bytesPerParam, memory } from "./model";
import type { MemState } from "./state";

const GB = (b: number) => b / 1e9;
const fmtGB = (b: number) => (GB(b) >= 100 ? `${Math.round(GB(b))} GB` : `${GB(b).toFixed(1)} GB`);

/* 1 ─ Rounding the weights ⭐ ----------------------------------------------------------------------- */

function quantize(values: number[], bits: number) {
  if (bits >= 16) return values;
  const qmax = 2 ** (bits - 1) - 1;
  const s = Math.max(...values.map(Math.abs)) / qmax;
  return values.map((v) => Math.round(v / s) * s);
}

export function Rounding() {
  const [s, set] = useSceneState<MemState>();
  const orig = data.gpt2.sample.orig;
  const q = quantize(orig, s.bits);
  const max = Math.max(...orig.map(Math.abs));
  const levels =
    s.bits >= 16
      ? []
      : Array.from({ length: 2 ** s.bits - 1 }, (_, i) => i - (2 ** (s.bits - 1) - 1));
  const err = orig.reduce((a, v, i) => a + Math.abs(v - q[i]), 0) / orig.length;
  const W = 560;
  const H = 180;
  const y = (v: number) => H / 2 - (v / max) * (H / 2 - 14);
  const x = (i: number) => 24 + i * ((W - 40) / (orig.length - 1));
  return (
    <StepLayout
      eyebrow="Real weights"
      title="Rounding the weights"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={String(s.bits)}
            options={[
              ["16", "16 bits"],
              ["8", "8 bits"],
              ["4", "4 bits"],
              ["3", "3 bits"],
              ["2", "2 bits"],
            ]}
            onChange={(v) => set({ bits: Number(v) })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Original and rounded weights"
            >
              {levels.length <= 31 &&
                levels.map((l) => {
                  const v = (l * max) / (2 ** (s.bits - 1) - 1);
                  return (
                    <line
                      key={l}
                      x1={10}
                      x2={W - 6}
                      y1={y(v)}
                      y2={y(v)}
                      stroke="var(--line-strong)"
                      strokeOpacity={0.35}
                    />
                  );
                })}
              <line x1={10} x2={W - 6} y1={y(0)} y2={y(0)} stroke="var(--line-strong)" />
              {orig.map((v, i) => (
                <g key={i}>
                  <line
                    x1={x(i)}
                    x2={x(i)}
                    y1={y(v)}
                    y2={y(q[i])}
                    stroke="var(--bad)"
                    strokeWidth={2}
                  />
                  <circle cx={x(i)} cy={y(v)} r={4} fill="var(--viz-data)" />
                  <motion.circle
                    cx={x(i)}
                    animate={{ cy: y(q[i]) }}
                    r={4}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={2}
                  />
                </g>
              ))}
            </svg>
            <p className="text-muted mt-1 flex flex-wrap gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="bg-viz-data inline-block size-2.5 rounded-full" /> original
              </span>
              <span className="flex items-center gap-1">
                <span className="border-accent inline-block size-2.5 rounded-full border-2" />{" "}
                stored at {s.bits} bits
              </span>
              <span>
                {s.bits >= 16 ? "no rounding" : `${2 ** s.bits - 1} allowed values (grey lines)`}
              </span>
              <span className="font-mono">average error {err.toFixed(4)}</span>
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            16 real weights from GPT-2 (layer 1, first MLP), rounded to the nearest allowed value
            with one scale for the group. The tall one is an outlier: it sets the scale.
          </p>
        </div>
      }
    >
      <p>
        A model is billions of numbers. Normally each is stored in 16 bits. What if we stored them
        more roughly, like rounding prices to the nearest rupee instead of the nearest paisa?
      </p>
      <p>
        That&apos;s <Term id="quantization">quantization</Term>. Fewer bits means fewer allowed
        values, so each weight moves a little. Try it on real weights.
      </p>
      <p className="text-muted text-sm">
        At 2 bits nearly everything collapses to zero, because one big outlier stretches the scale.
        Handling outliers is what good quantization methods are about.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Will it fit? ⭐ (calculator) ------------------------------------------------------------------ */

const CONTEXTS = [2_000, 8_000, 32_000, 128_000];
const USERS = [1, 8, 32, 128];

export function WillItFit() {
  const [s, set] = useSceneState<MemState>();
  const m = MODELS.find((x) => x.id === s.model)!;
  const g = GPUS.find((x) => x.id === s.gpu)!;
  const mem = memory(m, s.precision, s.context, s.users);
  const cap = g.memoryGB * 1e9;
  const gpus = Math.max(1, Math.ceil(mem.total / cap));
  const scaleMax = Math.max(mem.total, cap);
  const activeBytes = m.active * bytesPerParam(s.precision);
  // Speed ceiling with the weights split over just enough GPUs to hold them.
  const weightGpus = Math.max(1, Math.ceil((mem.weights * 1.1) / cap));
  const ceiling = (g.bandwidthTBs * 1e12 * weightGpus) / activeBytes;
  const seg = [
    ["Weights", mem.weights, "bg-accent"],
    ["KV cache", mem.cache, "bg-viz-data"],
    ["Overhead", mem.overhead, "bg-viz-idle"],
  ] as const;
  return (
    <StepLayout
      eyebrow="Calculator"
      title="Will it fit?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2">
            <ChipRow
              label="Model"
              value={s.model}
              items={MODELS.map((x) => [x.id, x.name])}
              onChange={(v) => set({ model: v })}
            />
            <ChipRow
              label="Precision"
              value={s.precision}
              items={PRECISIONS.map((x) => [x.id, x.label])}
              onChange={(v) => set({ precision: v })}
            />
            <ChipRow
              label="GPU"
              value={s.gpu}
              items={GPUS.map((x) => [x.id, `${x.name} · ${x.memoryGB} GB`])}
              onChange={(v) => set({ gpu: v })}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <ChipRow
                label="Context per user"
                value={String(s.context)}
                items={CONTEXTS.map((c) => [String(c), `${c / 1000}k`])}
                onChange={(v) => set({ context: Number(v) })}
              />
              <ChipRow
                label="Users at once"
                value={String(s.users)}
                items={USERS.map((u) => [String(u), String(u)])}
                onChange={(v) => set({ users: Number(v) })}
              />
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="relative h-8 overflow-hidden rounded-lg bg-[var(--surface-2)]">
              <div className="flex h-full">
                {seg.map(([l, v, c]) => (
                  <motion.div
                    key={l}
                    animate={{ width: `${(v / scaleMax) * 100}%` }}
                    className={cn("h-full", c)}
                    title={`${l}: ${fmtGB(v)}`}
                  />
                ))}
              </div>
              {Array.from({ length: Math.min(gpus, 12) }, (_, i) => (
                <span
                  key={i}
                  className="border-fg absolute inset-y-0 border-r-2 border-dashed"
                  style={{ left: `${(((i + 1) * cap) / scaleMax) * 100}%` }}
                />
              ))}
            </div>
            <div className="text-muted mt-2 flex flex-wrap gap-3 text-[11px]">
              {seg.map(([l, v, c]) => (
                <span key={l} className="flex items-center gap-1">
                  <span className={cn("inline-block size-2.5 rounded-sm", c)} /> {l} {fmtGB(v)}
                </span>
              ))}
              <span>dashed line = one GPU&apos;s memory</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Stat label="Total memory" value={fmtGB(mem.total)} />
              <Stat label={`${g.name}s needed`} value={String(gpus)} bad={gpus > 1} />
              <Stat label="Decode ceiling, one user" value={`${Math.round(ceiling)} tokens/s`} />
            </div>
            {m.note && (
              <p className="text-muted mt-2 text-[11px]">
                {m.note}: memory holds all {Math.round(m.params / 1e9)}B parameters, but each token
                reads only {m.active / 1e9}B, which is why it&apos;s fast for its size.
              </p>
            )}
          </div>
          <p className="text-subtle text-[10px]">
            Weights = parameters × bytes (4-bit includes per-group scales, ≈4.5 bits). KV cache =
            per-token size × context × users, at 16 bits. Overhead 10%. Ceiling = bandwidth ÷ bytes
            read per token, split over just enough GPUs to hold the weights; real speeds are lower.
            Estimates only.
          </p>
        </div>
      }
    >
      <p>
        GPU memory must hold the <Term id="parameter">weights</Term>, plus the{" "}
        <Term id="kv-cache">KV cache</Term> for every conversation in progress, plus some working
        space.
      </p>
      <p>
        Pick a model and a GPU. Then try 4-bit, or 128 users at once, and see what fills the memory.
      </p>
      <p className="text-muted text-sm">
        Rule of thumb: parameters in billions × bytes per parameter = gigabytes of weights. 70B at
        16 bits ≈ 140 GB.
      </p>
    </StepLayout>
  );
}

function ChipRow({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-muted mb-1 text-[11px]">{label}</p>
      <div className="flex flex-wrap gap-1">
        {items.map(([v, l]) => (
          <button
            key={v}
            type="button"
            aria-pressed={v === value}
            onClick={() => onChange(v)}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[11px]",
              v === value ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className={cn("rounded-lg px-2.5 py-1.5", bad ? "bg-bad/10" : "bg-surface-2")}>
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

/* 3 ─ What do you lose? ⭐ (real sweep) ------------------------------------------------------------- */

export function WhatYouLose() {
  const [s, set] = useSceneState<MemState>();
  const runs = data.gpt2.runs;
  const bits = [8, 6, 4, 3];
  const W = 540;
  const H = 180;
  const x = (b: number) => 50 + ((8 - b) / 5) * (W - 90);
  const ly = (p: number) => Math.log10(p);
  const lo = ly(30);
  const hi = ly(1200);
  const y = (p: number) => H - 24 - ((ly(Math.min(p, 1200)) - lo) / (hi - lo)) * (H - 40);
  const series = [
    { group: null, label: "One scale per column", color: "var(--viz-data)" },
    { group: 32, label: "One scale per 32 weights", color: "var(--accent)" },
  ];
  const gens = data.gpt2.gens;
  const gen = gens[s.gen];
  return (
    <StepLayout
      eyebrow="Real measurements"
      title="What do you lose?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[11px]">
              GPT-2 perplexity on a 325-token passage (lower is better; log scale). Full precision:{" "}
              {data.gpt2.base}
            </p>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Perplexity by bits"
            >
              {[30, 100, 300, 1000].map((v) => (
                <g key={v}>
                  <line
                    x1={44}
                    x2={W - 30}
                    y1={y(v)}
                    y2={y(v)}
                    stroke="var(--line-strong)"
                    strokeOpacity={0.3}
                  />
                  <text x={38} y={y(v) + 3} textAnchor="end" className="fill-muted text-[9px]">
                    {v}
                  </text>
                </g>
              ))}
              <line
                x1={44}
                x2={W - 30}
                y1={y(data.gpt2.base)}
                y2={y(data.gpt2.base)}
                stroke="var(--good)"
                strokeDasharray="4 3"
              />
              {bits.map((b) => (
                <text
                  key={b}
                  x={x(b)}
                  y={H - 6}
                  textAnchor="middle"
                  className="fill-muted text-[10px]"
                >
                  {b} bits
                </text>
              ))}
              {series.map((sr) => {
                const pts = bits.map((b) =>
                  runs.find((r) => r.bits === b && r.group === sr.group)!,
                );
                return (
                  <g key={sr.label}>
                    <polyline
                      fill="none"
                      stroke={sr.color}
                      strokeWidth={2.5}
                      points={pts.map((r) => `${x(r.bits)},${y(r.ppl)}`).join(" ")}
                    />
                    {pts.map((r) => (
                      <g key={r.bits}>
                        <circle cx={x(r.bits)} cy={y(r.ppl)} r={4} fill={sr.color} />
                        <text
                          x={x(r.bits) + 6}
                          y={y(r.ppl) + (sr.group ? 12 : -6)}
                          className="fill-fg text-[10px]"
                        >
                          {r.ppl > 1000 ? "1000+" : r.ppl.toFixed(1)}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })}
            </svg>
            <p className="text-muted flex flex-wrap gap-3 text-[11px]">
              {series.map((sr) => (
                <span key={sr.label} className="flex items-center gap-1.5">
                  <span className="inline-block h-0.5 w-5" style={{ background: sr.color }} />{" "}
                  {sr.label}
                </span>
              ))}
              <span className="flex items-center gap-1.5">
                <span className="border-good inline-block w-5 border-t border-dashed" /> full
                precision
              </span>
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="mb-2 flex flex-wrap gap-1">
              {gens.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => set({ gen: i })}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[11px]",
                    i === s.gen ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  )}
                >
                  {g.bits === 32 ? "Full" : `${g.bits}-bit${g.group ? " (groups)" : ""}`}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={s.gen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs"
              >
                <span className="text-muted">{data.gpt2.prompt}</span>
                <span className="font-semibold">{gen.text.replace(/\n+/g, " ")}</span>
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="text-subtle text-[10px]">
            Measured by us: GPT-2 small, all attention and MLP weights rounded to the nearest level
            (embeddings kept), greedy continuations. A simple method; GPTQ, AWQ and llama.cpp&apos;s
            formats do better at the same bits.
          </p>
        </div>
      }
    >
      <p>
        <Term id="perplexity">Perplexity</Term> measures how surprised a model is by real text:
        lower is better. We rounded every weight in GPT-2 and measured it.
      </p>
      <p>
        8 bits is free. 4 bits costs little if each small group of weights gets its own scale. 3
        bits hurts, and 2 bits destroys the model. Read the continuations to feel the difference.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Not all 8-bit is equal (real ONNX files) ----------------------------------------------------- */

export function MethodMatters() {
  const runs = data.qwen.runs.filter((r) => r.dtype !== "q4");
  const base = runs.find((r) => r.dtype === "fp16")!.ppl;
  const label: Record<string, string> = {
    fp16: "16-bit",
    q8: "8-bit (weights and activations, simple rounding)",
    q4f16: "4-bit weights, 16-bit everything else",
  };
  return (
    <StepLayout
      eyebrow="Real files"
      title="Not all 8-bit is equal"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Published file</th>
                  <th className="px-3 py-2 font-medium">Size</th>
                  <th className="px-3 py-2 font-medium">Perplexity</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr key={r.dtype} className="border-line border-t">
                    <td className="px-3 py-2">{label[r.dtype]}</td>
                    <td className="px-3 py-2 font-mono">{r.sizeGB.toFixed(2)} GB</td>
                    <td
                      className={cn(
                        "px-3 py-2 font-mono",
                        r.ppl > base * 1.5 && "text-bad font-semibold",
                      )}
                    >
                      {r.ppl.toFixed(1)}{" "}
                      <span className="text-muted">
                        ({r.ppl > base ? "+" : ""}
                        {Math.round((r.ppl / base - 1) * 100)}%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "GPTQ (2022)",
                "Rounds weights layer by layer, correcting the error as it goes. 3–4 bits with little loss.",
              ],
              [
                "AWQ (2023)",
                "Protects the ~1% of weights that matter most, found from real activations.",
              ],
              [
                "GGUF (llama.cpp)",
                "File format with group-wise “k-quants”, popular for running models locally.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted text-[11px]">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Measured by us: onnx-community/Qwen2.5-1.5B-Instruct ONNX files (fp16, quantized, q4f16)
            on the same 328-token passage; sizes from Hugging Face. A 2025 study (Kurtic et al.)
            found FP8 effectively lossless and well-made INT8 within 1–3%, so this file is a bad
            export, not a law of nature.
          </p>
        </div>
      }
    >
      <p>
        We measured three real, downloadable versions of the same 1.5B model. The 8-bit file is{" "}
        <em>worse</em> than the 4-bit one: it also rounds the activations, crudely, and this model
        doesn&apos;t tolerate that.
      </p>
      <p>
        The number of bits matters less than how the rounding is done. Always test the exact file
        you plan to deploy.
      </p>
      <p className="text-muted text-sm">
        Also note the 4-bit file isn&apos;t a quarter of the 16-bit one: parts like the embedding
        table are often kept at higher precision.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Mixture of experts -------------------------------------------------------------------------- */

const MOE_FRAMES = [
  {
    title: "A dense model uses everything",
    text: "In a normal (dense) model, every token passes through every weight. Llama 3.1 70B reads all 70B parameters for each token.",
  },
  {
    title: "Experts and a router",
    text: "A mixture-of-experts model splits each feed-forward layer into many “experts”. A small router picks a few per token: Mixtral uses 2 of 8.",
  },
  {
    title: "Different tokens, different experts",
    text: "Each token takes its own route. Over many tokens every expert gets used, so all of them must sit in memory.",
  },
  {
    title: "Big memory, small reads",
    text: "Mixtral holds 46.7B parameters but reads 12.9B per token. DeepSeek-V3 holds 671B and reads 37B. You pay memory for the total and speed for the active part.",
  },
];

const TOKENS = ["The", "monsoon", "reaches", "India"];
const ROUTES = [
  [1, 5],
  [0, 3],
  [2, 5],
  [6, 7],
];

export function MixtureOfExperts() {
  const [s, set] = useSceneState<MemState>();
  const f = Math.min(s.moe, MOE_FRAMES.length - 1);
  const tokenIdx = f === 2 ? 1 : 0;
  return (
    <StepLayout
      eyebrow="Step through"
      title="Mixture of experts"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface grid gap-3 rounded-xl border p-3">
            <div className="flex flex-wrap justify-center gap-1.5">
              {TOKENS.map((tk, i) => (
                <span
                  key={tk}
                  className={cn(
                    "rounded px-2 py-0.5 font-mono text-xs",
                    f >= 1 && i === tokenIdx ? "bg-accent text-accent-fg" : "bg-surface-2",
                  )}
                >
                  {tk}
                </span>
              ))}
            </div>
            {f >= 1 && (
              <p className="text-muted text-center text-[11px]">
                router → picks 2 experts for “{TOKENS[tokenIdx]}”
              </p>
            )}
            <div className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }, (_, e) => {
                const used =
                  f === 0
                    ? true
                    : f === 3
                      ? ROUTES.some((r) => r.includes(e))
                      : ROUTES[tokenIdx].includes(e);
                return (
                  <motion.div
                    key={e}
                    animate={{ opacity: used ? 1 : 0.3, scale: used && f >= 1 ? 1.05 : 1 }}
                    className={cn(
                      "grid h-14 place-items-center rounded-lg border text-[10px]",
                      used ? "border-accent bg-accent-soft" : "border-line bg-surface-2",
                    )}
                  >
                    {f === 0 ? "FFN" : `E${e + 1}`}
                  </motion.div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-surface-2 rounded-lg px-2.5 py-1.5">
                <p className="text-muted text-[10px]">In memory</p>
                <p className="font-mono">{f === 0 ? "70.6B (all)" : "46.7B (all 8 experts)"}</p>
              </div>
              <div className="bg-surface-2 rounded-lg px-2.5 py-1.5">
                <p className="text-muted text-[10px]">Read per token</p>
                <p className="font-mono">{f === 0 ? "70.6B" : "12.9B"}</p>
              </div>
            </div>
          </div>
          <Stepper step={f} count={MOE_FRAMES.length} onChange={(n) => set({ moe: n })} />
          <FrameCaption frameKey={f} title={MOE_FRAMES[f].title}>
            {MOE_FRAMES[f].text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Many of today&apos;s biggest open models are a <Term id="moe">mixture of experts</Term>:
        like a hospital with many specialists, where each patient sees only the two they need.
      </p>
      <p>Step through how that changes memory and speed.</p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoints ----------------------------------------------------------------------------------- */

export function PredictSize() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="Size it up"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="size-70b"
            prompt="Llama 3.1 70B stored at 4 bits per weight (ignore the small extra for scales). How many gigabytes of weights?"
            min={0}
            max={160}
            step={1}
            unit=" GB"
            answer={35}
            tolerance={5}
            explanation="About 35 GB: 70 billion × 0.5 bytes. With per-group scales it's nearer 40 GB, so it fits on one 80 GB H100 with room for the KV cache. At 16 bits it would be about 141 GB: two H100s just for the weights."
          />
        </div>
      }
    >
      <p>Use the rule of thumb: billions of parameters × bytes per parameter.</p>
    </StepLayout>
  );
}

export function FitsOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="One GPU or more?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="fits"
            prompt="Weights only: does each fit on one 80 GB H100?"
            categories={[
              { id: "fits", label: "Fits on one" },
              { id: "more", label: "Needs more" },
            ]}
            items={[
              {
                id: "8b16",
                label: "Llama 3.1 8B at 16 bits",
                category: "fits",
                why: "About 16 GB: plenty of room left for the KV cache.",
              },
              {
                id: "70b16",
                label: "Llama 3.1 70B at 16 bits",
                category: "more",
                why: "About 141 GB of weights: at least two H100s.",
              },
              {
                id: "70b4",
                label: "Llama 3.1 70B at 4 bits",
                category: "fits",
                why: "About 35–40 GB.",
              },
              {
                id: "mixtral16",
                label: "Mixtral 8x7B at 16 bits",
                category: "more",
                why: "All 46.7B parameters must be loaded: about 93 GB, even though only 12.9B are used per token.",
              },
              {
                id: "dsv3",
                label: "DeepSeek-V3 at 8 bits",
                category: "more",
                why: "671 GB of weights: a whole server of GPUs, despite reading only 37B per token.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Memory is set by the total parameters, even for mixture-of-experts models.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Parameters × bytes", "70B at 16 bits ≈ 140 GB; at 4 bits ≈ 35–40 GB. Then add the KV cache."],
  [
    "8 bits is usually free, 4 bits nearly",
    "With good methods (GPTQ, AWQ, FP8, group-wise formats). Below 4 bits, quality falls fast.",
  ],
  ["Method matters", "A crude export can hurt more than fewer bits. Test the exact file you ship."],
  [
    "MoE: memory for all, reads for few",
    "Load every expert; each token reads only the active ones.",
  ],
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
      <p>One model on one GPU is only the start: real services handle thousands of users.</p>
      <p>Next: serving at scale.</p>
    </StepLayout>
  );
}
