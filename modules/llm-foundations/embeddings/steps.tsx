"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FAQ, GROUPS, MODEL_NAME, QUERIES, WORDS, byText, nearest } from "./vectors";
import { GROUP_LABELS } from "./word-map";
import type { EmbedState } from "./state";

const WordMap = dynamic(() => import("./word-map").then((m) => m.WordMap), { ssr: false });

const DOT: Record<string, string> = {
  royalty: "bg-accent",
  drinks: "bg-viz-compute",
  animals: "bg-viz-add",
  transport: "bg-viz-data",
  feelings: "bg-viz-remove",
  places: "bg-viz-meta",
};

/* 1 ─ A map of meaning ⭐ -------------------------------------------------------------------------- */

export function MeaningMap() {
  const [s, set] = useSceneState<EmbedState>();
  const w = s.picked ? byText(s.picked) : undefined;
  const near = w ? nearest(w.v, WORDS, [w.text], 5) : [];
  const far = w
    ? nearest(
        w.v.map((x) => -x),
        WORDS,
        [w.text],
        1,
      )[0]
    : undefined;
  return (
    <StepLayout
      eyebrow="3D model"
      title="A map of meaning"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface relative h-80 overflow-hidden rounded-xl border sm:h-96">
            <WordMap picked={s.picked} onPick={(t) => set({ picked: t })} />
          </div>
          <div className="text-muted flex flex-wrap gap-3 text-[10px]">
            {GROUPS.map((g) => (
              <span key={g} className="flex items-center gap-1">
                <span className={cn("size-2 rounded-full", DOT[g])} /> {GROUP_LABELS[g]}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {["king", "chai", "puppy", "Bengaluru", "happy", "train"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set({ picked: t })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.picked === t
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {w ? (
              <motion.div
                key={w.text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-line bg-surface rounded-xl border p-3"
              >
                <p className="text-xs">
                  Closest to <span className="font-semibold">{w.text}</span> (cosine similarity, all
                  384 dimensions):
                </p>
                <div className="mt-2 grid gap-1">
                  {near.map((n) => (
                    <div key={n.text} className="flex items-center gap-2 text-xs">
                      <span className="w-24 shrink-0 font-mono">{n.text}</span>
                      <span className="bg-surface-2 relative h-2.5 flex-1 overflow-hidden rounded">
                        <motion.span
                          className="bg-accent absolute inset-y-0 left-0 rounded"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(0, n.sim) * 100}%` }}
                        />
                      </span>
                      <span className="text-muted w-10 text-right font-mono">
                        {n.sim.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {w.text === "chai" && (
                  <p className="text-viz-compute mt-2 text-[11px]">
                    Surprised? This small, English-trained model seems to treat &ldquo;chai&rdquo;
                    partly as a name. Hold that thought for the checkpoint.
                  </p>
                )}
                {far && (
                  <p className="text-muted mt-2 text-[11px]">
                    Least similar: <span className="font-mono">{far.text}</span>
                  </p>
                )}
              </motion.div>
            ) : (
              <p className="text-muted text-xs">
                Drag to rotate. Click a point (or a word above) to see its nearest neighbours.
              </p>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <p>
        On a map, places that are close together are similar in one way: nearby. An{" "}
        <Term id="embedding">embedding</Term> does the same for meaning. Each word or sentence
        becomes a long list of numbers, coordinates in a space where similar meanings land close
        together.
      </p>
      <p>
        These are real embeddings of 38 words from a small open model. Nobody told it that chai is a
        drink or that puppies are animals; it learned that from how words are used.
      </p>
      <p className="text-muted text-sm">
        The real space has 384 dimensions; the map squeezes them into 3, so some neighbours look
        further apart than they are. The list uses all 384.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Search by meaning ⭐ -------------------------------------------------------------------------- */

const words = (t: string) => new Set(t.toLowerCase().match(/[a-z]+/g) ?? []);
const STOP = new Set([
  "the",
  "a",
  "an",
  "to",
  "i",
  "my",
  "do",
  "you",
  "is",
  "on",
  "of",
  "in",
  "and",
  "can",
  "your",
  "will",
  "what",
  "does",
  "when",
  "get",
  "it",
  "every",
  "our",
]);
function keywordScore(q: string, d: string) {
  const qa = [...words(q)].filter((w) => !STOP.has(w));
  const da = words(d);
  return qa.filter((w) => da.has(w)).length;
}

export function Search() {
  const [s, set] = useSceneState<EmbedState>();
  const q = QUERIES[s.query];
  const semantic = useMemo(() => nearest(q.v, FAQ, [], 3), [q]);
  const keyword = useMemo(
    () =>
      FAQ.map((f) => ({ text: f.text, score: keywordScore(q.text, f.text) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [q],
  );
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Search by meaning"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-muted text-xs">A customer types…</p>
          <div className="flex flex-wrap gap-1.5">
            {QUERIES.map((x, i) => (
              <button
                key={x.text}
                type="button"
                onClick={() => set({ query: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.query === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {x.text}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="mb-2 text-xs font-semibold">Keyword search</p>
              {keyword[0].score === 0 ? (
                <p className="text-bad text-xs">No FAQ shares a keyword with the question.</p>
              ) : (
                keyword
                  .filter((k) => k.score > 0)
                  .map((k) => (
                    <p
                      key={k.text}
                      className="border-line mb-1 rounded-md border px-2 py-1 text-xs"
                    >
                      {k.text} <span className="text-muted font-mono">({k.score} shared)</span>
                    </p>
                  ))
              )}
            </div>
            <div className="border-accent/40 bg-accent-soft rounded-xl border p-3">
              <p className="mb-2 text-xs font-semibold">Search by embedding</p>
              {semantic.map((m, i) => (
                <motion.p
                  key={`${s.query}${m.text}`}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "mb-1 rounded-md border px-2 py-1 text-xs",
                    i === 0 ? "border-accent bg-surface" : "border-line bg-surface/60",
                  )}
                >
                  {m.text} <span className="text-muted font-mono">{m.sim.toFixed(2)}</span>
                </motion.p>
              ))}
            </div>
          </div>
          <p className="text-muted text-[11px]">
            Every FAQ entry was embedded once, ahead of time; the question is embedded when asked,
            and the closest entries win.
          </p>
        </div>
      }
    >
      <p>
        Brewline&apos;s help desk has 16 FAQ entries. Customers never use the same words. Compare
        matching words with matching meaning.
      </p>
      <p className="text-muted text-sm">
        &ldquo;Bangalore&rdquo; finds &ldquo;Bengaluru&rdquo;; &ldquo;money back&rdquo; finds
        &ldquo;refunds&rdquo;. This is <Term id="semantic-search">semantic search</Term>, the heart
        of retrieval-augmented generation (RAG), which has its own track.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Measuring closeness ---------------------------------------------------------------------------- */

export function Cosine() {
  const [s, set] = useSceneState<EmbedState>();
  const rad = (s.angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const cx = 150;
  const cy = 120;
  const L = 95;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Measuring closeness"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox="0 0 300 140"
              className="mx-auto w-full max-w-md"
              role="img"
              aria-label="Two vectors and the angle between them"
            >
              <line x1={cx - 120} x2={cx + 120} y1={cy} y2={cy} stroke="var(--line)" />
              <line
                x1={cx}
                x2={cx + L}
                y1={cy}
                y2={cy}
                stroke="var(--accent)"
                strokeWidth={3}
                markerEnd="url(#cos-a)"
              />
              <motion.line
                x1={cx}
                y1={cy}
                animate={{ x2: cx + L * Math.cos(rad), y2: cy - L * Math.sin(rad) }}
                initial={false}
                stroke="var(--viz-data)"
                strokeWidth={3}
              />
              <path
                d={`M${cx + 28},${cy} A28,28 0 ${s.angle > 180 ? 1 : 0},0 ${cx + 28 * Math.cos(rad)},${cy - 28 * Math.sin(rad)}`}
                fill="none"
                stroke="var(--muted)"
              />
              <text x={cx + L + 6} y={cy + 4} className="fill-fg text-[9px]">
                “refund”
              </text>
              <text
                x={cx + (L + 8) * Math.cos(rad)}
                y={cy - (L + 8) * Math.sin(rad)}
                textAnchor="middle"
                className="fill-fg text-[9px]"
              >
                {s.angle < 45
                  ? "“money back”"
                  : s.angle < 100
                    ? "“opening hours”"
                    : "“not a refund”"}
              </text>
              <defs>
                <marker
                  id="cos-a"
                  viewBox="0 0 10 10"
                  refX={8}
                  refY={5}
                  markerWidth={4}
                  markerHeight={4}
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
                </marker>
              </defs>
            </svg>
          </div>
          <label className="flex items-center gap-3 text-xs">
            <span className="text-muted shrink-0">Angle</span>
            <input
              type="range"
              min={0}
              max={180}
              value={s.angle}
              onChange={(e) => set({ angle: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Angle between the two vectors"
            />
            <span className="w-10 text-right font-mono">{s.angle}°</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Cosine similarity</p>
              <p className="font-mono text-lg">{cos.toFixed(2)}</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
              {cos > 0.8
                ? "Pointing the same way: very similar meaning."
                : cos > 0.3
                  ? "Somewhat related."
                  : cos > -0.2
                    ? "Unrelated: at right angles."
                    : "Pointing opposite ways."}
            </div>
          </div>
        </div>
      }
    >
      <p>
        How close is close? Think of each embedding as an arrow from the centre of the space.
        Similar meanings point in similar directions.
      </p>
      <p>
        <Term id="cosine-similarity">Cosine similarity</Term> measures the angle between two arrows:
        1 for the same direction, 0 at right angles, −1 for opposite. Turn the slider.
      </p>
      <p className="text-muted text-sm">
        Here it&apos;s drawn in 2 dimensions; the maths is identical in 384 or 3,072. In practice
        text embeddings rarely go below about 0: unrelated text sits near right angles.
      </p>
    </StepLayout>
  );
}

/* 4 ─ King − man + woman ------------------------------------------------------------------------------ */

const ANALOGIES: [string, string, string][] = [
  ["king", "man", "woman"],
  ["prince", "boy", "girl"],
  ["puppy", "dog", "cat"],
];

export function Analogy() {
  const [s, set] = useSceneState<EmbedState>();
  const [a, b, c] = ANALOGIES[s.analogy];
  const target = useMemo(() => {
    const va = byText(a).v;
    const vb = byText(b).v;
    const vc = byText(c).v;
    return va.map((x, i) => x - vb[i] + vc[i]);
  }, [a, b, c]);
  const res = nearest(target, WORDS, s.excludeInputs ? [a, b, c] : [], 4);
  return (
    <StepLayout
      eyebrow="Experiment"
      title="King − man + woman"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {ANALOGIES.map(([x, y, z], i) => (
              <button
                key={x}
                type="button"
                onClick={() => set({ analogy: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-xs",
                  s.analogy === i
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x} − {y} + {z}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.excludeInputs}
              onChange={(e) => set({ excludeInputs: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Leave out the three input words (what most demos quietly do)
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="mb-2 text-xs">
              Nearest words to{" "}
              <span className="font-mono">
                {a} − {b} + {c}
              </span>
              :
            </p>
            {res.map((r, i) => (
              <motion.div
                key={`${s.analogy}${s.excludeInputs}${r.text}`}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 text-xs"
              >
                <span
                  className={cn(
                    "w-20 shrink-0 font-mono",
                    [a, b, c].includes(r.text) && "text-bad",
                  )}
                >
                  {r.text}
                </span>
                <span className="bg-surface-2 relative h-2.5 flex-1 overflow-hidden rounded">
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 rounded",
                      i === 0 ? "bg-accent" : "bg-viz-data/60",
                    )}
                    style={{ width: `${Math.max(0, r.sim) * 100}%` }}
                  />
                </span>
                <span className="text-muted w-10 text-right font-mono">{r.sim.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              s.excludeInputs
                ? "border-good/40 bg-good/10"
                : "border-viz-compute/40 bg-viz-compute/10",
            )}
          >
            {s.excludeInputs
              ? "The famous result appears. Directions in the space capture relationships such as 'female version of'."
              : "Honest version: the answer is mostly just the starting word. The effect is real but weaker than the famous demos suggest."}
          </p>
        </div>
      }
    >
      <p>
        A famous demo from 2013: take the arrow for &ldquo;king&rdquo;, subtract &ldquo;man&rdquo;,
        add &ldquo;woman&rdquo;, and you land near &ldquo;queen&rdquo;. Try it on these real
        embeddings, then untick the box.
      </p>
      <p className="text-muted text-sm">
        Researchers (Nissim et al., 2020) showed that many celebrated, and some worrying biased,
        analogies depend on excluding the input words. Always check how an impressive demo was run.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function Where() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why did it miss?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="embed-miss"
            prompt="In this small model, 'chai' and 'tea' score only about 0.31 similarity, lower than you'd expect. What's the best explanation?"
            options={[
              {
                id: "data",
                label:
                  "The model learned from text where 'chai' was rare and used differently; embeddings reflect their training data",
                correct: true,
                feedback:
                  "Right. Embeddings capture usage in the training data. Small or English-heavy models know less about words common in India; larger, multilingual models do better.",
              },
              {
                id: "bug",
                label: "Cosine similarity is broken for short words",
                feedback: "The measure is fine; it faithfully reports what the model learned.",
              },
              {
                id: "dims",
                label: "384 dimensions isn't enough to store any meaning",
                feedback:
                  "384 dimensions capture a lot; the gap is in what the model saw during training.",
              },
              {
                id: "same",
                label: "They mean different things",
                feedback: "Chai is tea, spiced or not. The model just hasn't learned that well.",
              },
            ]}
            explanation="Test embedding models on your own data and languages before trusting them; leaderboards like MTEB help, but your data is the real benchmark."
          />
        </div>
      }
    >
      <p>Real models have blind spots, and they come from the data.</p>
    </StepLayout>
  );
}

/* 6 ─ Landscape ------------------------------------------------------------------------------------ */

const MODELS: [string, string, string][] = [
  [
    "OpenAI text-embedding-3-small / -large",
    "1,536 / 3,072",
    "Can be shortened with a dimensions setting",
  ],
  [
    "Google gemini-embedding-001 / -2",
    "up to 3,072",
    "Shortenable; version 2 also embeds images and more",
  ],
  ["Cohere Embed v4", "1,536 (or 256–1,024)", "Text and images, long inputs"],
  ["Amazon Titan Text Embeddings V2", "1,024 (or 512, 256)", "On AWS Bedrock"],
  ["BGE-M3 · multilingual-e5-large", "1,024", "Open, 100+ languages"],
  [
    "Qwen3-Embedding · EmbeddingGemma",
    "up to 4,096 · 768",
    "Open; EmbeddingGemma (308M) runs on a laptop",
  ],
  ["all-MiniLM-L6-v2 (used here)", "384", "Tiny and fast; English-focused"],
];

export function Landscape() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Embedding models you'll meet"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <div className="border-line bg-surface divide-line divide-y rounded-xl border">
            {MODELS.map(([m, d, note], i) => (
              <motion.div
                key={m}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="grid gap-0.5 px-3 py-2 text-xs sm:grid-cols-[1fr_auto]"
              >
                <span>
                  <span className="font-medium">{m}</span>
                  <span className="text-muted block text-[10px]">{note}</span>
                </span>
                <span className="font-mono">{d}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Embedding models are separate from chat models: smaller, cheaper, and built only to produce
        vectors. Many support Indian languages; check before you choose.
      </p>
      <p className="text-muted text-sm">
        The MTEB benchmark compares them across dozens of tasks and languages. Vectors from
        different models aren&apos;t compatible: switching models means re-embedding everything.
        This page used {MODEL_NAME}.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Meaning as coordinates",
    "An embedding is a list of numbers; similar meanings sit close together.",
  ],
  ["Cosine similarity", "The angle between vectors measures how related two texts are."],
  ["Search by meaning", "Embed once, compare fast: the basis of semantic search and RAG."],
  ["Learned from data", "Embeddings inherit the gaps and biases of their training text."],
  ["Model-specific", "Vectors from different models don't mix."],
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
        Inside an LLM, every token starts as an embedding too. But &ldquo;bank&rdquo; means
        different things by a river and in a city.
      </p>
      <p>Next chapter: attention, how models let words shape each other&apos;s meaning.</p>
    </StepLayout>
  );
}
