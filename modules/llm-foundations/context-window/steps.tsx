"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CtxState } from "./state";

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

/* 1 ─ Dog bites man ⭐ -------------------------------------------------------------------------------- */

const A = ["dog", "bites", "man"];
const B = ["man", "bites", "dog"];

export function WordOrder() {
  const [s, set] = useSceneState<CtxState>();
  const angle = (pos: number) => pos * 40; // degrees per position (one frequency, for illustration)
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Dog bites man"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.positions}
              onChange={(e) => set({ positions: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Add position information
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[A, B].map((sent, k) => (
              <div key={k} className="border-line bg-surface rounded-xl border p-3">
                <p className="mb-2 text-sm font-semibold">“{sent.join(" ")}”</p>
                <p className="text-muted mb-1 text-[10px]">What attention sees</p>
                <div className="flex flex-wrap gap-1.5">
                  {(s.positions ? sent : [...sent].sort()).map((w) => (
                    <motion.span
                      key={w}
                      layout
                      className="bg-viz-data/15 border-viz-data/40 rounded-md border px-2 py-1 font-mono text-xs"
                    >
                      {w}
                      {s.positions && (
                        <sub className="text-accent ml-0.5">{sent.indexOf(w) + 1}</sub>
                      )}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={String(s.positions)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                s.positions ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {s.positions
                ? "Now each token also carries where it is, so the two sentences look different, as they should."
                : "Attention on its own compares every token with every other, regardless of order: to it, both sentences are the same bag of words."}
            </motion.p>
          </AnimatePresence>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[10px]">
              One common method (RoPE) rotates each token&apos;s query and key by an angle that
              grows with its position.
            </p>
            <div className="flex items-center gap-4">
              <svg
                viewBox="-60 -60 120 120"
                className="size-28 shrink-0"
                role="img"
                aria-label="Rotation by position"
              >
                <circle r={48} fill="none" stroke="var(--line)" />
                {[0, s.rotPos].map((p, i) => {
                  const a = (angle(p) * Math.PI) / 180;
                  return (
                    <motion.line
                      key={i}
                      x1={0}
                      y1={0}
                      initial={false}
                      animate={{ x2: 45 * Math.cos(a), y2: -45 * Math.sin(a) }}
                      stroke={i === 0 ? "var(--viz-data)" : "var(--accent)"}
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <div className="flex-1 text-xs">
                <label className="flex items-center gap-2">
                  <span className="text-muted shrink-0">Distance apart</span>
                  <input
                    type="range"
                    min={0}
                    max={8}
                    value={s.rotPos}
                    onChange={(e) => set({ rotPos: Number(e.target.value) })}
                    className="flex-1 accent-[var(--accent)]"
                    aria-label="Distance between two tokens"
                  />
                  <span className="w-6 font-mono">{s.rotPos}</span>
                </label>
                <p className="text-muted mt-2">
                  The angle between two tokens depends only on how far apart they are, not on where
                  they sit in the text. So the model learns “the word two places back” once, and it
                  works everywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <p>
        &ldquo;Dog bites man&rdquo; is not news; &ldquo;man bites dog&rdquo; is. Same words,
        different order, different meaning.
      </p>
      <p>
        Attention compares every token with every other, so on its own it can&apos;t tell order
        apart. Models add <Term id="positional-encoding">position information</Term> to each token.
        Toggle it and compare.
      </p>
      <p className="text-muted text-sm">
        The 2017 transformer added fixed wave patterns to each embedding; most modern models use
        rotary position embeddings (RoPE, 2021) instead.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Stretch the window ⭐ -------------------------------------------------------------------------- */

// Llama 3.1 8B: 32 layers, 8 KV heads × 128 dims (GQA), 32 query heads; fp16 = 2 bytes.
const LAYERS = 32;
const HEAD_DIM = 128;
// MLA-style: DeepSeek-V2 reported a 93.3% smaller KV cache than its GQA-based predecessor (illustrative here).
const KV_HEADS: Record<CtxState["attn"], number> = { mha: 32, gqa: 8, mla: 8 * 0.067 };
const GPU_GB = 80;
const WEIGHTS_GB = 16; // 8B parameters × 2 bytes

function human(n: number) {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)} trillion`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
  if (n >= 1e3) return `${Math.round(n / 1e3)} thousand`;
  return String(Math.round(n));
}

function equivalent(tokens: number) {
  const words = tokens * 0.75;
  if (words < 1500) return "a couple of pages";
  if (words < 20000) return "a long report";
  if (words < 120000) return "a novel";
  if (words < 500000) return "several novels";
  return "the whole Bible (about 780,000 words), or more";
}

export function Stretch() {
  const [s, set] = useSceneState<CtxState>();
  const n = Math.round(10 ** s.logTokens);
  const pairs = (n * (n + 1)) / 2;
  const kvBytesPerToken = 2 * LAYERS * KV_HEADS[s.attn] * HEAD_DIM * 2;
  const kvGiB = (kvBytesPerToken * n) / 2 ** 30;
  const fits = kvGiB + WEIGHTS_GB <= GPU_GB;
  const barMax = Math.max(GPU_GB * 2, (WEIGHTS_GB + kvGiB) * 1.1);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Stretch the window"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <label className="flex items-center gap-3 text-xs">
            <span className="text-muted shrink-0">Tokens in context</span>
            <input
              type="range"
              min={3}
              max={6}
              step={0.05}
              value={s.logTokens}
              onChange={(e) => set({ logTokens: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Tokens in context"
            />
            <span className="w-24 text-right font-mono">{human(n)}</span>
          </label>
          <p className="text-muted text-xs">
            About <span className="text-fg font-medium">{human(n * 0.75)} words</span>:{" "}
            {equivalent(n)}.
          </p>
          {n > 131072 && (
            <p className="text-viz-compute text-[11px]">
              Llama 3.1 8B itself stops at 128,000 tokens; beyond that is hypothetical, to show how
              the numbers scale.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Attention design</span>
            <Segmented
              size="sm"
              value={s.attn}
              options={[
                ["mha", "Every head keeps keys"],
                ["gqa", "Shared keys (GQA)"],
                ["mla", "Compressed (MLA-style)"],
              ]}
              onChange={(v) => set({ attn: v as CtxState["attn"] })}
            />
          </div>
          <div className="border-line bg-surface space-y-3 rounded-xl border p-3">
            <div>
              <div className="text-muted mb-1 flex justify-between text-[10px]">
                <span>GPU memory (80 GB card): model weights + KV cache</span>
                <span className="font-mono">{(WEIGHTS_GB + kvGiB).toFixed(0)} GB</span>
              </div>
              <div className="bg-surface-2 relative h-4 overflow-hidden rounded">
                <div
                  className="bg-viz-meta/70 absolute inset-y-0 left-0"
                  style={{ width: `${(WEIGHTS_GB / barMax) * 100}%` }}
                />
                <motion.div
                  className={cn("absolute inset-y-0", fits ? "bg-accent/70" : "bg-bad/70")}
                  initial={false}
                  animate={{
                    left: `${(WEIGHTS_GB / barMax) * 100}%`,
                    width: `${Math.min(100, (kvGiB / barMax) * 100)}%`,
                  }}
                />
                <div
                  className="border-fg absolute inset-y-0 border-l-2 border-dashed"
                  style={{ left: `${(GPU_GB / barMax) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="KV cache per token" value={`${Math.round(kvBytesPerToken / 1024)} KiB`} />
            <Stat
              label="KV cache for the context"
              value={kvGiB < 1 ? `${Math.round(kvGiB * 1024)} MiB` : `${kvGiB.toFixed(1)} GiB`}
              bad={!fits}
            />
            <Stat label="Token pairs attention compares" value={human(pairs)} bad={n > 200000} />
            <Stat label="Fits on one 80 GB GPU?" value={fits ? "yes" : "no"} bad={!fits} />
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              fits ? "border-line bg-surface" : "border-bad/40 bg-bad/10",
            )}
          >
            {!fits
              ? "The cache alone outgrows the GPU: long contexts need several GPUs, compressed caches, or smarter attention."
              : n > 100000
                ? "It fits, but every new token must look back over all of these, and doubling the context quadruples the pairs attention compares."
                : "Comfortable. Short contexts are cheap and fast."}
          </p>
        </div>
      }
    >
      <p>
        The <Term id="context-window">context window</Term> is everything the model can see at once:
        instructions, documents, the conversation so far and its own reply. Drag it from a couple of
        pages to a library shelf.
      </p>
      <p>
        To avoid recomputing, models store every token&apos;s keys and values as they go: the{" "}
        <Term id="kv-cache">KV cache</Term>. It grows with every token.
      </p>
      <p className="text-muted text-sm">
        Numbers for Llama 3.1 8B at 16-bit precision (32 layers, 8 shared key/value heads of 128).
        Sharing keys across heads (grouped-query attention) cut the cache 4×; DeepSeek&apos;s
        multi-head latent attention reported a further 93% cut against its own earlier model.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Predict ----------------------------------------------------------------------------------------- */

export function PredictCache() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="Size the cache"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="kv-size"
            prompt="Llama 3.1 8B stores 128 KiB of keys and values per token. How many GiB is the KV cache for its full 131,072-token context? (1 GiB = 1,048,576 KiB)"
            min={0}
            max={64}
            step={1}
            unit=" GiB"
            answer={16}
            tolerance={1}
            explanation="131,072 × 128 KiB = 16,777,216 KiB = 16 GiB, as big as the model's own weights, for a single conversation. With every head keeping its own keys (no GQA) it would be 64 GiB."
          />
        </div>
      }
    >
      <p>Per token: 2 (keys and values) × 32 layers × 8 heads × 128 numbers × 2 bytes = 128 KiB.</p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint ---------------------------------------------------------------------------------------- */

export function Quadratic() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Double the context"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="quadratic"
            prompt="You double a prompt from 50,000 to 100,000 tokens. Roughly how does the attention work to process it change?"
            options={[
              {
                id: "four",
                label:
                  "About four times as much: every token is compared with every earlier token, so pairs grow with the square of the length",
                correct: true,
                feedback:
                  "Right. Twice the tokens, each looking back twice as far. Other parts of the model grow only linearly, so total time grows between 2× and 4×.",
              },
              {
                id: "two",
                label: "Twice as much",
                feedback:
                  "True for the feed-forward layers, but attention compares pairs, which grow with the square.",
              },
              {
                id: "same",
                label: "About the same",
                feedback: "Every extra token adds work, both to process and to attend to.",
              },
              {
                id: "less",
                label: "Less, thanks to caching",
                feedback:
                  "Caching avoids repeating work between steps; it doesn't shrink the pairs.",
              },
            ]}
            explanation="Tricks like FlashAttention make attention faster and lighter on memory, but the number of pairs still grows with the square of the length."
          />
        </div>
      }
    >
      <p>This is why long contexts cost more per token, and why providers price them carefully.</p>
    </StepLayout>
  );
}

/* 5 ─ Today's windows --------------------------------------------------------------------------------- */

const WINDOWS: [string, string][] = [
  ["GPT-2 (2019)", "1,024 tokens"],
  ["Original ChatGPT (2022)", "about 4,000 tokens"],
  ["Llama 3.1 (2024)", "128,000 tokens"],
  ["Claude Haiku 4.5", "200,000 tokens"],
  ["Claude Opus 5.5, Sonnet 5", "1 million tokens"],
  ["Gemini 3.x", "about 1 million tokens"],
  ["GPT-6 family", "about 1 million tokens"],
  ["DeepSeek V4 (open weights)", "1 million tokens"],
];

export function Windows() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="How big are windows now?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <div className="border-line bg-surface divide-line divide-y rounded-xl border">
            {WINDOWS.map(([m, w], i) => (
              <motion.div
                key={m}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
              >
                <span className="font-medium">{m}</span>
                <span className="font-mono">{w}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>Windows grew a thousandfold in seven years.</p>
      <p className="text-muted text-sm">
        A big window isn&apos;t the same as using it well: models can miss facts buried in the
        middle of long inputs, and long prompts cost more and respond slower. Context engineering,
        later in this track, is about choosing what goes in. Sizes as of September 2026.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Order must be added", "Attention alone sees a bag of words; position information fixes that."],
  ["The window is working memory", "Everything the model knows about your request must fit in it."],
  ["The KV cache grows per token", "Memory scales with context length; GQA and MLA shrink it."],
  ["Attention is quadratic", "Double the context, up to four times the attention work."],
  ["Big ≠ well used", "Long windows cost more and can still miss things."],
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
      <p>
        At the top of the stack, the model produces a score for every token. Then it has to choose
        one.
      </p>
      <p>Next: sampling.</p>
    </StepLayout>
  );
}
