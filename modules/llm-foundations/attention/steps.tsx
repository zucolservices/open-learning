"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./attention.json";
import type { AttnState } from "./state";

type HeadKey = AttnState["head"];
const SENTENCES = data.sentences as { toks: string[]; maps: Record<HeadKey, number[][]> }[];
const HEADS = data.heads as Record<HeadKey, [number, number]>;

const HEAD_INFO: Record<HeadKey, { label: string; text: string }> = {
  who: {
    label: "Who is it about?",
    text: "This head links a word to the earlier word it refers to: “she” looks hard at “barista”, barely at “customer”.",
  },
  previous: {
    label: "Previous word",
    text: "This head simply looks one token back. Simple, but other heads build on it.",
  },
  pattern: {
    label: "Repeat the pattern",
    text: "On the repeated order, this head looks at what came after the same words last time (an “induction head”): that's how models continue patterns they've just seen.",
  },
  rest: {
    label: "Resting spot",
    text: "Many heads park most of their attention on the first token when nothing else is relevant, like resting your eyes on a fixed point.",
  },
};

const show = (t: string) => t.replace(/^ /, "·");

/* 1 ─ Who is "she"? ⭐ ---------------------------------------------------------------------------- */

export function WhoIsShe() {
  const [s, set] = useSceneState<AttnState>();
  const sent = SENTENCES[s.sentence];
  const m = sent.maps[s.head];
  const n = sent.toks.length;
  const row = s.row !== null && s.row < n ? s.row : n - 1;
  const [L, H] = HEADS[s.head];
  const W = 360;
  const step = (W - 20) / n;
  const cx = (i: number) => 10 + step * (i + 0.5);
  return (
    <StepLayout
      eyebrow="Real attention"
      title="Who is “she”?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {SENTENCES.map((x, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  set({ sentence: i, row: i === 0 ? 7 : 14, head: i === 0 ? "who" : "pattern" })
                }
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.sentence === i
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.toks.join("").slice(0, 38)}…
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {(Object.keys(HEAD_INFO) as HeadKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ head: k })}
                className={cn(
                  "rounded-xl border px-2 py-1.5 text-left",
                  s.head === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                <span className="block text-xs font-medium">{HEAD_INFO[k].label}</span>
                <span className="text-muted block font-mono text-[9px]">
                  layer {HEADS[k][0]}, head {HEADS[k][1]}
                </span>
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 text-[10px]">
              Click a word: arcs show where it looks back, thicker means more attention.
            </p>
            <svg
              viewBox={`0 0 ${W} 110`}
              className="w-full"
              role="img"
              aria-label="Attention from the selected word to earlier words"
            >
              {m[row].map((w, j) =>
                j < row && w > 0.02 ? (
                  <motion.path
                    key={`${s.sentence}${s.head}${row}${j}`}
                    d={`M${cx(row)},78 Q${(cx(row) + cx(j)) / 2},${78 - Math.min(70, 12 + Math.abs(row - j) * 9)} ${cx(j)},78`}
                    fill="none"
                    stroke="var(--accent)"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.25 + w * 0.75 }}
                    strokeWidth={0.5 + w * 7}
                  />
                ) : null,
              )}
              {sent.toks.map((t, i) => (
                <g key={i} onClick={() => set({ row: i })} className="cursor-pointer">
                  <rect
                    x={cx(i) - step / 2 + 1}
                    y={82}
                    width={step - 2}
                    height={18}
                    rx={3}
                    fill={i === row ? "var(--accent-soft)" : "var(--surface)"}
                    stroke={i === row ? "var(--accent)" : "var(--line)"}
                  />
                  <text
                    x={cx(i)}
                    y={94}
                    textAnchor="middle"
                    className="fill-fg text-[6.5px]"
                    {...(show(t).length * 3.6 > step - 3
                      ? { textLength: step - 3, lengthAdjust: "spacingAndGlyphs" }
                      : {})}
                  >
                    {show(t)}
                  </text>
                  <text x={cx(i)} y={108} textAnchor="middle" className="fill-muted text-[5px]">
                    {i <= row ? `${Math.round(m[row][i] * 100)}%` : ""}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">
              Show the whole attention map (every word × every earlier word)
            </summary>
            <div className="mt-2 overflow-x-auto">
              <table className="border-separate border-spacing-px font-mono text-[8px]">
                <tbody>
                  {m.map((r, i) => (
                    <tr key={i}>
                      <td className="pr-1 text-right whitespace-pre">{show(sent.toks[i])}</td>
                      {r.map((w, j) => (
                        <td
                          key={j}
                          title={`${show(sent.toks[i])} → ${show(sent.toks[j])}: ${Math.round(w * 100)}%`}
                          className="size-4"
                          style={{
                            background:
                              j > i
                                ? "var(--surface-2)"
                                : `color-mix(in oklab, var(--accent) ${Math.round(w * 100)}%, transparent)`,
                          }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.head}${s.sentence}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {HEAD_INFO[s.head].text}
            </motion.p>
          </AnimatePresence>
          <p className="text-subtle text-[10px]">
            Real attention weights from GPT-2 small, layer {L}, head {H}. “·” marks a token that
            starts with a space.
          </p>
        </div>
      }
    >
      <p>
        In &ldquo;The customer thanked the barista because she made the chai perfectly&rdquo;, you
        know at once that &ldquo;she&rdquo; is the barista. You glanced back at the right word.
      </p>
      <p>
        <Term id="attention">Attention</Term> is how a transformer does that glance. For every
        token, it decides how much to look at each earlier token. Each{" "}
        <Term id="attention-head">attention head</Term> learns its own way of looking. These are
        four real heads from GPT-2.
      </p>
      <p className="text-muted text-sm">
        Nobody programmed these patterns. They emerged from training on next-token prediction,
        because they help predict.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Queries, keys and values ⭐ ------------------------------------------------------------------ */

// A toy example with 2-number vectors (real models use 64–128 per head); the arithmetic is exact.
const TOKS = ["customer", "barista", "she"];
const K = [
  [1, 0],
  [0.2, 1],
  [0.3, 0.3],
];
const V = [
  [1, 0],
  [0, 1],
  [0.5, 0.5],
];
const Q = [0.4, 2.2]; // the query for "she": "who is a female person doing a job?"
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1];
const scores = K.map((k) => dot(Q, k));
const scaled = scores.map((x) => x / Math.SQRT2);
const ex = scaled.map((x) => Math.exp(x));
const weights = ex.map((x) => x / ex.reduce((a, b) => a + b, 0));
const out = [0, 1].map((d) => weights.reduce((a, w, i) => a + w * V[i][d], 0));

const F = [
  {
    title: "Three vectors per token",
    text: "Each token gets three vectors, made by multiplying its embedding by learned weights: a query (what am I looking for?), a key (what do I offer?) and a value (what I'll pass on). Like a library: your question, the labels on the shelves, the books themselves.",
  },
  {
    title: "Compare the query with every key",
    text: "The dot product of “she”'s query with each key scores how well they match. “barista”'s key matches best.",
  },
  {
    title: "Scale",
    text: "Divide by √(vector size), here √2, so scores don't grow huge in big models.",
  },
  {
    title: "Softmax: scores become weights",
    text: "Softmax turns the scores into percentages that add up to 100%. This row is exactly what you saw in the heatmap.",
  },
  {
    title: "Mix the values",
    text: "Add up the value vectors, each times its weight. The new vector for “she” now carries mostly the barista's information: that's how context flows into a word.",
  },
];

const f2 = (x: number) => x.toFixed(2);

export function QueryKeyValue() {
  const [s, set] = useSceneState<AttnState>();
  const step = Math.min(s.qkvFrame, F.length - 1);
  const f = F[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Queries, keys and values"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface overflow-x-auto rounded-xl border p-3">
            <table className="w-full min-w-[20rem] text-left font-mono text-xs">
              <thead>
                <tr className="text-muted text-[10px]">
                  <th className="py-1 font-normal">token</th>
                  <th className="font-normal">key</th>
                  <th className="font-normal">value</th>
                  {step >= 1 && <th className="font-normal">q·k</th>}
                  {step >= 2 && <th className="font-normal">÷√2</th>}
                  {step >= 3 && <th className="font-normal">weight</th>}
                </tr>
              </thead>
              <tbody>
                {TOKS.map((t, i) => (
                  <tr key={t} className={cn(step >= 3 && i === 1 && "text-accent font-semibold")}>
                    <td className="py-1">{t}</td>
                    <td>[{K[i].join(", ")}]</td>
                    <td>[{V[i].join(", ")}]</td>
                    {step >= 1 && (
                      <motion.td initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {f2(scores[i])}
                      </motion.td>
                    )}
                    {step >= 2 && (
                      <motion.td initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {f2(scaled[i])}
                      </motion.td>
                    )}
                    {step >= 3 && (
                      <motion.td initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {Math.round(weights[i] * 100)}%
                      </motion.td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-muted mt-2 font-mono text-[11px]">
              query for “she” = [{Q.join(", ")}]
            </p>
            {step >= 4 && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-accent/40 bg-accent-soft mt-2 rounded-lg border px-2 py-1 font-mono text-[11px]"
              >
                new “she” ={" "}
                {TOKS.map((t, i) => `${Math.round(weights[i] * 100)}%·${t}`).join(" + ")} = [
                {out.map(f2).join(", ")}]
              </motion.p>
            )}
          </div>
          <Stepper step={step} count={F.length} onChange={(n) => set({ qkvFrame: n })} />
          <FrameCaption frameKey={step} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        How does a head decide where to look? With three small vectors per token:{" "}
        <Term id="qkv">a query, a key and a value</Term>. Step through the arithmetic for
        &ldquo;she&rdquo;.
      </p>
      <p className="text-muted text-sm">
        Toy numbers with 2 values per vector so you can follow them; real heads use 64 or 128, and
        the weights that make queries, keys and values are learned in training. The formula is the
        one from the 2017 paper: softmax(QKᵀ / √d) · V.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: the empty triangle -------------------------------------------------------------- */

export function NoPeeking() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="No peeking"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="causal-mask"
            prompt="In every attention map, a word never looks at words that come after it (the grey upper triangle). Why do models like GPT block that?"
            options={[
              {
                id: "mask",
                label:
                  "The model is trained to predict the next token, so letting it see the future during training would let it cheat",
                correct: true,
                feedback:
                  "Right. A causal mask hides later tokens, so every position learns to predict only from what came before, exactly as it must when generating.",
              },
              {
                id: "speed",
                label: "It's only a speed optimisation",
                feedback:
                  "Masking also enables caching, but the main reason is to keep training honest.",
              },
              {
                id: "grammar",
                label: "Later words never affect the meaning of earlier ones",
                feedback:
                  "They often do. Models that read in both directions (like BERT) exist, but they can't generate text left to right.",
              },
              {
                id: "memory",
                label: "There isn't enough memory to look ahead",
                feedback:
                  "Memory isn't the reason; the future simply mustn't be visible to a next-token predictor.",
              },
            ]}
            explanation="This is the causal mask. It's also why generated text can be cached token by token: earlier tokens never change their attention when later ones arrive."
          />
        </div>
      }
    >
      <p>
        Open &ldquo;Show the whole attention map&rdquo; in the first step if you missed the grey
        triangle.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Predict: how many heads? ------------------------------------------------------------------- */

export function HowManyHeads() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="How many ways of looking?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="heads"
            prompt="GPT-2 small has 12 layers, each with 12 attention heads. Llama 3.1 70B has 80 layers of 64 heads. How many heads does Llama 3.1 70B have in total?"
            min={0}
            max={8000}
            step={10}
            unit=" heads"
            answer={5120}
            tolerance={50}
            explanation="80 × 64 = 5,120 heads (GPT-2 small: 144). Each head attends in its own learned way; most don't have neat human-readable jobs like the four you saw."
          />
        </div>
      }
    >
      <p>
        Every layer runs several heads side by side (
        <Term id="multi-head">multi-head attention</Term>), and models stack many layers.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Attention is looking back", "Each token weighs how much every earlier token matters to it."],
  ["Query, key, value", "Match what I seek with what others offer, then mix in their information."],
  ["Many heads", "Each head learns its own pattern: previous word, references, repeats."],
  ["Causal mask", "No peeking at the future: it keeps next-token training honest."],
  ["Learned, not programmed", "Useful patterns emerge because they help predict."],
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
      <p>Attention is one half of a transformer block.</p>
      <p>Next: the whole block, and what happens when you stack dozens of them.</p>
    </StepLayout>
  );
}
