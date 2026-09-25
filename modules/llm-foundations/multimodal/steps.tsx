"use client";

import { AnimatePresence, motion } from "motion/react";
import { AudioLines, FileText, ImagePlus, Mic } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import { SVGS } from "./pictures";
import type { MmState } from "./state";

const src = (k: string) => `data:image/svg+xml;utf8,${encodeURIComponent(SVGS[k])}`;
const NAMES: Record<string, string> = { bus: "Bus", tea: "Tea", cat: "Cat", tree: "Tree" };

function PicturePicker({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  return (
    <div className="flex gap-2">
      {Object.keys(SVGS).map((k) => (
        <button
          key={k}
          type="button"
          aria-label={NAMES[k]}
          aria-pressed={k === value}
          onClick={() => onChange(k)}
          className={cn(
            "overflow-hidden rounded-lg border-2 transition-transform",
            k === value ? "border-accent scale-105" : "border-line opacity-70 hover:opacity-100",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src(k)} alt={NAMES[k]} className="size-14" />
        </button>
      ))}
    </div>
  );
}

/* 1 ─ Pictures become tokens ⭐ ------------------------------------------------------------------ */

const FRAMES = [
  {
    title: "A picture is a grid of numbers",
    text: "To a computer, this 224 × 224 picture is 150,528 numbers: red, green and blue for every pixel. A language model can't read that directly.",
  },
  {
    title: "Cut it into patches",
    text: "A vision transformer cuts the picture into squares, here 16 × 16 pixels: a 14 × 14 grid of 196 patches. Each patch will play the part a word plays in a sentence.",
  },
  {
    title: "Each patch becomes a vector",
    text: "A patch's 16 × 16 × 3 = 768 numbers are multiplied by learned weights into one embedding vector, just like a token's embedding. A position is added, so the model knows where each patch was.",
  },
  {
    title: "Patches pay attention to each other",
    text: "Transformer layers let every patch look at every other: the red block and the black circles become “bus”. The output is one vector per patch that describes what's there.",
  },
  {
    title: "Into the language model",
    text: "A small projector maps those vectors into the language model's token space, often merging neighbours to save tokens. The model then reads image tokens followed by your text, with the same attention it uses for words.",
  },
];

export function PicturesToTokens() {
  const [s, set] = useSceneState<MmState>();
  const f = Math.min(s.frame, FRAMES.length - 1);
  const grid = 14;
  const hot = 5 * grid + 3;
  return (
    <StepLayout
      eyebrow="Step through"
      title="Pictures become tokens"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface grid items-center gap-4 rounded-xl border p-3 sm:grid-cols-[auto_1fr]">
            <div className="relative mx-auto size-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src("bus")} alt="A red bus" className="size-56 rounded" />
              {f >= 1 && (
                <div
                  className="absolute inset-0 grid"
                  style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
                >
                  {Array.from({ length: grid * grid }, (_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (i % grid) * 0.01 + Math.floor(i / grid) * 0.01 }}
                      className={cn(
                        "border-surface/60 border-[0.5px]",
                        f >= 2 && i === hot && "border-accent border-2",
                        f >= 3 && i !== hot && "bg-accent/10",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="min-h-40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {f === 0 && (
                    <p className="font-mono text-[11px] leading-5 break-all">
                      [191, 227, 255], [191, 227, 255], [191, 227, 255], … [214, 40, 40], [214, 40,
                      40], …<span className="text-muted"> 50,176 pixels × 3</span>
                    </p>
                  )}
                  {f === 1 && (
                    <p className="text-sm">
                      <span className="font-mono text-2xl">196</span> patches
                      <span className="text-muted block text-xs">14 rows × 14 columns</span>
                    </p>
                  )}
                  {f === 2 && (
                    <div className="grid gap-2">
                      <p className="text-muted text-xs">Patch 74 (outlined)</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono">768 numbers</span>→
                        <span className="bg-accent-soft rounded px-2 py-1 font-mono">
                          [0.12, −0.8, 0.33, …]
                        </span>
                      </div>
                      <p className="text-muted text-xs">+ position (row 6, column 4)</p>
                    </div>
                  )}
                  {f === 3 && (
                    <p className="text-sm">
                      Every patch attends to all 196.
                      <span className="text-muted block text-xs">
                        The same attention as in the attention module, over patches instead of
                        words.
                      </span>
                    </p>
                  )}
                  {f === 4 && (
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: 12 }, (_, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="bg-accent size-4 rounded-sm"
                        />
                      ))}
                      <span className="text-muted self-center text-xs">… 64 image tokens</span>
                      {["Describe", " this", " picture", "."].map((t) => (
                        <span
                          key={t}
                          className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <Stepper step={f} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={f} title={FRAMES[f].title}>
            {FRAMES[f].text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A <Term id="multimodal">multimodal</Term> model takes more than text. The trick is to turn
        every kind of input into tokens the same transformer can read.
      </p>
      <p>
        Step through how a picture becomes tokens inside a{" "}
        <Term id="vision-transformer">vision transformer</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pictures and words in one space (CLIP) -------------------------------------------------------- */

export function OneSpace() {
  const [s, set] = useSceneState<MmState>();
  const c = data.clip;
  const i = c.images.indexOf(s.picture);
  const row = c.sim[i];
  const min = 0.1;
  const max = 0.33;
  return (
    <StepLayout
      eyebrow="Real model"
      title="Pictures and words in one space"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <PicturePicker value={s.picture} onChange={(k) => set({ picture: k })} />
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[11px]">
              Cosine similarity between the picture&apos;s embedding and each caption&apos;s
            </p>
            <div className="grid gap-1.5">
              {c.captions.map((cap, j) => (
                <div key={cap} className="flex items-center gap-2 text-xs">
                  <span className="w-40 shrink-0 truncate">{cap}</span>
                  <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
                    <motion.span
                      className={cn(
                        "absolute inset-y-0 left-0 rounded",
                        j === i ? "bg-accent" : "bg-viz-data/60",
                      )}
                      animate={{ width: `${((row[j] - min) / (max - min)) * 100}%` }}
                    />
                  </span>
                  <span className="w-12 text-right font-mono">{row[j].toFixed(3)}</span>
                </div>
              ))}
            </div>
            <p className="text-muted mt-2 text-[11px]">
              CLIP&apos;s pick:{" "}
              <span className="text-fg font-semibold">
                {c.captions[row.indexOf(Math.max(...row))]}
              </span>{" "}
              ({Math.round(c.probs[i][row.indexOf(Math.max(...row))] * 100)}% after its softmax)
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            Real embeddings from {c.model.replace("Xenova/", "")} (OpenAI CLIP), computed by us on
            these simple drawings. Scores are small in absolute terms; what matters is which is
            highest.
          </p>
        </div>
      }
    >
      <p>
        Remember <Term id="embedding">embeddings</Term>, where similar meanings sit close together?
        OpenAI&apos;s CLIP (2021) puts pictures and captions in the <em>same</em> space, by training
        on 400 million image–caption pairs to pull matching ones together.
      </p>
      <p>Pick a drawing and see which caption sits closest. The biryani caption is a decoy.</p>
      <p className="text-muted text-sm">
        This is how image search by text works, and many vision-language models start from a
        CLIP-style image encoder.
      </p>
    </StepLayout>
  );
}

/* 3 ─ A real model looks ------------------------------------------------------------------------------ */

export function RealModelLooks() {
  const [s, set] = useSceneState<MmState>();
  const v = data.vlm;
  return (
    <StepLayout
      eyebrow="Real model"
      title="A small model describes the picture"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <PicturePicker value={s.picture} onChange={(k) => set({ picture: k })} />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.picture}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border p-3 text-sm"
            >
              <p className="text-muted text-[11px]">
                &ldquo;Describe this picture in one sentence.&rdquo;
              </p>
              <p className="mt-1">{v.answers[s.picture as keyof typeof v.answers]}</p>
            </motion.div>
          </AnimatePresence>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[11px]">One 512 × 512 view</p>
              <p className="font-mono text-lg">{v.tokensSingle} image tokens</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[11px]">
                Split into {v.tiles - 1} tiles + overview, for detail
              </p>
              <p className="font-mono text-lg">
                {v.tokensSplit.toLocaleString("en-US")} image tokens
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Real outputs and token counts from {v.model.replace("HuggingFaceTB/", "")}, a
            256-million-parameter vision-language model, run by us with Transformers.js, greedy
            decoding.
          </p>
        </div>
      }
    >
      <p>
        We gave the drawings to SmolVLM, a tiny open vision-language model small enough to run in a
        browser. It describes each one correctly.
      </p>
      <p>
        Notice the price of detail: one view of the picture costs 64 tokens. Asking the model to
        look closer, by cutting the picture into tiles, costs 17 times more.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What an image costs ---------------------------------------------------------------------------- */

function anthropicTokens(w: number, h: number) {
  const count = (k: number) => Math.ceil((w * k) / 28) * Math.ceil((h * k) / 28);
  let k = Math.min(1, 1568 / Math.max(w, h));
  while (count(k) > 1568) k *= 0.99;
  return count(k);
}

export function ImageCost() {
  const [s, set] = useSceneState<MmState>();
  const rows: [string, number, string][] = [
    [
      "Anthropic Claude",
      anthropicTokens(s.width, s.height),
      "28 × 28 px patches; large images are scaled down first (standard models: 1,568 px, 1,568 tokens)",
    ],
    [
      "OpenAI (gpt-5.2 and later), before resizing",
      Math.ceil(Math.ceil(s.width / 32) * Math.ceil(s.height / 32) * 1.2),
      "32 × 32 px patches × 1.2; images over the model's patch budget are scaled down first",
    ],
    [
      "Google Gemini 3",
      1120,
      "Fixed by the media_resolution setting: 280, 560, 1,120 (default) or 2,240",
    ],
  ];
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <StepLayout
      eyebrow="Calculator"
      title="What does an image cost?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["Width", "width", s.width],
                ["Height", "height", s.height],
              ] as const
            ).map(([l, k, v]) => (
              <label key={k} className="grid gap-0.5 text-[11px]">
                <span className="text-muted flex justify-between">
                  {l} <span className="text-fg font-mono">{v} px</span>
                </span>
                <input
                  type="range"
                  min={128}
                  max={4000}
                  step={32}
                  value={v}
                  onChange={(e) => set({ [k]: Number(e.target.value) })}
                  aria-label={l}
                />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {[
              ["Phone photo", 4000, 3000],
              ["Screenshot", 1920, 1080],
              ["Scanned page", 1700, 2200],
              ["Thumbnail", 256, 256],
            ].map(([l, w, h]) => (
              <button
                key={l as string}
                type="button"
                onClick={() => set({ width: w as number, height: h as number })}
                className="border-line hover:bg-surface-2 rounded-full border px-2 py-0.5 text-[11px]"
              >
                {l as string}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface grid gap-2 rounded-xl border p-3">
            {rows.map(([n, t, note]) => (
              <div key={n} className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-44 shrink-0 font-semibold">{n}</span>
                  <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
                    <motion.span
                      className="bg-accent absolute inset-y-0 left-0 rounded"
                      animate={{ width: `${(t / max) * 100}%` }}
                    />
                  </span>
                  <span className="w-20 text-right font-mono">{t.toLocaleString("en-US")}</span>
                </div>
                <p className="text-muted mt-0.5 text-[10px]">{note}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            At $2 per million input tokens, 1,000 tokens is $0.002 per image: small once, large for
            a million scanned forms.
          </p>
          <p className="text-subtle text-[10px]">
            Formulas from each provider&apos;s vision documentation, Sep 2026. OpenAI&apos;s
            multiplier differs by model, and older models use 512-pixel tiles; Anthropic&apos;s
            newest models accept higher resolutions. Check the page for your exact model.
          </p>
        </div>
      }
    >
      <p>
        Images are billed as input tokens, and the count depends on size. Pick a size and compare
        how three providers count it.
      </p>
      <p className="text-muted text-sm">
        Practical tip: resize images to what the task needs. A receipt total doesn&apos;t need a
        12-megapixel photo.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Documents, speech and making images ------------------------------------------------------------ */

const PIPES = [
  {
    title: "Documents",
    Icon: FileText,
    text: "Scanned forms, PDFs and slides are sent as page images, often with any text that can be extracted. The model reads layout, tables and charts the way it reads a photo. Check numbers carefully: small print and dense tables are where mistakes happen.",
  },
  {
    title: "Speech in",
    Icon: Mic,
    text: "Either a separate speech-to-text model writes a transcript first, or the audio itself is cut into short slices that become tokens (Gemini 3 counts about 25 tokens per second of audio). Native audio keeps tone and hesitation that a transcript loses.",
  },
  {
    title: "Speech out",
    Icon: AudioLines,
    text: "Text-to-speech turns the answer into voice. Newer models generate audio tokens directly, which lets voice assistants reply quickly, keep the tone of voice, and be interrupted mid-sentence.",
  },
  {
    title: "Making images",
    Icon: ImagePlus,
    text: "Most image generators are diffusion models: start from random noise and remove it step by step, steered by the text. Some newer systems instead generate image tokens one after another, like text.",
  },
];

export function Pipelines() {
  const [s, set] = useSceneState<MmState>();
  const f = Math.min(s.pipe, PIPES.length - 1);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Documents, speech and making images"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-4 gap-2">
            {PIPES.map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={() => set({ pipe: i })}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs",
                  i === f
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <p.Icon className={cn("size-6", i === f ? "text-accent" : "text-muted")} />
                {p.title}
              </button>
            ))}
          </div>
          {f === 3 && <DiffusionStrip />}
          <Stepper step={f} count={PIPES.length} onChange={(n) => set({ pipe: n })} />
          <FrameCaption frameKey={f} title={PIPES[f].title}>
            {PIPES[f].text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Images are one case of a general pattern: turn the input into tokens, or make tokens into
        output.
      </p>
      <p>Step through the other common kinds.</p>
    </StepLayout>
  );
}

function DiffusionStrip() {
  const steps = [1, 0.75, 0.5, 0.25, 0];
  return (
    <div className="border-line bg-surface flex items-center justify-between gap-2 rounded-xl border p-3">
      {steps.map((noise, i) => (
        <div key={i} className="relative size-16 overflow-hidden rounded">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src("tree")}
            alt=""
            className="size-16"
            style={{ filter: `blur(${noise * 6}px) saturate(${1 - noise * 0.8})` }}
          />
          <span
            className="absolute inset-0"
            style={{
              opacity: noise,
              backgroundImage: "repeating-conic-gradient(var(--fg) 0 25%, var(--surface) 0 50%)",
              backgroundSize: "4px 4px",
            }}
          />
        </div>
      ))}
      <span className="text-muted text-[10px]">noise → picture</span>
    </div>
  );
}

/* 6 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function OrderPipeline() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the pipeline in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="image-pipeline"
            prompt="Drag the steps into the order an image goes through before the language model answers."
            items={[
              { id: "patches", label: "Cut the image into patches" },
              { id: "embed", label: "Turn each patch into a vector and add its position" },
              {
                id: "encoder",
                label: "Vision transformer layers let patches attend to each other",
              },
              { id: "project", label: "Project into the language model's token space" },
              { id: "llm", label: "The language model reads image tokens and text together" },
            ]}
            explanation="Every modality follows the same shape: slice the input, embed the slices, and hand the language model a sequence of tokens."
          />
        </div>
      }
    >
      <p>One last look at how a picture reaches the language model.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Everything becomes tokens",
    "Image patches, audio slices and text all end up as vectors in one sequence.",
  ],
  ["Shared spaces", "CLIP-style training puts pictures and words in one embedding space."],
  ["Detail costs tokens", "Bigger or tiled images mean more tokens, more money and more time."],
  ["Output too", "Speech and images can be generated, by diffusion or by predicting tokens."],
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
      <p>The model you just watched was tiny, and it still did the job.</p>
      <p>Next: small and on-device models, and when they beat giants.</p>
    </StepLayout>
  );
}
