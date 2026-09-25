"use client";

import { AnimatePresence, motion } from "motion/react";
import { Handshake, ScrollText, Target } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import out from "./outputs.json";
import type { AssistState } from "./state";

const NOTES: { base: string; instruct: string }[] = [
  {
    base: "It treats the question as the start of a web page and writes another question before rambling on.",
    instruct:
      "A direct answer in assistant style. But “chosen in 1964” is false: New Delhi became the capital in the early 1930s.",
  },
  {
    base: "It carries on as if it were the person asking, then offers odd tips (mangoes in chai?).",
    instruct:
      "Polite, structured, on-format. Some advice is dubious (lemon juice?): the format improved more than the knowledge.",
  },
  {
    base: "Nothing: the most likely continuation was the end of the text.",
    instruct:
      "It follows the instruction and explains itself, but the Hindi is garbled. A 0.5B model knows little Hindi, and fine-tuning can't add that.",
  },
];

/* 1 ─ Same prompt, two models ⭐ ------------------------------------------------------------------- */

export function TwoModels() {
  const [s, set] = useSceneState<AssistState>();
  const i = s.prompt;
  return (
    <StepLayout
      eyebrow="Real models"
      title="Same prompt, two models"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {out.prompts.map((p, k) => (
              <button
                key={p}
                type="button"
                onClick={() => set({ prompt: k })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  i === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["base", "instruct"] as const).map((k) => (
              <AnimatePresence key={k} mode="wait">
                <motion.div
                  key={`${k}${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "flex flex-col rounded-xl border p-3",
                    k === "instruct" ? "border-accent/40 bg-accent-soft" : "border-line bg-surface",
                  )}
                >
                  <p className="text-xs font-semibold">
                    {k === "base" ? "Base model" : "Instruction-tuned"}
                  </p>
                  <p className="text-muted font-mono text-[10px]">
                    Qwen2.5-0.5B{k === "instruct" ? "-Instruct" : ""}
                  </p>
                  <p className="mt-2 flex-1 text-xs whitespace-pre-wrap">
                    {out[k][i] || <span className="text-subtle italic">(no output)</span>}
                  </p>
                  <p
                    className={cn(
                      "mt-2 rounded-lg border px-2 py-1.5 text-[11px]",
                      k === "base"
                        ? "border-bad/40 bg-bad/10"
                        : "border-viz-compute/40 bg-viz-compute/10",
                    )}
                  >
                    {NOTES[i][k]}
                  </p>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Real outputs, generated once with greedy decoding and a repetition penalty, cut at 70
            tokens.
          </p>
        </div>
      }
    >
      <p>
        A <Term id="base-model">base model</Term> is a brilliant mimic of the internet: give it the
        start of a document and it continues it. It isn&apos;t trying to help you.
      </p>
      <p>
        Here are two models of exactly the same size, before and after{" "}
        <Term id="instruction-tuning">instruction tuning</Term>. Compare their answers.
      </p>
      <p className="text-muted text-sm">
        Notice what changed and what didn&apos;t: the tuned model behaves like an assistant, but it
        still makes things up. It&apos;s tiny (half a billion parameters); bigger models know much
        more.
      </p>
    </StepLayout>
  );
}

/* 2 ─ How fine-tuning works ⭐ ------------------------------------------------------------------------- */

const SFT: { title: string; text: string; code?: string }[] = [
  {
    title: "Start with the base model",
    text: "Pretraining gave it knowledge and fluency. It continues documents; it doesn't hold conversations.",
  },
  {
    title: "Collect examples of good answers",
    text: "People (and increasingly other models) write thousands of example conversations: a request and the ideal reply. This is supervised fine-tuning data.",
    code: "User: Give me three tips for masala chai.\nIdeal reply: 1. Crush fresh ginger and cardamom…",
  },
  {
    title: "Wrap them in a chat template",
    text: "Each example is written in the model's chat format, with markers for system, user and assistant. This is Qwen's real template:",
    code: out.template + "The capital of India is New Delhi.<|im_end|>",
  },
  {
    title: "Train on the answers",
    text: "Training is the same next-token prediction as before, but now the loss only counts the assistant's tokens. The model learns: after <|im_start|>assistant comes a helpful reply.",
  },
  {
    title: "An assistant, with the same knowledge",
    text: "A small amount of fine-tuning changes behaviour a lot. In OpenAI's InstructGPT study (2022), people preferred answers from a 1.3B tuned model over the 175B base GPT-3, despite 100× fewer parameters.",
  },
];

export function HowSft() {
  const [s, set] = useSceneState<AssistState>();
  const step = Math.min(s.sftFrame, SFT.length - 1);
  const f = SFT[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="From mimic to assistant"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-28"
            >
              {f.code ? (
                <Code>{f.code}</Code>
              ) : (
                <div className="border-line bg-surface grid h-28 place-items-center rounded-xl border text-4xl">
                  {step === 0 ? (
                    <ScrollText className="text-muted size-10" />
                  ) : step === 3 ? (
                    <Target className="text-accent size-10" />
                  ) : (
                    <Handshake className="text-accent size-10" />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <Stepper step={step} count={SFT.length} onChange={(n) => set({ sftFrame: n })} />
          <FrameCaption frameKey={step} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Like an apprentice who has read every book in the library but never served a customer: show
        them a few thousand good customer conversations and they learn the job.
      </p>
      <p>
        That&apos;s <Term id="sft">supervised fine-tuning</Term>. Step through it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint --------------------------------------------------------------------------------------- */

export function BehaviourNotKnowledge() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What did tuning change?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="behaviour"
            prompt="The instruction-tuned model answered politely and on-topic, but said New Delhi became India's capital in 1964 (it was the early 1930s). What does this show?"
            options={[
              {
                id: "behaviour",
                label:
                  "Fine-tuning mostly teaches behaviour and format; knowledge comes from pretraining, and a small model has little",
                correct: true,
                feedback:
                  "Right. Instruction tuning makes a model helpful in manner, not wiser. Facts need a bigger or better-trained model, or reliable sources in its context.",
              },
              {
                id: "bad-data",
                label: "The fine-tuning examples contained the wrong date",
                feedback:
                  "Possible in principle, but much more likely it's the tiny model filling a gap in its knowledge with a plausible-sounding date.",
              },
              {
                id: "sampling",
                label: "Sampling picked an unlucky token",
                feedback:
                  "These answers used greedy decoding: the model's single most likely choice.",
              },
              {
                id: "worse",
                label: "Fine-tuning made the model less knowledgeable",
                feedback:
                  "The base model got the capital right but rambled; neither is reliable. Tuning changes style far more than knowledge.",
              },
            ]}
            explanation="A useful rule: prompt or retrieve for knowledge, fine-tune for behaviour and format, pretrain (or choose a bigger model) for broad ability."
          />
        </div>
      }
    >
      <p>Look back at the 1964 answer before choosing.</p>
    </StepLayout>
  );
}

/* 4 ─ Fine-tuning on a budget: LoRA ------------------------------------------------------------------ */

const RANKS = [1, 4, 8, 16, 64];
const D_IN = 4096;
const D_OUT = 4096;

export function Lora() {
  const [s, set] = useSceneState<AssistState>();
  const full = D_IN * D_OUT;
  const lora = s.rank * (D_IN + D_OUT);
  const pct = (lora / full) * 100;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fine-tuning on a budget"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">LoRA rank</span>
            <div className="flex gap-1">
              {RANKS.map((r, i) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set({ rank: r })}
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-mono text-xs",
                    s.rank === r
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {r}
                  {i === 2 && <span className="text-muted"> (common)</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="border-line bg-surface grid items-center gap-4 rounded-xl border p-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="text-center">
              <div className="bg-viz-meta/25 border-viz-meta/50 mx-auto grid size-32 place-items-center rounded-lg border text-[10px]">
                4,096 × 4,096
                <br />
                frozen
              </div>
              <p className="text-muted mt-1 text-[10px]">
                original weight matrix: {full.toLocaleString("en-IN")} numbers
              </p>
            </div>
            <span className="text-muted text-center text-lg">+</span>
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ width: Math.max(4, s.rank * 1.6) }}
                className="bg-accent/60 h-32 rounded"
              />
              <span className="text-muted text-xs">×</span>
              <motion.div
                animate={{ height: Math.max(4, s.rank * 1.6) }}
                className="bg-accent/60 w-32 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Full fine-tuning trains</p>
              <p className="font-mono text-sm">{full.toLocaleString("en-IN")}</p>
            </div>
            <div className="border-accent/40 bg-accent-soft rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">LoRA trains</p>
              <p className="font-mono text-sm">{lora.toLocaleString("en-IN")}</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Share of the matrix</p>
              <p className="font-mono text-sm">{pct.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Retraining every weight of a large model is expensive. <Term id="lora">LoRA</Term> freezes
        the original weights and learns a small correction: two thin matrices whose product is added
        on top.
      </p>
      <p>
        Change the rank (the thickness of the correction) and compare what gets trained, for one
        4,096 × 4,096 matrix.
      </p>
      <p className="text-muted text-sm">
        The LoRA paper (2021) trained about 10,000× fewer parameters than full fine-tuning of GPT-3
        175B, with far less GPU memory, and matched its quality on their tasks. Adapters are small
        files you can swap in and out.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: which tool? ---------------------------------------------------------------------- */

export function WhichTool() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Prompt, fine-tune or pretrain?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-tool"
            prompt="What's the right tool for each goal?"
            categories={[
              { id: "prompt", label: "Prompt or retrieve" },
              { id: "tune", label: "Fine-tune" },
              { id: "pretrain", label: "More pretraining" },
            ]}
            items={[
              {
                id: "catalogue",
                label: "Answer questions about this week's product catalogue",
                category: "prompt",
                why: "Changing facts belong in the context (retrieval), not baked into weights.",
              },
              {
                id: "json",
                label: "Always reply in the company's ticket format, millions of times a day",
                category: "tune",
                why: "Consistent behaviour and format are what fine-tuning is good at, and it saves long prompts.",
              },
              {
                id: "language",
                label: "Become fluent in a language it barely saw",
                category: "pretrain",
                why: "Broad new knowledge needs lots of text: continued pretraining, or a model that already knows it.",
              },
              {
                id: "style",
                label: "Follow a house writing style in every answer",
                category: "tune",
                why: "Style is behaviour; examples teach it well.",
              },
              {
                id: "news",
                label: "Know about today's train strike",
                category: "prompt",
                why: "Only the context can hold something that happened today.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Knowledge, behaviour and broad ability come from different stages.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Base models continue text", "They mimic documents; they don't try to help."],
  [
    "Fine-tuning teaches the job",
    "Example conversations in a chat template, same next-token training.",
  ],
  ["Behaviour, not knowledge", "Tuning changes manner and format far more than facts."],
  ["LoRA makes it cheap", "Train a thin correction instead of every weight."],
  ["Pick the right lever", "Prompt for facts, tune for behaviour, pretrain for broad ability."],
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
        Examples show a model what a good answer looks like. Preferences show it which of two
        answers is better.
      </p>
      <p>Next: alignment, and how human preferences shape assistants.</p>
    </StepLayout>
  );
}
