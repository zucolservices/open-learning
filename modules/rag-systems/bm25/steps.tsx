"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DOCS, buildIndex, idf, search, termScore, tokenize } from "./bm25";
import type { Bm25State } from "./state";

/* 1 ─ The index at the back of the book ---------------------------------------------------------- */

const BOOK: [string, string][] = [
  ["Aadhaar", "7"],
  ["certificates, birth", "4, 5"],
  ["deposit, water", "8"],
  ["fines: mixed waste", "11"],
  ["property tax", "1, 2, 3, 7"],
  ["rebate", "1"],
  ["trade licence", "13, 14"],
  ["water connection", "7, 8, 9"],
];

export function BackOfTheBook() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The index at the back of the book"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <div className="border-line bg-surface mx-auto w-full max-w-sm rounded-xl border p-4 font-serif">
            <p className="mb-2 text-center text-sm font-semibold tracking-widest uppercase">
              Index
            </p>
            <ul className="flex flex-col gap-1 text-sm">
              {BOOK.map(([k, v], i) => (
                <motion.li
                  key={k}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={cn(
                    "flex gap-2",
                    k === "water connection" && "text-accent font-semibold",
                  )}
                >
                  <span>{k}</span>
                  <span className="border-line mb-1 flex-1 border-b border-dotted" />
                  <span className="tabular-nums">{v}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      }
    >
      <p>
        Looking for &ldquo;water connection&rdquo; in a thick handbook, you don&apos;t read every
        page. You turn to the index at the back, find the words, and jump to pages 7, 8 and 9.
      </p>
      <p>
        Keyword search works the same way. Ahead of time it builds an{" "}
        <Term id="inverted-index">inverted index</Term>: for every word, the list of documents that
        contain it and how often. A query only has to look up its own words.
      </p>
      <p className="text-muted text-sm">
        Then it has to rank the pages it found. The most widely used ranking formula is{" "}
        <Term id="bm25">BM25</Term>, the default in Lucene, Elasticsearch and OpenSearch.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Search, live ⭐ ------------------------------------------------------------------------------ */

const EXAMPLES = [
  "water connection fee",
  "fine for mixed waste",
  "Aadhaar",
  "how many days to get a certificate copy",
  "rubbish",
  "कचरा",
];

function Toggle({
  on,
  label,
  onChange,
}: {
  on: boolean;
  label: string;
  onChange(v: boolean): void;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px]">
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function LiveSearch() {
  const [s, set] = useSceneState<Bm25State>();
  const opts = { stop: s.stop, stem: s.stem };
  const ix = useMemo(() => buildIndex(DOCS, { stop: s.stop, stem: s.stem }), [s.stop, s.stem]);
  const qTerms = [...new Set(tokenize(s.query, opts))];
  const hits = search(ix, qTerms, s.k1, s.b);
  const max = hits[0]?.score ?? 1;
  return (
    <StepLayout
      eyebrow="Live simulation"
      title="Search, live"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <input
            value={s.query}
            onChange={(e) => set({ query: e.target.value })}
            aria-label="Search query"
            className="border-line bg-surface focus:border-accent rounded-lg border px-3 py-2 text-sm outline-none"
            placeholder="Type a question…"
          />
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => set({ query: e })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.query === e ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Toggle
              on={s.stop}
              label="Drop stop words (the, for, to…)"
              onChange={(v) => set({ stop: v })}
            />
            <Toggle
              on={s.stem}
              label="Stem words (days → day)"
              onChange={(v) => set({ stem: v })}
            />
          </div>
          <div className="border-line bg-surface rounded-lg border p-2">
            <p className="text-muted mb-1 text-[10px] tracking-wide uppercase">
              Inverted index: your query&apos;s words
            </p>
            {qTerms.length === 0 && <p className="text-muted text-xs">No searchable words.</p>}
            <div className="flex flex-col gap-1">
              {qTerms.map((t) => {
                const post = ix.postings.get(t) ?? [];
                return (
                  <div key={t} className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="bg-surface-2 rounded px-1.5 font-mono">{t}</span>
                    <span className="text-muted">
                      in {post.length} of {ix.N} · IDF {idf(ix, t).toFixed(2)}
                    </span>
                    {post.length === 0 ? (
                      <span className="text-bad">no document contains this word</span>
                    ) : (
                      post.map(([d, f]) => (
                        <span
                          key={d}
                          className="border-line rounded border px-1 font-mono text-[10px]"
                        >
                          {DOCS[d].id}×{f}
                        </span>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <ol className="flex flex-col gap-1.5">
            {hits.slice(0, 5).map((h, i) => (
              <motion.li
                key={h.doc}
                layout
                className={cn(
                  "border-line rounded-lg border px-2.5 py-1.5",
                  i === 0 ? "bg-accent-soft" : "bg-surface",
                )}
              >
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-mono font-semibold">{i + 1}</span>
                  <span className="font-medium">{DOCS[h.doc].title}</span>
                  <span className="ml-auto font-mono">{h.score.toFixed(2)}</span>
                </div>
                <div className="bg-surface-2 mt-1 flex h-1.5 overflow-hidden rounded">
                  {h.parts.map((p, k) => (
                    <div
                      key={p.term}
                      title={`${p.term}: ${p.score.toFixed(2)}`}
                      style={{ width: `${(p.score / max) * 100}%` }}
                      className={
                        ["bg-viz-data", "bg-viz-meta", "bg-viz-compute", "bg-viz-add"][k % 4]
                      }
                    />
                  ))}
                </div>
                <p className="text-muted mt-1 line-clamp-2 text-[10px]">{DOCS[h.doc].text}</p>
                <p className="text-muted text-[10px]">
                  {h.parts.map((p) => `${p.term} ×${p.tf} → ${p.score.toFixed(2)}`).join(" · ")}
                </p>
              </motion.li>
            ))}
            {hits.length === 0 && (
              <li className="border-bad/50 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
                Nothing found. None of these words appears in any document.
              </li>
            )}
          </ol>
        </div>
      }
    >
      <p>
        Type anything, or try the examples. Before indexing, text is split into words, and can drop{" "}
        <Term id="stop-words">stop words</Term> and apply <Term id="stemming">stemming</Term>:
        toggle both. The {DOCS.length} passages are the Kalpanagar help pages from module 2.
        Everything is computed live in your browser.
      </p>
      <p>
        Each query word adds to a document&apos;s score. Rare words count for more: that&apos;s the{" "}
        <Term id="idf">IDF</Term> (inverse document frequency) column. A word in every passage says
        nothing about which passage you want.
      </p>
      <p className="text-muted text-sm">
        Now try &ldquo;rubbish&rdquo; and &ldquo;कचरा&rdquo; (Hindi for garbage). Keyword search
        only matches the exact words, after stemming. It has no idea that rubbish means waste.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The two knobs ----------------------------------------------------------------------------- */

const CW = 300;
const CH = 165;

export function TwoKnobs() {
  const [s, set] = useSceneState<Bm25State>();
  const tfs = Array.from({ length: 11 }, (_, i) => i);
  const curve = (k1: number, b: number, ratio: number) =>
    tfs.map((f) => termScore(f, ratio, 1, 1, k1, b));
  const mine = curve(s.k1, s.b, s.lenRatio);
  const raw = tfs.map((f) => f / 9);
  const maxY = 1.2;
  const x = (f: number) => 30 + (f / 10) * (CW - 40);
  const y = (v: number) => CH - 35 - (Math.min(v, maxY) / maxY) * (CH - 45);
  const path = (vs: number[]) => vs.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
  return (
    <StepLayout
      eyebrow="Explore"
      title="The two knobs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg
            viewBox={`0 0 ${CW} ${CH}`}
            className="mx-auto w-full max-w-md"
            role="img"
            aria-label="Score against word count"
          >
            <line x1={30} x2={CW - 10} y1={CH - 35} y2={CH - 35} className="stroke-line-strong" />
            <line x1={30} x2={30} y1={10} y2={CH - 35} className="stroke-line-strong" />
            <text
              x={(CW + 20) / 2}
              y={CH - 4}
              textAnchor="middle"
              className="fill-muted text-[8px]"
            >
              times the word appears in the passage
            </text>
            <path d={path(raw)} fill="none" className="stroke-muted" strokeDasharray="3 3" />
            <motion.path
              initial={false}
              animate={{ d: path(mine) }}
              fill="none"
              className="stroke-accent"
              strokeWidth={2.5}
            />
            {tfs.map((f) => (
              <text
                key={f}
                x={x(f)}
                y={CH - 25}
                textAnchor="middle"
                className="fill-muted text-[7px]"
              >
                {f}
              </text>
            ))}
          </svg>
          <p className="text-muted text-center text-[10px]">
            Solid line: one word&apos;s BM25 contribution (IDF set to 1). Dashed: plain counting,
            which never stops growing.
          </p>
          <label className="grid gap-1 text-xs">
            <span className="flex justify-between">
              <span>
                <strong>k1</strong> · how fast repeats stop counting
              </span>
              <span className="font-mono">{s.k1.toFixed(1)}</span>
            </span>
            <input
              type="range"
              className="accent-[var(--accent)]"
              min={0.2}
              max={3}
              step={0.1}
              value={s.k1}
              onChange={(e) => set({ k1: Number(e.target.value) })}
              aria-label="k1"
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="flex justify-between">
              <span>
                <strong>b</strong> · how much long passages are penalised
              </span>
              <span className="font-mono">{s.b.toFixed(2)}</span>
            </span>
            <input
              type="range"
              className="accent-[var(--accent)]"
              min={0}
              max={1}
              step={0.05}
              value={s.b}
              onChange={(e) => set({ b: Number(e.target.value) })}
              aria-label="b"
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="flex justify-between">
              <span>This passage&apos;s length compared with the average</span>
              <span className="font-mono">×{s.lenRatio.toFixed(1)}</span>
            </span>
            <input
              type="range"
              className="accent-[var(--accent)]"
              min={0.3}
              max={3}
              step={0.1}
              value={s.lenRatio}
              onChange={(e) => set({ lenRatio: Number(e.target.value) })}
              aria-label="Passage length"
            />
          </label>
          <button
            type="button"
            onClick={() => set({ k1: 1.2, b: 0.75, lenRatio: 1 })}
            className="text-muted self-start text-[11px] underline"
          >
            Reset to the usual defaults (k1 = 1.2, b = 0.75)
          </button>
        </div>
      }
    >
      <p>
        BM25 has two settings. <strong>k1</strong> controls saturation: the fifth mention of
        &ldquo;water&rdquo; should count for less than the first. <strong>b</strong> controls
        length: a word in a short passage says more than the same word lost in a long one.
      </p>
      <p>
        With the usual settings the curve levels off towards the word&apos;s rarity weight: no
        number of repeats can push one word past it. The usual defaults are k1 = 1.2 and b = 0.75.
        They work well enough that most teams never change them; tune them only against a test set
        of real questions.
      </p>
      <p className="text-muted text-sm">
        We use Lucene&apos;s formula, as in Elasticsearch and OpenSearch today. Textbooks also
        multiply by (k1 + 1): the numbers differ, the ranking doesn&apos;t.
      </p>
      <p className="text-muted text-sm">
        The same sliders act on the live search in the previous step. Go back and watch the ranking
        shift.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Finds it or misses it? --------------------------------------------------------------------- */

export function FindsOrMisses() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Finds it or misses it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="bm25-finds"
            prompt="Will keyword search find the right Kalpanagar passage for each query?"
            categories={[
              { id: "finds", label: "Finds it" },
              { id: "misses", label: "Misses it" },
            ]}
            items={[
              {
                id: "aadhaar",
                label: "“Aadhaar”",
                category: "finds",
                why: "An exact name that appears in the water-connection passage. Exact terms are where keywords shine.",
              },
              {
                id: "rubbish",
                label: "“When is rubbish picked up?”",
                category: "misses",
                why: "The passages say waste and collected, never rubbish or picked. No shared words, no match.",
              },
              {
                id: "hindi",
                label: "“कचरा कब उठाया जाता है?” (Hindi)",
                category: "misses",
                why: "The passages are in English. Keyword search can't cross languages or scripts.",
              },
              {
                id: "licence",
                label: "“trade licence late renewal”",
                category: "finds",
                why: "Trade, licence and late all appear in the trade-licence passages.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Predict each one, then check. You can test them in the live search too.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Inverted index", "For each word, which documents contain it: fast to look up."],
  ["BM25 ranks", "Rare words count more; repeats saturate; long passages are discounted."],
  ["Strong at exact terms", "Names, IDs, form numbers, amounts."],
  ["Blind to meaning", "Synonyms, paraphrases and other languages don't match."],
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
        BM25 is decades old and still hard to beat as a baseline. Its weakness is meaning, which is
        exactly what embeddings are good at.
      </p>
      <p>Next: searching by meaning with embeddings.</p>
    </StepLayout>
  );
}
