"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PASSAGES, QUERIES } from "./corpus";
import { convex, keywordRanks, rankOf, rrf, vectorRanks, type Ranked } from "./fusion";
import { VENDORS } from "./vendors";
import type { HybridState } from "./state";

const BY_ID = Object.fromEntries(PASSAGES.map((p) => [p.id, p]));

function fuse(s: HybridState, kw: Ranked, vec: Ranked) {
  return s.fusion === "rrf" ? rrf(kw, vec, s.k, s.w) : convex(kw, vec, s.w);
}

/* 1 ─ Two search parties ----------------------------------------------------------------------- */

export function TwoSearchers() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Two search parties"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "The reader of labels",
              "Checks every door number and name plate exactly. Finds “Form W-12” instantly; has no idea that rubbish means waste.",
            ],
            [
              "The one who understands",
              "Listens to the description and knows where such things usually are. Great with paraphrases and Hindi; muddles 14/2026 with 22/2026.",
            ],
            [
              "Combine the shortlists",
              "Anything near the top of either list goes on the final list, and whatever both put high goes first.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                i === 2 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Looking for a lost file in a big office, you might send two people: one who reads every
        label exactly, one who understands what you described. Each finds things the other misses.
      </p>
      <p>
        <Term id="hybrid-search">Hybrid search</Term> does the same: run keyword search (BM25) and
        vector search side by side, then merge the two ranked lists into one.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The fusion lab ⭐ (computed live) ---------------------------------------------------------- */

function Column({ title, list, gold }: { title: string; list: Ranked; gold: string }) {
  const r = rankOf(list, gold);
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-xs font-semibold">
        {title}{" "}
        <span
          className={cn(
            "font-mono text-[10px]",
            r === 1 ? "text-good" : r && r <= 3 ? "text-fg" : "text-bad",
          )}
        >
          {r ? `right one at #${r}` : "right one not found"}
        </span>
      </p>
      <ol className="flex flex-col gap-1">
        {list.slice(0, 5).map((x, i) => (
          <motion.li
            key={x.id}
            layout
            className={cn(
              "border-line flex gap-1.5 rounded-md border px-1.5 py-1 text-[10px] leading-snug",
              x.id === gold ? "border-good bg-good/10" : "bg-surface",
            )}
          >
            <span className="font-mono">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="font-medium">{BY_ID[x.id].title}</span>
              <span className="text-muted line-clamp-1">{BY_ID[x.id].text}</span>
            </span>
          </motion.li>
        ))}
        {list.length === 0 && <li className="text-muted text-[10px]">No matching words at all.</li>}
      </ol>
    </div>
  );
}

export function FusionLab() {
  const [s, set] = useSceneState<HybridState>();
  const qi = Math.min(s.q, QUERIES.length - 1);
  const Q = QUERIES[qi];
  const kw = useMemo(() => keywordRanks(qi), [qi]);
  const vec = useMemo(() => vectorRanks(qi), [qi]);
  const hy = fuse(s, kw, vec);
  const rk = rankOf(kw, Q.gold);
  const rv = rankOf(vec, Q.gold);
  return (
    <StepLayout
      eyebrow="Live simulation"
      title="The fusion lab"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {QUERIES.map((x, i) => (
              <button
                key={x.q}
                type="button"
                onClick={() => set({ q: i })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  qi === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {x.q}
              </button>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            {Q.note} · the right passage: <span className="text-fg">{BY_ID[Q.gold].title}</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Column title="Keyword (BM25)" list={kw} gold={Q.gold} />
            <Column title="Vector (e5)" list={vec} gold={Q.gold} />
            <Column title="Hybrid" list={hy} gold={Q.gold} />
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-lg border p-2.5">
            <Segmented
              size="sm"
              value={s.fusion}
              options={[
                ["rrf", "Reciprocal rank fusion"],
                ["convex", "Weighted scores"],
              ]}
              onChange={(v) => set({ fusion: v })}
            />
            <label className="flex items-center gap-3 text-xs">
              <span className="text-muted w-28 shrink-0">Keyword ← weight → vector</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={s.w}
                onChange={(e) => set({ w: Number(e.target.value) })}
                className="flex-1 accent-[var(--accent)]"
                aria-label="Weight"
              />
              <span className="w-8 font-mono">{s.w.toFixed(1)}</span>
            </label>
            {s.fusion === "rrf" && (
              <label className="flex items-center gap-3 text-xs">
                <span className="text-muted w-28 shrink-0">k (smoothing)</span>
                <input
                  type="range"
                  min={1}
                  max={120}
                  value={s.k}
                  onChange={(e) => set({ k: Number(e.target.value) })}
                  className="flex-1 accent-[var(--accent)]"
                  aria-label="k"
                />
                <span className="w-8 font-mono">{s.k}</span>
              </label>
            )}
            {s.fusion === "rrf" ? (
              <p className="text-muted font-mono text-[10px]">
                right passage: {rk ? `1/(${s.k}+${rk})` : "0"} + {rv ? `1/(${s.k}+${rv})` : "0"}
                {s.w !== 0.5 && " (weighted)"} = {rrfFor(s, rk, rv).toFixed(4)}
              </p>
            ) : (
              <p className="text-muted text-[10px]">
                Each list&apos;s scores are rescaled to 0–1, then mixed: (1 − weight) × keyword +
                weight × vector.
              </p>
            )}
          </div>
        </div>
      }
    >
      <p>
        Thirty-two made-up Kalpanagar passages: help pages, the 2026 water rules, three circulars
        and a list of KMC form codes. Pick a query and compare the three lists. Keyword search runs
        live; vector search uses real multilingual-e5-small vectors.
      </p>
      <p>
        <Term id="rrf">Reciprocal rank fusion</Term> (2009, first used to merge rankings from
        different search systems) ignores the scores and uses only positions: each list gives a
        passage 1/(k + its rank), and the points are added. It never has to ask whether a BM25 score
        of 7 beats a cosine of 0.86.
      </p>
      <p className="text-muted text-sm">
        Try &ldquo;14/2026&rdquo; (vector search puts it 17th) and &ldquo;when do they take away
        rubbish&rdquo; (keyword search finds nothing). Then move the weight.
      </p>
    </StepLayout>
  );
}

function rrfFor(s: HybridState, rk: number | null, rv: number | null) {
  return (rk ? ((1 - s.w) * 2) / (s.k + rk) : 0) + (rv ? (s.w * 2) / (s.k + rv) : 0);
}

/* 3 ─ Scoreboard ----------------------------------------------------------------------------------- */

export function Scoreboard() {
  const [s, set] = useSceneState<HybridState>();
  const rows = useMemo(
    () => QUERIES.map((_, i) => ({ kw: keywordRanks(i), vec: vectorRanks(i) })),
    [],
  );
  const tally = (f: (i: number) => number | null) => {
    let a1 = 0;
    let a3 = 0;
    QUERIES.forEach((_, i) => {
      const r = f(i);
      if (r === 1) a1++;
      if (r && r <= 3) a3++;
    });
    return [a1, a3];
  };
  const kwT = tally((i) => rankOf(rows[i].kw, QUERIES[i].gold));
  const vecT = tally((i) => rankOf(rows[i].vec, QUERIES[i].gold));
  const hyT = tally((i) => rankOf(fuse(s, rows[i].kw, rows[i].vec), QUERIES[i].gold));
  const cells = QUERIES.map((Q, i) => [
    rankOf(rows[i].kw, Q.gold),
    rankOf(rows[i].vec, Q.gold),
    rankOf(fuse(s, rows[i].kw, rows[i].vec), Q.gold),
  ]);
  const tone = (r: number | null) =>
    r === 1 ? "bg-good/25 text-good" : r && r <= 3 ? "bg-viz-compute/25" : "bg-bad/20 text-bad";
  return (
    <StepLayout
      eyebrow="Live simulation"
      title="Scoreboard"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Keyword", kwT],
              ["Vector", vecT],
              [s.fusion === "rrf" ? "Hybrid (RRF)" : "Hybrid (weighted)", hyT],
            ].map(([t, [a1, a3]]) => (
              <div key={t as string} className="border-line bg-surface rounded-lg border px-2 py-2">
                <p className="text-muted text-[10px]">{t as string}</p>
                <p className="text-sm font-semibold">
                  {a1}/8 first · {a3}/8 in top 3
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_repeat(3,3rem)] gap-1 text-[10px]">
            <span />
            <span className="text-muted text-center">KW</span>
            <span className="text-muted text-center">Vec</span>
            <span className="text-muted text-center">Hyb</span>
            {QUERIES.map((Q, i) => (
              <div key={Q.q} className="contents">
                <span className="truncate">{Q.q}</span>
                {cells[i].map((r, j) => (
                  <span key={j} className={cn("rounded text-center font-mono", tone(r))}>
                    {r ?? "–"}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Segmented
              size="sm"
              value={s.fusion}
              options={[
                ["rrf", "Reciprocal rank fusion"],
                ["convex", "Weighted scores"],
              ]}
              onChange={(v) => set({ fusion: v })}
            />
            <label className="flex items-center gap-3 text-xs">
              <span className="text-muted shrink-0">Weight towards vector</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={s.w}
                onChange={(e) => set({ w: Number(e.target.value) })}
                className="flex-1 accent-[var(--accent)]"
                aria-label="Weight towards vector"
              />
              <span className="w-8 font-mono">{s.w.toFixed(1)}</span>
            </label>
          </div>
        </div>
      }
    >
      <p>
        All eight queries at once, with the rank of the right passage for each method. Change the
        fusion method and the weight and watch the totals.
      </p>
      <p>
        On this set, weighted scores with a slight tilt either way get every query into the top
        three, which neither search does alone. Plain RRF at k = 60 does a little worse here:
        studies find a tuned weighted combination can beat RRF, while RRF needs no tuning at all.
      </p>
      <p className="text-muted text-sm">
        Eight queries is far too few to choose settings for real. The point is the habit: measure on
        your own questions (module 18) before trusting any default.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Do the maths ------------------------------------------------------------------------------ */

export function RrfCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Do the maths"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="rrf-check"
            prompt="With reciprocal rank fusion and k = 60: passage A is 1st in keyword search and 5th in vector search. Passage B is 2nd in both. Which ranks higher after fusion?"
            options={[
              {
                id: "a",
                label: "A: it came first in one list",
                feedback:
                  "A gets 1/61 + 1/65 = 0.01639 + 0.01538 = 0.03178, just below B's 2 × 1/62 = 0.03226. One first place doesn't beat two second places.",
              },
              {
                id: "b",
                label: "B: steady near the top of both",
                correct: true,
                feedback:
                  "1/62 + 1/62 = 0.03226, just ahead of A's 1/61 + 1/65 = 0.03178. RRF rewards agreement between the lists.",
              },
              {
                id: "tie",
                label: "They tie",
                feedback: "Close, but not equal: 0.03226 for B against 0.03178 for A.",
              },
            ]}
          />
        </div>
      }
    >
      <p>RRF score = Σ 1 / (k + rank). Work it out, or estimate.</p>
    </StepLayout>
  );
}

/* 5 ─ Hybrid everywhere ------------------------------------------------------------------------- */

export function Vendors() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Hybrid everywhere"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {VENDORS.map(([n, d], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface flex gap-2 rounded-lg border px-3 py-2"
            >
              <Check className="text-accent mt-0.5 size-3.5 shrink-0" />
              <span className="text-xs">
                <span className="font-semibold">{n}: </span>
                <span className="text-muted">{d}</span>
              </span>
            </motion.div>
          ))}
          <p className="text-muted text-[10px]">As of September 2026; check current docs.</p>
        </div>
      }
    >
      <p>
        Hybrid search is standard. Almost every search engine and vector database supports it, and
        most offer RRF, a weighted mix, or both. Check the defaults: most use k = 60, Qdrant uses 2,
        and some count ranks from 0 rather than 1.
      </p>
      <p className="text-muted text-sm">
        A related idea, <Term id="learned-sparse">learned sparse retrieval</Term> (SPLADE, or
        bge-m3&apos;s sparse output), gets a model to produce keyword-style weights, including
        related words that never appear in the text.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Each search has blind spots", "Keywords miss meaning; vectors muddle exact codes and numbers."],
  ["Fuse the rankings", "RRF adds 1/(k + rank) from each list; no score calibration needed."],
  ["Weights matter", "A tuned weighted mix can do better; tune it on your own test set."],
  ["It's everywhere", "Every major search engine and vector database supports hybrid search."],
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
        Hybrid search is usually the cheapest big win in a RAG system: both searches are fast, and
        together they miss less.
      </p>
      <p>Next: a second, sharper look at the top results before they reach the model.</p>
    </StepLayout>
  );
}
