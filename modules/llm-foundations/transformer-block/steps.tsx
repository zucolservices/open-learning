"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import lens from "./lens.json";
import type { BlockState } from "./state";

const BlockScene = dynamic(() => import("./block-scene").then((m) => m.BlockScene), { ssr: false });

/* 1 ─ One token's journey ⭐ ------------------------------------------------------------------------ */

const FRAMES: { title: string; text: string }[] = [
  {
    title: "Text in",
    text: "“The Eiffel Tower is in” arrives as tokens: ID numbers, nothing more.",
  },
  {
    title: "Embed",
    text: "Each token ID is swapped for its embedding (a long list of numbers), plus information about its position in the text.",
  },
  {
    title: "Attention: tokens share information",
    text: "In the attention layer each token gathers information from earlier ones. The last token (“in”) looks back at “Eiffel” and “Tower”.",
  },
  {
    title: "Add, don't replace",
    text: "What attention found is added to each token's vector rather than replacing it (a residual connection). The original stays, enriched, which makes deep stacks trainable.",
  },
  {
    title: "Feed-forward: each token thinks alone",
    text: "Next, a feed-forward network (MLP) processes each token on its own. This is where much of the model's stored knowledge is thought to live. Its result is added back too.",
  },
  {
    title: "Repeat, many times",
    text: "Attention, then feed-forward, is one block. Models stack the same design again and again (each with its own weights): 12 times in GPT-2 small, 80 in Llama 3.1 70B.",
  },
  {
    title: "Scores for every token",
    text: "The last token's final vector is compared with every token in the vocabulary, giving a score for each. Softmax turns them into probabilities: “Paris”, then the sampling step picks one.",
  },
];

export function Journey() {
  const [s, set] = useSceneState<BlockState>();
  const step = Math.min(s.frame, FRAMES.length - 1);
  const f = FRAMES[step];
  return (
    <StepLayout
      eyebrow="3D step-through"
      title="One token's journey"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface relative h-72 overflow-hidden rounded-xl border sm:h-80">
            <BlockScene frame={step} />
          </div>
          <Stepper step={step} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={step} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A factory assembly line repeats the same kinds of stations, and the product improves at
        each. A <Term id="transformer">transformer</Term> works the same way: the same{" "}
        <Term id="transformer-block">block</Term> of two stations, repeated dozens of times.
      </p>
      <p>Follow “The Eiffel Tower is in” from token IDs to a prediction.</p>
      <p className="text-muted text-sm">
        Modern models add details (normalisation before each station, gated feed-forward layers),
        but the shape is the same as in 2017.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Watch a prediction form ⭐ -------------------------------------------------------------------- */

type LensPrompt = { prompt: string; layers: { t: string; p: number }[][] };
const PROMPTS = lens.prompts as LensPrompt[];
const show = (t: string) => t.replace(/^ /, "·");

export function Lens() {
  const [s, set] = useSceneState<BlockState>();
  const p = PROMPTS[s.prompt];
  const layer = Math.min(s.layer, p.layers.length - 1);
  return (
    <StepLayout
      eyebrow="Real model"
      title="Watch a prediction form"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PROMPTS.map((x, i) => (
              <button
                key={x.prompt}
                type="button"
                onClick={() => set({ prompt: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.prompt === i
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                …{x.prompt.split(" ").slice(-5).join(" ")}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface overflow-x-auto rounded-xl border p-3">
            <table className="w-full min-w-[22rem] text-xs">
              <tbody>
                {p.layers.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => set({ layer: i })}
                    className={cn("cursor-pointer", i === layer && "bg-accent-soft")}
                  >
                    <td className="text-muted w-20 py-0.5 pr-2 font-mono text-[10px]">
                      {i === 0 ? "embedding" : `layer ${i}`}
                    </td>
                    {row.map((c, j) => (
                      <td key={j} className="py-0.5 pr-2">
                        <span className="inline-flex w-full items-center gap-1.5">
                          <span
                            className={cn("w-20 truncate font-mono", j === 0 && "font-semibold")}
                          >
                            {show(c.t)}
                          </span>
                          <span className="bg-surface-2 relative h-2 flex-1 overflow-hidden rounded">
                            <motion.span
                              className={cn(
                                "absolute inset-y-0 left-0 rounded",
                                j === 0 ? "bg-accent" : "bg-viz-data/60",
                              )}
                              initial={false}
                              animate={{ width: `${c.p * 100}%` }}
                            />
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.prompt}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {s.prompt === 0
                ? "Early layers only know grammar: 'of the…'. Around layer 6 drinks appear, and by layer 7 'tea' leads."
                : s.prompt === 1
                  ? "The model wanders through places (England, Rome, San…) and only settles on Paris in the last layers. Facts take depth."
                  : "At layer 8, just after the induction head you met in layer 7, the model suddenly 'gets' the repeat: 'sam…' (samosa)."}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        What does the model &ldquo;think&rdquo; halfway up the stack? A trick called the{" "}
        <Term id="logit-lens">logit lens</Term> turns the in-progress vector into a prediction after
        every layer.
      </p>
      <p>
        These are real results from GPT-2 small (12 layers). Pick a sentence and watch the answer
        form.
      </p>
      <p className="text-muted text-sm">
        The logit lens is an approximation (middle layers weren&apos;t trained to be read this way),
        but the trend is real: simple guesses first, specific knowledge later.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where the parameters live --------------------------------------------------------------------- */

// From the models' published configurations (see SOURCES.md).
const PARAMS: Record<
  BlockState["model"],
  { label: string; parts: [string, number][]; total: string; shape: string }
> = {
  gpt2: {
    label: "GPT-2 small",
    shape: "12 layers · 768 wide · 12 heads",
    total: "124 million",
    parts: [
      ["Embeddings (token + position)", 39.4],
      ["Attention", 28.3],
      ["Feed-forward", 56.6],
    ],
  },
  llama8b: {
    label: "Llama 3.1 8B",
    shape: "32 layers · 4,096 wide · 32 heads (8 KV)",
    total: "8.0 billion",
    parts: [
      ["Embeddings + output layer", 1051],
      ["Attention", 1342],
      ["Feed-forward", 5637],
    ],
  },
  llama70b: {
    label: "Llama 3.1 70B",
    shape: "80 layers · 8,192 wide · 64 heads (8 KV)",
    total: "70.6 billion",
    parts: [
      ["Embeddings + output layer", 2101],
      ["Attention", 12080],
      ["Feed-forward", 56371],
    ],
  },
};
const PART_COLOUR = ["bg-viz-meta", "bg-accent", "bg-viz-compute"];

export function Parameters() {
  const [s, set] = useSceneState<BlockState>();
  const m = PARAMS[s.model];
  const total = m.parts.reduce((a, [, v]) => a + v, 0);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where the parameters live"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.model}
            options={(Object.keys(PARAMS) as BlockState["model"][]).map(
              (k) => [k, PARAMS[k].label] as [string, string],
            )}
            onChange={(v) => set({ model: v as BlockState["model"] })}
          />
          <p className="text-muted font-mono text-xs">{m.shape}</p>
          <div className="flex h-10 overflow-hidden rounded-xl">
            {m.parts.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={false}
                animate={{ width: `${(v / total) * 100}%` }}
                className={cn(
                  "text-bg grid place-items-center text-[10px] font-medium",
                  PART_COLOUR[i],
                )}
              >
                {Math.round((v / total) * 100)}%
              </motion.div>
            ))}
          </div>
          <div className="grid gap-1.5">
            {m.parts.map(([k, v], i) => (
              <div key={k} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-sm", PART_COLOUR[i])} /> {k}
                </span>
                <span className="font-mono">
                  {v >= 1000 ? `${(v / 1000).toFixed(1)} billion` : `${v} million`}
                </span>
              </div>
            ))}
          </div>
          <p className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
            Total: <span className="font-semibold">{m.total}</span>.{" "}
            {s.model === "gpt2"
              ? "In a small model, the vocabulary table is a big share. As models grow wider and deeper, the feed-forward layers take over."
              : "About 70–80% of the parameters are in the feed-forward layers. Attention is where tokens meet; the feed-forward layers are the bulk of the model."}
          </p>
        </div>
      }
    >
      <p>
        A model&apos;s size is its number of <Term id="parameter">parameters</Term>: the learned
        numbers in all those layers. Where do they sit?
      </p>
      <p className="text-muted text-sm">
        Counted from each model&apos;s published shape (layers, width, heads). Llama models share
        fewer key/value heads between query heads (grouped-query attention), which shrinks
        attention.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint --------------------------------------------------------------------------------------- */

export function TwoStations() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Two stations, two jobs"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="two-stations"
            prompt="What's the key difference between the attention layer and the feed-forward layer in a block?"
            options={[
              {
                id: "mix",
                label:
                  "Attention moves information between tokens; feed-forward transforms each token's vector on its own",
                correct: true,
                feedback:
                  "Right. Attention is the only place tokens exchange information. Feed-forward layers work token by token, and hold most of the parameters.",
              },
              {
                id: "order",
                label: "Attention runs first in the model, feed-forward only at the end",
                feedback: "Both run in every block, alternating, all the way up the stack.",
              },
              {
                id: "train",
                label: "Only attention is learned; feed-forward is fixed",
                feedback:
                  "Both are learned in training. Feed-forward layers actually hold most of the learned numbers.",
              },
              {
                id: "same",
                label: "They do the same thing in different ways",
                feedback:
                  "They're complementary: one mixes across tokens, the other processes within each token.",
              },
            ]}
            explanation="Mix across tokens, then process each token, then add both back into the running vector (the residual stream): that loop, repeated, is the transformer."
          />
        </div>
      }
    >
      <p>Everything you need to know about a block fits in one sentence.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["One block, repeated", "Attention then feed-forward, stacked 12 to 100+ times."],
  ["Attention mixes", "The only step where tokens share information."],
  ["Feed-forward thinks", "Per-token processing, and most of the parameters."],
  ["Residual stream", "Each station adds to a running vector rather than replacing it."],
  ["Knowledge forms with depth", "Early layers: grammar. Later layers: facts and patterns."],
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
        Every token attends to every earlier token. What happens when there are a million of them?
      </p>
      <p>Next: positions and the context window.</p>
    </StepLayout>
  );
}
