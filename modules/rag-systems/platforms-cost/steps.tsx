"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ANSWER_MODELS, EMBEDDERS, INR_PER_USD, STORES } from "./prices";
import type { CostState } from "./state";

/* Assumptions for the calculator, stated on screen. */
const TOKENS_PER_PAGE = 500;
const CHUNK_TOKENS = 400;
const DIMS = 1024;
const PROMPT_OVERHEAD = 300;
const QUESTION_TOKENS = 25;
const ANSWER_TOKENS = 250;
const MONTHLY_CHANGE = 0.05;
const DAYS = 30;

const usd = (v: number) =>
  v >= 1000
    ? `$${Math.round(v).toLocaleString("en-IN")}`
    : `$${v < 10 ? v.toFixed(2) : Math.round(v)}`;
const inr = (v: number) => `₹${Math.round(v * INR_PER_USD).toLocaleString("en-IN")}`;
const tokensLabel = (t: number) =>
  t >= 1e6 ? `${(t / 1e6).toFixed(t >= 1e7 ? 0 : 1)}M` : `${Math.round(t / 1000)}K`;

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  show,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange(v: number): void;
  show: string;
}) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="text-muted w-36 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent flex-1"
      />
      <span className="w-20 text-right font-mono">{show}</span>
    </label>
  );
}

function Choose<T extends { id: string; name: string }>({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: T[];
  value: string;
  onChange(id: string): void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="text-muted w-36 shrink-0">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-line bg-surface min-w-0 flex-1 rounded-lg border px-2 py-1"
      >
        {items.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
    </label>
  );
}

/* 1 ─ Cook, kit or restaurant ------------------------------------------------------------------- */

export function HomeOrRestaurant() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Cook, kit or restaurant"
      stage={
        <div className="grid flex-1 content-center gap-3 md:grid-cols-3">
          {[
            [
              "Cook at home",
              "Add vectors to the database you already run (Postgres with pgvector, OpenSearch).",
              "Most control, cheapest if you have the skills; you do all the work.",
            ],
            [
              "A meal kit",
              "A dedicated vector database or search service (Qdrant, Weaviate, Pinecone, Azure AI Search).",
              "Built for the job; you still wire up chunking, prompts and models.",
            ],
            [
              "A restaurant",
              "A managed RAG service (Bedrock Knowledge Bases, Google Agent Search).",
              "Upload documents, ask questions. Least control, fewest moving parts.",
            ],
          ].map(([t, d, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm">{d}</p>
              <p className="text-muted mt-1 text-xs">{n}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You can eat by cooking at home, buying a meal kit, or going to a restaurant. Each trades
        control and cost for convenience, and none is always right.
      </p>
      <p>
        RAG platforms come in the same three kinds, from your own database to a{" "}
        <Term id="vector-database">vector database</Term> to a managed service. This module maps
        them, prices a realistic workload, asks when a long context window is enough, and checks
        what can stay in India.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The map ----------------------------------------------------------------------------------- */

const COLS = ["Open source", "AWS", "Google Cloud", "Azure"];
const LAYERS: { name: string; what: string; cells: string[] }[] = [
  {
    name: "Store & search",
    what: "Where chunks and vectors live, and how they're searched (modules 6–9).",
    cells: [
      "pgvector (PostgreSQL), OpenSearch, Qdrant, Milvus, Chroma, Vespa; Elasticsearch and Weaviate (check their licences)",
      "OpenSearch Serverless, S3 Vectors, Aurora / RDS PostgreSQL with pgvector",
      "Agent Retrieval (formerly Vector Search), AlloyDB and Cloud SQL with pgvector",
      "Azure AI Search, Azure Database for PostgreSQL with pgvector, Cosmos DB",
    ],
  },
  {
    name: "Managed retrieval",
    what: "Upload documents; the service parses, chunks, embeds and searches.",
    cells: [
      "Frameworks do this in your code: LlamaIndex, LangChain, Haystack",
      "Amazon Bedrock Knowledge Bases (and the newer managed knowledge base)",
      "Agent Search (formerly Vertex AI Search), RAG Engine",
      "Azure AI Search indexers and agentic retrieval",
    ],
  },
  {
    name: "Models",
    what: "Embedding and answering models, hosted or yours.",
    cells: [
      "Open models on your own GPUs or CPUs (e5, bge, Qwen, Phi, gpt-oss)",
      "Amazon Bedrock (Titan, Claude, Cohere, open models)",
      "Gemini Enterprise Agent Platform (Gemini, partner and open models)",
      "Microsoft Foundry (OpenAI models, open models)",
    ],
  },
];

export function TheMap() {
  const [s, set] = useSceneState<CostState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="The map"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {LAYERS.map((l, i) => (
              <button
                key={l.name}
                type="button"
                aria-pressed={s.layer === i}
                onClick={() => set({ layer: i })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.layer === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {l.name}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{LAYERS[s.layer].what}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {COLS.map((c, j) => (
              <motion.div
                key={`${s.layer}-${c}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * j }}
                className={cn(
                  "rounded-xl border px-3 py-2",
                  j === 0 ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="text-xs font-semibold">{c}</p>
                <p className="mt-1 text-xs">{LAYERS[s.layer].cells[j]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every RAG system has the same three layers: somewhere to store and search, something that
        turns documents into chunks and vectors, and models. Pick a layer to see what each ecosystem
        calls it.
      </p>
      <p>
        Names change often; three Google products were renamed in 2026 alone. Licences matter too:
        some &ldquo;open&rdquo; search engines now mix open and source-available code.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What it costs ⭐ (calculator, real list prices) -------------------------------------------- */

export function Calculator() {
  const [s, set] = useSceneState<CostState>();
  const model = ANSWER_MODELS.find((m) => m.id === s.model)!;
  const embedder = EMBEDDERS.find((e) => e.id === s.embedder)!;
  const store = STORES.find((x) => x.id === s.store)!;
  const corpusTokens = s.pages * TOKENS_PER_PAGE;
  const chunks = Math.ceil(corpusTokens / CHUNK_TOKENS);
  const gb = (chunks * DIMS * 4) / 1e9;
  const queries = s.perDay * DAYS;
  const oneOff = (corpusTokens / 1e6) * embedder.price;
  const embedMonthly =
    ((corpusTokens * MONTHLY_CHANGE + queries * QUESTION_TOKENS) / 1e6) * embedder.price;
  const inTokens = queries * (PROMPT_OVERHEAD + QUESTION_TOKENS + s.k * CHUNK_TOKENS);
  const outTokens = queries * ANSWER_TOKENS;
  const gen = (inTokens / 1e6) * model.inp + (outTokens / 1e6) * model.out;
  const storeCost = store.cost(gb, queries);
  const parts: [string, number][] = [
    ["Embedding (updates + questions)", embedMonthly],
    ["Store & search", storeCost],
    ["Answering model", gen],
  ];
  const total = parts.reduce((a, [, v]) => a + v, 0);
  return (
    <StepLayout
      eyebrow="Simulation · list prices, 29 Sept 2026"
      title="What it costs"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Slider
              label="Pages in the collection"
              value={s.pages}
              min={1000}
              max={200000}
              step={1000}
              onChange={(v) => set({ pages: v })}
              show={s.pages.toLocaleString("en-IN")}
            />
            <Slider
              label="Questions a day"
              value={s.perDay}
              min={100}
              max={100000}
              step={100}
              onChange={(v) => set({ perDay: v })}
              show={s.perDay.toLocaleString("en-IN")}
            />
            <Slider
              label="Passages per answer"
              value={s.k}
              min={1}
              max={10}
              step={1}
              onChange={(v) => set({ k: v })}
              show={String(s.k)}
            />
            <Choose
              label="Embedding model"
              items={EMBEDDERS}
              value={s.embedder}
              onChange={(id) => set({ embedder: id })}
            />
            <Choose
              label="Store & search"
              items={STORES}
              value={s.store}
              onChange={(id) => set({ store: id })}
            />
            <Choose
              label="Answering model"
              items={ANSWER_MODELS}
              value={s.model}
              onChange={(id) => set({ model: id })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted text-[11px]">Monthly running cost</p>
            <p className="font-mono text-2xl font-semibold">
              {usd(total)} <span className="text-muted text-sm font-normal">≈ {inr(total)}</span>
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {parts.map(([n, v]) => (
                <div key={n} className="flex items-center gap-2 text-[11px]">
                  <span className="w-44 shrink-0">{n}</span>
                  <div className="bg-surface-2 h-3 flex-1 overflow-hidden rounded">
                    <motion.div
                      className="bg-accent h-full"
                      animate={{ width: `${total ? (v / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono">{usd(v)}</span>
                </div>
              ))}
            </div>
            <p className="text-muted mt-2 text-[10px]">
              One-off: embedding the whole collection costs {usd(oneOff)}. {store.note}
            </p>
          </div>
          <p className="text-muted text-[10px]">
            Assumes {TOKENS_PER_PAGE} tokens a page, {CHUNK_TOKENS}-token chunks (
            {chunks.toLocaleString("en-IN")} chunks, {gb.toFixed(2)} GB of {DIMS}-dimension
            vectors), {PROMPT_OVERHEAD} tokens of instructions, {ANSWER_TOKENS}-token answers,{" "}
            {MONTHLY_CHANGE * 100}% of pages changing each month, 30 days, ₹{INR_PER_USD} to the
            dollar. List prices before tax; no free tiers, discounts or staff time.
          </p>
        </div>
      }
    >
      <p>
        Try the default: 50,000 pages and 20,000 questions a day. Embedding the whole collection
        costs under five dollars with any of these models, once. Storage is small. The answering
        model is almost the whole bill, because every question sends the model several passages.
      </p>
      <p>
        So the biggest levers are the model and the number of passages. A reranker (module 10) that
        lets you send 3 passages instead of 10 pays for itself. Fixed-price search services cost the
        same at 100 questions a day as at 10,000.
      </p>
      <p>
        These are list prices on one day; they change, sometimes on a published date. Gemini also
        charges an hourly fee to keep a cache, and OpenAI&apos;s newest models double the input
        price above 272,000 tokens.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Just paste everything? ⭐ ------------------------------------------------------------------ */

const LC_MODELS = [
  { id: "haiku", name: "Claude Haiku 4.5", window: 200000, inp: 1, cached: 0.1, big: 1 },
  { id: "luna", name: "GPT-6 Luna", window: 1050000, inp: 0.1, cached: 0.01, big: 2 },
];

export function LongContext() {
  const [s, set] = useSceneState<CostState>();
  const q = s.lcPerDay * DAYS;
  const ragTokens = PROMPT_OVERHEAD + QUESTION_TOKENS + 5 * CHUNK_TOKENS;
  return (
    <StepLayout
      eyebrow="Simulation · list prices, 29 Sept 2026"
      title="Just paste everything?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Slider
            label="Collection size"
            value={Math.log10(s.lcTokens)}
            min={4}
            max={7.4}
            step={0.05}
            onChange={(v) => set({ lcTokens: Math.round(10 ** v / 1000) * 1000 })}
            show={`${tokensLabel(s.lcTokens)} tokens`}
          />
          <p className="text-muted -mt-2 pl-38 text-[10px]">
            ≈ {Math.round(s.lcTokens / TOKENS_PER_PAGE).toLocaleString("en-IN")} pages
          </p>
          <Slider
            label="Questions a day"
            value={s.lcPerDay}
            min={10}
            max={20000}
            step={10}
            onChange={(v) => set({ lcPerDay: v })}
            show={s.lcPerDay.toLocaleString("en-IN")}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-muted">
                  <th className="py-1 text-left font-normal">Input cost a month</th>
                  <th className="py-1 text-right font-normal">Paste it all</th>
                  <th className="py-1 text-right font-normal">…with caching</th>
                  <th className="py-1 text-right font-normal">RAG, 5 passages</th>
                </tr>
              </thead>
              <tbody>
                {LC_MODELS.map((m) => {
                  const fits = s.lcTokens <= m.window;
                  const mult = s.lcTokens > 272000 ? m.big : 1;
                  const full = ((q * s.lcTokens) / 1e6) * m.inp * mult;
                  const cached = ((q * s.lcTokens) / 1e6) * m.cached * mult;
                  const rag = ((q * ragTokens) / 1e6) * m.inp;
                  return (
                    <tr key={m.id} className="border-line border-t">
                      <td className="py-1.5">
                        {m.name}
                        <span className="text-muted block text-[10px]">
                          window {tokensLabel(m.window)} tokens
                        </span>
                      </td>
                      {fits ? (
                        <>
                          <td className="py-1.5 text-right font-mono">{usd(full)}</td>
                          <td className="py-1.5 text-right font-mono">{usd(cached)}</td>
                        </>
                      ) : (
                        <td colSpan={2} className="text-bad py-1.5 text-right">
                          Doesn&apos;t fit in the window
                        </td>
                      )}
                      <td className="py-1.5 text-right font-mono">{usd(rag)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-muted text-[10px]">
            Input tokens only; caching assumes every call reuses the cache (no write costs). Above
            272,000 tokens GPT-6 Luna&apos;s input price doubles.
          </p>
        </div>
      }
    >
      <p>
        Some models now read a million tokens at once. So why not skip retrieval and paste the whole
        collection into every prompt? For a small handbook, you can: Anthropic suggested it for
        knowledge bases under about 200,000 tokens (roughly 500 pages).
      </p>
      <p>
        But you pay for every token on every question. Caching cuts that to about a tenth, which is
        still far more than sending five passages. Large collections don&apos;t fit at all: our
        50,000 pages is about 25 million tokens. And models get worse as prompts grow longer and
        noisier (&ldquo;context rot&rdquo;).
      </p>
      <p>
        A middle way from a 2024 study: try RAG first, and fall back to the full document only when
        the model says the passages aren&apos;t enough. It kept most of the quality while cutting
        cost by 39–65%.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Keeping data in India --------------------------------------------------------------------- */

const INDIA: [string, string][] = [
  [
    "A region isn't a guarantee",
    "Every big cloud has Indian regions (Mumbai, Hyderabad, Delhi, Pune, Chennai). But a service or model offered “in Mumbai” may still send your data elsewhere to process it. Check each component.",
  ],
  [
    "Answering models",
    "In September 2026, Claude on Amazon Bedrock in Mumbai and Hyderabad used global routing only, and Google's current Gemini models ran only in global, US or EU locations. Some open models and older OpenAI models can run in India regions.",
  ],
  [
    "Search and storage",
    "Azure AI Search runs in Central India with its full feature set; S3 Vectors and Titan embeddings run in Mumbai. Google Agent Search, Bedrock's newer managed knowledge base and Pinecone had no India location.",
  ],
  [
    "Government projects",
    "MeitY empanels specific cloud service offerings, not whole providers. Check the current list for each service you plan to use.",
  ],
];

export function India() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keeping data in India"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {INDIA.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
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
        For many Indian public-sector projects, where data is stored and processed matters as much
        as price. <Term id="data-residency">Data residency</Term> has to hold for every piece: the
        index, the embedding model and the answering model.
      </p>
      <p>
        This changes month by month, so treat these as examples of what to check, not a current
        list.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Pick a stack ------------------------------------------------------------------------------ */

export function PickStack() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick a stack"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="pick-stack"
            prompt="A state department has 30,000 pages of circulars, expects about 2,000 questions a day, must keep data in India, and already runs PostgreSQL. What do you start with?"
            options={[
              {
                id: "pg",
                label:
                  "pgvector on their Postgres in an Indian region, with embedding and answering models that are confirmed to run in India",
                correct: true,
                feedback:
                  "Yes. It uses skills and servers they have, costs little at this volume, and every component can be checked for residency.",
              },
              {
                id: "long",
                label: "Skip retrieval: paste all the circulars into a long-context model",
                feedback:
                  "30,000 pages is around 15 million tokens, far beyond any context window, and they'd pay for it on every question.",
              },
              {
                id: "managed",
                label: "The simplest fully managed RAG service, whatever its region",
                feedback:
                  "Convenient, but some managed services and models have no Indian location or route data abroad. Residency comes first here.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Put the pieces together.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Three layers, many names",
    "Store & search, managed retrieval, models: on every cloud and in open source.",
  ],
  [
    "The model is the bill",
    "Embedding is cheap; answering dominates. Send fewer, better passages.",
  ],
  ["Long context has limits", "Fine for a small handbook; costly and impossible at scale."],
  [
    "Check residency per piece",
    "An Indian region doesn't mean every service or model stays there.",
  ],
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
        That&apos;s the whole toolkit. The last two modules put it to work: building a scheme
        assistant end to end, and diagnosing a system that gives wrong answers.
      </p>
    </StepLayout>
  );
}
