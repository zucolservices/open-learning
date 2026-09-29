"use client";

import { motion } from "motion/react";
import { Check, FileText, Image as ImageIcon, MessageSquareText, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { MultimodalState } from "./state";

type PageId = keyof typeof data.ocr;

const src = (id: string) => `/rag/multimodal/${id}.png`;
const pageLabel = (id: string) => data.pages.find((p) => p.id === id)?.label ?? id;

/** Captions were capped in length; mark the ones that were cut off. */
const ended = (t: string) => (/[.!?)\]|]$/.test(t.trim()) ? t : `${t}…`);

function PageImg({ id, className }: { id: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src(id)}
      alt={`${pageLabel(id)} of the made-up Kalpanagar grievance report`}
      className={cn("border-line block w-full rounded border bg-white", className)}
    />
  );
}

/* 1 ─ Reading a report aloud -------------------------------------------------------------------- */

export function ReadAloud() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Reading a report aloud"
      stage={
        <div className="grid flex-1 content-center gap-4 sm:grid-cols-[1fr_1.1fr]">
          <PageImg id="p1-chart" className="mx-auto max-w-[260px]" />
          <div className="flex flex-col justify-center gap-2 text-sm">
            {[
              "“Section 3: how quickly were complaints resolved. The target is 15 working days…”",
              "“…and then there's a bar chart. Twelve bars. W1, W2, W3…”",
              "“Which ward was lowest? Er… I'd have to look.”",
            ].map((t, i) => (
              <motion.p
                key={t}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 * i }}
                className="border-line bg-surface rounded-xl border px-3 py-2"
              >
                {t}
              </motion.p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Ask a colleague to read you a report over the phone. The words come through fine. Then they
        reach a chart, and all you get is &ldquo;there&apos;s a bar chart&rdquo;.
      </p>
      <p>
        Every RAG system so far has read documents like that: as text. But many answers live in
        charts, tables, forms and photos. <Term id="multimodal-rag">Multimodal RAG</Term> is about
        not losing them. Our document: four pages of a made-up Kalpanagar grievance report.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three ways to read a page ----------------------------------------------------------------- */

const READERS: [typeof FileText, string, string, string][] = [
  [
    FileText,
    "Extract the text",
    "Pull out the words (from the text layer, or by OCR on a scan) and index them like any other text.",
    "Cheap and fast. Anything drawn, not written, is lost.",
  ],
  [
    MessageSquareText,
    "Describe the images",
    "Ask a vision-language model to describe each page or figure in words, and index the description.",
    "Keeps some of the picture. The description can be wrong, and it only says what the model chose to say.",
  ],
  [
    ImageIcon,
    "Look at the page",
    "Index the page images themselves, retrieve the right page, and let a vision-language model answer from the picture.",
    "Nothing is lost in translation. Costs more to store and to answer.",
  ],
];

export function ThreeReaders() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways to read a page"
      stage={
        <div className="grid flex-1 content-center gap-3 md:grid-cols-3">
          {READERS.map(([Icon, t, d, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-sm">{d}</p>
              <p className="text-muted text-xs">{n}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A <Term id="vision-language-model">vision-language model</Term> is a language model that can
        also take images as input. It&apos;s what makes the second and third ways possible.
      </p>
      <p>
        Azure&apos;s documentation describes the same choice as &ldquo;image verbalization&rdquo;
        versus direct image embeddings. Next, you&apos;ll see what each way actually stores.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What the index holds ⭐ (real OCR, real captions) ------------------------------------------ */

const NOTES: Record<"ocr" | "caption", Record<string, string>> = {
  ocr: {
    "p1-chart":
      "The words survive; the chart doesn't. Ward labels come out garbled (“wi we Ws”), the axis gives a stray “1004”, and there is no trace of the bar heights.",
    "p2-pie": "Clean: every slice label is printed text, so OCR reads it.",
    "p3-table": "Nearly right, but “11” in the last row became a quotation mark.",
    "p4-text": "Clean. Plain text is what OCR is for.",
  },
  caption: {
    "p1-chart":
      "Describes the chart and the average line, but never lists the ward values, so no search on this text can find the lowest ward.",
    "p2-pie":
      "Lists the slices, but says Water is 54% (it's 34%), gets the page number wrong and misreads the title.",
    "p3-table": "Reproduces the table correctly.",
    "p4-text":
      "Misspells the town, turns Lake Road into “Lake Flood”, and invents a “2. Financial Statements” section that isn't there.",
  },
};

export function WhatIndexHolds() {
  const [s, set] = useSceneState<MultimodalState>();
  const page = s.page as PageId;
  const text = s.view === "ocr" ? data.ocr[page] : data.captions[page];
  return (
    <StepLayout
      eyebrow="Comparison · real output"
      title="What the index holds"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {data.pages.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={s.page === p.id}
                onClick={() => set({ page: p.id })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.page === p.id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Segmented
            size="sm"
            value={s.view}
            options={[
              ["ocr", "Extracted text (OCR)"],
              ["caption", "Description (vision model)"],
            ]}
            onChange={(v) => set({ view: v })}
          />
          <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
            <PageImg id={s.page} />
            <div className="flex flex-col gap-2">
              <Code className="max-h-80 text-[10px] whitespace-pre-wrap">{ended(text)}</Code>
              <p className="border-line bg-surface-2 rounded-lg border px-2.5 py-1.5 text-[11px]">
                {NOTES[s.view][s.page]}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        On the left, the page. On the right, what a text index would actually hold for it: either
        Tesseract&apos;s <Term id="ocr">OCR</Term> output, or a description written by a small
        vision-language model (Qwen2-VL, 2 billion parameters), asked to &ldquo;describe this page
        for a search index, including any figure or table and the values it shows&rdquo;.
      </p>
      <p>
        Both are real and unedited. OCR is faithful but blind to drawings. The description sees the
        drawings but chooses what to mention, and gets things wrong. We shrank the pages to 448×560
        pixels for the model, which explains some of the misreadings.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Ask the report ⭐ (real answers from three pipelines) -------------------------------------- */

const PIPES: { key: "ocr" | "caption" | "image" | "small"; label: string; how: string }[] = [
  { key: "ocr", label: "Extracted text", how: "OCR text · e5 search · Phi-4-mini answers" },
  {
    key: "caption",
    label: "Description",
    how: "Qwen2-VL description · e5 search · Phi-4-mini answers",
  },
  { key: "image", label: "Page image", how: "Qwen2-VL (2B) answers from the page itself" },
  {
    key: "small",
    label: "Page image, smaller model",
    how: "SmolVLM (500M) answers from the page itself",
  },
];

const TONE: Record<string, string> = {
  right: "border-good/50 bg-good/10",
  wrong: "border-bad bg-bad/10",
  none: "border-line bg-surface-2",
};

export function TryReport() {
  const [s, set] = useSceneState<MultimodalState>();
  const r = data.runs[s.q];
  return (
    <StepLayout
      eyebrow="Comparison · real output"
      title="Ask the report"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {["Lowest ward", "Garbage share", "Citywide average"].map((t, i) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.q === i}
                onClick={() => set({ q: i })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.q === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
            {r.q}
            <span className="text-muted mt-0.5 block text-[11px] font-normal">
              True answer: {r.truth}
            </span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PIPES.map((p) => {
              const x = r[p.key];
              return (
                <motion.div
                  key={`${s.q}-${p.key}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("rounded-lg border px-3 py-2 text-xs", TONE[x.verdict])}
                >
                  <p className="flex items-center gap-1 font-semibold">
                    {x.verdict === "right" ? (
                      <Check className="text-good size-3.5" />
                    ) : (
                      <X className="text-bad size-3.5" />
                    )}
                    {p.label}
                  </p>
                  <p className="text-muted text-[10px]">{p.how}</p>
                  <p className="text-muted text-[10px]">Page used: {pageLabel(x.page)}</p>
                  <p className="mt-1 font-medium">&ldquo;{x.answer}&rdquo;</p>
                  {x.why && <p className="text-muted mt-0.5 text-[11px]">{x.why}</p>}
                </motion.div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        Three questions, four ways to answer each. Everything is real, unedited output. The page
        images were given to the vision models directly; the text pipelines searched their index and
        answered from the best page.
      </p>
      <p>
        When the answer is written on the page (a slice label, a sentence), every way works. When it
        exists only as the height of a bar, only looking at the image finds it, and only with a
        capable enough model: the 500-million-parameter model picked the first bar.
      </p>
      <p>
        The text pipeline&apos;s wrong answer is the dangerous kind. It had the ward names and no
        numbers, and made up an answer anyway.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Searching page images (ColPali) ----------------------------------------------------------- */

const HOT = new Set([
  "20-16",
  "21-16",
  "22-16",
  "23-16",
  "24-16",
  "25-16",
  "26-16",
  "27-16",
  "20-17",
  "21-17",
  "22-17",
]);

export function ColPali() {
  const N = 24;
  return (
    <StepLayout
      eyebrow="Explore · illustration"
      title="Searching page images"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="relative mx-auto w-full max-w-[300px]">
            <PageImg id="p1-chart" />
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${N}, 1fr)`,
                gridTemplateRows: `repeat(${N * 1.25}, 1fr)`,
              }}
              aria-hidden
            >
              {Array.from({ length: N * N * 1.25 }, (_, i) => {
                const row = Math.floor(i / N);
                const col = i % N;
                return (
                  <div
                    key={i}
                    className={cn(
                      "border-accent/15 border-[0.5px]",
                      HOT.has(`${row}-${col}`) && "bg-accent/45",
                    )}
                  />
                );
              })}
            </div>
          </div>
          <p className="text-muted text-center text-[11px]">
            Illustration: the page cut into patches, each with its own vector. The query word
            &ldquo;lowest&rdquo; would match patches like the short W9 bar.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "81.3 vs 65–67",
                "ColPali vs the best text pipelines on the ViDoRe benchmark (2024, nDCG@5)",
              ],
              [
                "0.39 s vs 7.22 s",
                "To index one page: ColPali vs layout + OCR + captioning (one GPU)",
              ],
              ["~1,030 vectors", "Per page (257.5 KB), vs one small vector for a text chunk"],
            ].map(([n, d]) => (
              <div key={n} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <p className="font-mono text-sm font-semibold">{n}</p>
                <p className="text-muted text-[10px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        <Term id="colpali">ColPali</Term> (2024) skips text altogether. It cuts each page image into
        about a thousand patches, gives each its own vector, and scores a page by how well every
        word of the question matches its best patch. It borrows the “late interaction” idea from the
        ColBERT text retriever and applies it to pictures.
      </p>
      <p>
        On its benchmark it beat text pipelines clearly, and indexed pages far faster. The cost is
        storage: a thousand vectors per page. Tricks such as pooling neighbouring patches and
        storing vectors as single bits cut that a lot.
      </p>
      <p>
        The newest evidence is mixed. On the 2026 ViDoRe V3 benchmark, image retrievers beat text
        retrievers on their own, but text retrieval plus a reranker won overall. For most
        collections, good text extraction is still the base; page images help where the answers are
        visual.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Where to start ---------------------------------------------------------------------------- */

export function WhereToStart() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where to start"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="multimodal-start"
            prompt="The corporation wants its 20,000 scanned annual reports searchable. Most answers are in text and tables; some are only in charts. What do you do first?"
            options={[
              {
                id: "layered",
                label:
                  "Good text and table extraction for every page, then send chart-heavy pages to a vision model at answer time",
                correct: true,
                feedback:
                  "Yes. Text extraction handles most questions cheaply; a capable vision model reads charts when the retrieved page has one. Measure, then consider page-image retrieval.",
              },
              {
                id: "captions",
                label: "Write a model description for every page and index only those",
                feedback:
                  "Descriptions miss what the model didn't mention and add errors (54% for 34%). Keep the extracted text too.",
              },
              {
                id: "ocr",
                label: "OCR everything; charts are rare enough to ignore",
                feedback:
                  "Then chart questions get invented answers, like “W4”. At least flag pages with charts.",
              },
              {
                id: "small",
                label: "Run the smallest vision model on every page to save money",
                feedback:
                  "The 500M model picked the wrong bar. Chart reading needs a capable model.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Every option costs something. Which is the sensible first step?</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Text extraction loses drawings", "Bar heights, arrows and photos don't survive OCR."],
  ["Descriptions choose and err", "They say what the model picked, sometimes wrongly."],
  ["Looking works, with a good model", "A 2B model read the chart; a 500M one didn't."],
  ["Layer, don't replace", "Text first; images where the answers are visual."],
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
        Managed services offer these paths too: Azure AI Search (image verbalization or multimodal
        embeddings), Amazon Bedrock&apos;s parsing options and Data Automation, and Google&apos;s
        layout parser with image annotation; multimodal embedding models include Cohere Embed v4,
        Voyage multimodal and Gemini Embedding 2.
      </p>
      <p>
        That completes the chapter on going beyond basic RAG. Next: how to measure whether any of
        this is working.
      </p>
    </StepLayout>
  );
}
