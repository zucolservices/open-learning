"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Brain, Database, FileText, Scissors, Search, Sparkles } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CORPUS } from "../_shared/corpus";
import data from "./data.json";
import type { EndToEndState } from "./state";

const DOC_COLOR: Record<string, [string, string]> = {
  "property-tax": ["bg-viz-data", "fill-viz-data"],
  "birth-death": ["bg-viz-meta", "fill-viz-meta"],
  water: ["bg-viz-compute", "fill-viz-compute"],
  waste: ["bg-viz-add", "fill-viz-add"],
  trade: ["bg-accent", "fill-accent"],
  grievance: ["bg-viz-idle", "fill-viz-idle"],
};

/* 1 ─ Two halves ---------------------------------------------------------------------------------- */

const INGEST = [
  [FileText, "Parse", "Get clean text out of each file"],
  [Scissors, "Chunk", "Split it into passages"],
  [Sparkles, "Embed", "Turn each passage into numbers"],
  [Database, "Index", "Store them so they're quick to search"],
] as const;
const QUERY = [
  [Search, "Retrieve", "Find the passages closest to the question"],
  [BookOpen, "Assemble", "Put question and passages in a prompt"],
  [Brain, "Generate", "The model answers, citing the passages"],
] as const;

function Lane({
  title,
  when,
  items,
  delay,
}: {
  title: string;
  when: string;
  items: typeof INGEST | typeof QUERY;
  delay: number;
}) {
  return (
    <div className="border-line bg-surface rounded-xl border p-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-muted text-[11px]">{when}</p>
      <div className="mt-2 flex flex-wrap items-stretch gap-1.5">
        {items.map(([Icon, t, d], i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.12 * i }}
            className="bg-surface-2 flex min-w-[8rem] flex-1 flex-col gap-0.5 rounded-lg px-2.5 py-2"
          >
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <Icon className="text-accent size-3.5" /> {t}
            </span>
            <span className="text-muted text-[10px] leading-snug">{d}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function TwoHalves() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Two halves"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Lane
            title="Ingestion"
            when="Once, ahead of time (and again when documents change)"
            items={INGEST}
            delay={0}
          />
          <Lane title="Query" when="Every time someone asks" items={QUERY} delay={0.5} />
        </div>
      }
    >
      <p>
        A good librarian does most of the work before anyone walks in: every new book is read,
        labelled and catalogued. When a reader asks a question, the librarian checks the catalogue,
        pulls the right pages, and the reader answers from them.
      </p>
      <p>
        A RAG system has the same two halves. <Term id="ingestion">Ingestion</Term> prepares your
        documents ahead of time. The query path runs for every question, and it has to be fast.
      </p>
      <p className="text-muted text-sm">
        Next, you&apos;ll run both halves for real on six help pages from Kalpanagar, a made-up
        city.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Before any question ⭐ (ingestion step-through) ------------------------------------------ */

const CHUNKS = data.chunks;
const W = 300;
const H = 190;

function extent(vals: number[]) {
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  return (v: number) => (v - lo) / (hi - lo || 1);
}
const allX = [...CHUNKS.map((c) => c.xy[0]), ...data.queries.map((q) => q.qxy[0])];
const allY = [...CHUNKS.map((c) => c.xy[1]), ...data.queries.map((q) => q.qxy[1])];
const nx = extent(allX);
const ny = extent(allY);
const px = (v: number) => 20 + nx(v) * (W - 40);
const py = (v: number) => 15 + (1 - ny(v)) * (H - 30);

function ChunkMap({ query, top }: { query?: number[]; top?: string[] }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-md"
      role="img"
      aria-label="Chunks placed by meaning"
    >
      <rect x={1} y={1} width={W - 2} height={H - 2} rx={10} className="fill-surface stroke-line" />
      {query &&
        top?.map((id) => {
          const c = CHUNKS.find((x) => x.id === id)!;
          return (
            <motion.line
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x1={px(query[0])}
              y1={py(query[1])}
              x2={px(c.xy[0])}
              y2={py(c.xy[1])}
              className="stroke-fg/40"
              strokeDasharray="3 2"
            />
          );
        })}
      {CHUNKS.map((c) => (
        <circle
          key={c.id}
          cx={px(c.xy[0])}
          cy={py(c.xy[1])}
          r={top?.includes(c.id) ? 7 : 5}
          className={cn(DOC_COLOR[c.doc][1], top && !top.includes(c.id) && "opacity-30")}
        />
      ))}
      {query && (
        <g>
          <motion.rect
            key={query.join()}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            x={px(query[0]) - 6}
            y={py(query[1]) - 6}
            width={12}
            height={12}
            transform={`rotate(45 ${px(query[0])} ${py(query[1])})`}
            className="fill-fg"
          />
        </g>
      )}
    </svg>
  );
}

function DocKey() {
  return (
    <div className="text-muted flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px]">
      {CORPUS.map((d) => (
        <span key={d.id} className="flex items-center gap-1">
          <span className={cn("size-2 rounded-full", DOC_COLOR[d.id][0])} />
          {d.title}
        </span>
      ))}
    </div>
  );
}

const FRAMES = ["Parse", "Chunk", "Embed", "Index"];

export function Ingestion() {
  const [s, set] = useSceneState<EndToEndState>();
  const f = Math.min(s.frame, FRAMES.length - 1);
  const sample = CHUNKS.find((c) => c.id === "waste-1")!;
  return (
    <StepLayout
      eyebrow="Step through · real data"
      title="Before any question"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Stepper
            step={f}
            count={FRAMES.length}
            onChange={(n) => set({ frame: n })}
            label={`Ingestion: ${FRAMES[f]}`}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={f}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              {f === 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {CORPUS.map((d) => (
                    <div key={d.id} className="border-line bg-surface rounded-lg border p-2">
                      <p className="flex items-center gap-1.5 text-xs font-semibold">
                        <span className={cn("size-2 rounded-full", DOC_COLOR[d.id][0])} />
                        {d.title}
                      </p>
                      <p className="text-muted mt-1 line-clamp-3 text-[10px]">
                        {d.paras.join(" ")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {f === 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {CHUNKS.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.03 * i }}
                      className="border-line bg-surface flex w-[calc(50%-0.2rem)] gap-1.5 rounded-md border p-1.5 sm:w-[calc(33.3%-0.3rem)]"
                    >
                      <span className={cn("w-1 shrink-0 rounded-full", DOC_COLOR[c.doc][0])} />
                      <span className="line-clamp-3 text-[10px]">{c.text}</span>
                    </motion.div>
                  ))}
                </div>
              )}
              {f === 2 && (
                <div className="flex flex-col gap-2">
                  <div className="border-line bg-surface rounded-lg border p-2 text-xs">
                    <span className="text-muted text-[10px]">Passage</span>
                    <p>{sample.text}</p>
                  </div>
                  <p className="text-muted text-center text-xs">↓ multilingual-e5-small ↓</p>
                  <Code>{`[${sample.v8.map((v) => v.toFixed(3)).join(", ")}, … 376 more]`}</Code>
                  <p className="text-muted text-[11px]">
                    Every one of the {CHUNKS.length} passages becomes a list of 384 numbers.
                    Passages with similar meanings get similar lists.
                  </p>
                </div>
              )}
              {f === 3 && (
                <div className="flex flex-col gap-2">
                  <ChunkMap />
                  <DocKey />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <FrameCaption frameKey={f} title={FRAMES[f]}>
            {
              [
                "Six help pages. These are clean text already; real PDFs and scans need careful parsing (module 3).",
                `Split into ${CHUNKS.length} passages, one per paragraph. How you split matters a lot (module 4).`,
                "An embedding model turns each passage into a vector. These are the real first eight numbers.",
                "Stored in an index. Here each dot is a passage, placed by its 384 numbers squeezed into two dimensions: pages on the same topic cluster together.",
              ][f]
            }
          </FrameCaption>
        </div>
      }
    >
      <p>
        Step through ingestion. Everything here is real: the passages were embedded with{" "}
        <Term id="embedding">embedding</Term> model multilingual-e5-small, the same kind of model
        you met in LLM Foundations.
      </p>
      <p>
        Each passage is one <Term id="chunk">chunk</Term>. The collection of chunk vectors is the
        system&apos;s searchable memory: the <Term id="vector-index">index</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Every question ⭐ ------------------------------------------------------------------------- */

const TOP_K = 3;

function CitedAnswer({ text }: { text: string }) {
  const parts = text.split(/(\[\d\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[\d\]$/.test(p) ? (
          <span
            key={i}
            className="bg-accent-soft text-accent mx-0.5 rounded px-1 font-mono text-[10px]"
          >
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function QueryPath() {
  const [s, set] = useSceneState<EndToEndState>();
  const q = data.queries[Math.min(s.q, data.queries.length - 1)];
  const top = q.scores.slice(0, TOP_K).map((x) => x.id);
  return (
    <StepLayout
      eyebrow="Real run"
      title="Every question"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            {data.queries.map((x, i) => (
              <button
                key={x.q}
                type="button"
                aria-pressed={s.q === i}
                onClick={() => set({ q: i, prompt: false })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.q === i
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {x.q}
              </button>
            ))}
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <ChunkMap query={q.qxy} top={top} />
              <p className="text-muted text-center text-[10px]">
                Dark marker: the question · linked dots: the {TOP_K} closest passages
              </p>
            </div>
            <ol className="flex flex-col gap-1">
              {q.scores.slice(0, 5).map((r, i) => {
                const c = CHUNKS.find((x) => x.id === r.id)!;
                return (
                  <li
                    key={r.id}
                    className={cn(
                      "border-line flex gap-2 rounded-md border px-2 py-1 text-[10px]",
                      i < TOP_K ? "bg-surface" : "opacity-50",
                    )}
                  >
                    <span className="text-muted w-3 shrink-0 font-mono">
                      {i < TOP_K ? `${i + 1}` : ""}
                    </span>
                    <span
                      className={cn("mt-1 size-2 shrink-0 rounded-full", DOC_COLOR[c.doc][0])}
                    />
                    <span className="line-clamp-2 flex-1">{c.text}</span>
                    <span className="shrink-0 font-mono">{r.score.toFixed(3)}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <button
            type="button"
            onClick={() => set({ prompt: !s.prompt })}
            className="text-muted self-start text-[11px] underline"
          >
            {s.prompt ? "Hide the prompt" : "Show the prompt sent to the model"}
          </button>
          {s.prompt && (
            <Code className="max-h-48 whitespace-pre-wrap">{`${q.system}\n\n${q.user}`}</Code>
          )}
          <motion.div
            key={q.q}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-good/50 bg-good/10 rounded-xl border px-3 py-2 text-sm"
          >
            <p className="text-muted text-[10px] tracking-wide uppercase">Answer with RAG</p>
            <p>
              <CitedAnswer text={q.answer} />
            </p>
          </motion.div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.closed}
              onChange={(e) => set({ closed: e.target.checked })}
            />
            Compare: the same model with no passages (closed book)
          </label>
          {s.closed && (
            <div className="border-bad/50 bg-bad/10 rounded-xl border px-3 py-2 text-xs">
              <p className="text-muted text-[10px] tracking-wide uppercase">Closed book</p>
              <p className="whitespace-pre-line">
                {q.closed.slice(0, 420)}
                {q.closed.length > 420 ? "…" : ""}
              </p>
            </div>
          )}
        </div>
      }
    >
      <p>
        Pick a question. It&apos;s embedded with the same model and compared with every passage.
        Every vector is scaled to length 1, so the score (a dot product) is the{" "}
        <Term id="cosine-similarity">cosine similarity</Term>. The three highest go into the prompt:{" "}
        <Term id="top-k-retrieval">top-k retrieval</Term> with k = 3 (frameworks default to a few: 2
        in LlamaIndex, 4 in LangChain).
      </p>
      <p>
        The answer comes from Qwen2.5-1.5B-Instruct, a small open model (1.5B parameters,
        Apache-2.0), run for real. Nothing here is edited.
      </p>
      <p>Look closely, and you&apos;ll spot three lessons for the rest of the track:</p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        <li>
          <strong>Scores bunch up.</strong> The passport question&apos;s best match (a water
          passage) scores almost as high as real answers do. A score alone doesn&apos;t say
          &ldquo;relevant&rdquo;.
        </li>
        <li>
          <strong>Citations can be wrong.</strong> In the dry-waste answer, the model cites [2] for
          a fact that&apos;s in passage [1]. Check them.
        </li>
        <li>
          <strong>Closed book invents.</strong> Tick the comparison: without passages, the same
          model confidently makes up a collection schedule.
        </li>
      </ul>
    </StepLayout>
  );
}

/* 4 ─ Put it in order ------------------------------------------------------------------------------ */

export function OrderStages() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put it in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="rag-stages"
            prompt="Drag the stages into the order they happen, from a new document to an answer."
            items={[
              { id: "parse", label: "Parse the document into clean text" },
              { id: "chunk", label: "Split the text into chunks" },
              { id: "embed", label: "Embed each chunk" },
              { id: "index", label: "Store the vectors in an index" },
              { id: "qembed", label: "A question arrives and is embedded" },
              { id: "retrieve", label: "Retrieve the closest chunks" },
              { id: "generate", label: "The model answers from them, with citations" },
            ]}
            explanation="The first four happen ahead of time, once per document version. The last three happen for every question."
          />
        </div>
      }
    >
      <p>One last look at the whole pipeline.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Two halves", "Ingestion ahead of time; retrieval and generation for every question."],
  [
    "Same embedding model",
    "Questions and passages must be embedded by the same model to be comparable.",
  ],
  ["Top-k passages", "Only the few closest passages go into the prompt."],
  ["Every stage can fail", "The rest of the track takes each stage apart."],
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
        That&apos;s a complete RAG system in miniature. Real ones add a reranking step, better
        chunking, keyword search alongside vectors, and evaluation. Each gets its own module.
      </p>
      <p>Next: getting clean text out of real documents in the first place.</p>
    </StepLayout>
  );
}
