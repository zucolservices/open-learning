"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PASSAGES } from "../hybrid-search/corpus";
import data from "./data.json";
import { RERANKERS } from "./rerankers";
import type { RerankState } from "./state";

const BY_ID = Object.fromEntries(PASSAGES.map((p) => [p.id, p]));
const SCORERS: [RerankState["scorer"], string, string][] = [
  ["minilm", "Small English cross-encoder", "ms-marco-MiniLM-L6 · 23M parameters"],
  ["bgem3", "Multilingual cross-encoder", "bge-reranker-v2-m3 · about 568M parameters"],
  ["llm", "LLM as judge", "Phi-4-mini asked “Yes or No?”"],
];

/* 1 ─ Two rounds of selection ---------------------------------------------------------------- */

export function TwoRounds() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Two rounds of selection"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "Round 1 · screen 2,000 CVs",
              "Quick keyword and summary check. Fast, rough, generous: keep the best 20.",
              "Retrieval (bi-encoder, BM25)",
            ],
            [
              "Round 2 · interview 20",
              "Read each one against the job, carefully. Slow, so only for the shortlist.",
              "Reranking (cross-encoder)",
            ],
            [
              "Offer only to those who pass",
              "If none is good enough, don't hire anyone just to fill the seat.",
              "Relevance filter",
            ],
          ].map(([t, d, tag], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
              style={{ marginLeft: `${i * 6}%` }}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
              <p className="text-accent mt-1 text-[10px] font-medium">{tag}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Hiring from 2,000 applicants, nobody interviews all of them. A quick screen shortlists 20;
        careful interviews rank those; offers go only to people who clear the bar.
      </p>
      <p>
        Search works the same way. The first search compares precomputed vectors, so it&apos;s fast
        but rough. A <Term id="reranker">reranker</Term> then reads the question and each
        shortlisted passage <em>together</em>, a <Term id="cross-encoder">cross-encoder</Term>,
        which is far more accurate and far too slow to run on everything.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rerank the shortlist ⭐ (real models) -------------------------------------------------------- */

function Row({
  id,
  rank,
  move,
  p,
  gold,
}: {
  id: string;
  rank: number;
  move?: number;
  p?: number;
  gold: boolean;
}) {
  return (
    <motion.li
      layout
      className={cn(
        "border-line flex items-center gap-2 rounded-md border px-2 py-1 text-[11px]",
        gold ? "border-good bg-good/10" : "bg-surface",
      )}
    >
      <span className="w-4 font-mono">{rank}</span>
      <span className="min-w-0 flex-1">
        <span className="font-medium">{BY_ID[id].title}</span>
        <span className="text-muted line-clamp-1">{BY_ID[id].text}</span>
      </span>
      {p !== undefined && (
        <span className="flex w-20 shrink-0 items-center gap-1">
          <span className="bg-surface-2 h-1.5 flex-1 overflow-hidden rounded">
            <span className="bg-accent block h-full" style={{ width: `${p * 100}%` }} />
          </span>
          <span className="w-7 text-right font-mono text-[9px]">{Math.round(p * 100)}%</span>
        </span>
      )}
      {move !== undefined && move !== 0 && (
        <span
          className={cn("flex w-6 items-center text-[9px]", move > 0 ? "text-good" : "text-muted")}
        >
          {move > 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
          {Math.abs(move)}
        </span>
      )}
    </motion.li>
  );
}

export function RerankLab() {
  const [s, set] = useSceneState<RerankState>();
  const qi = Math.min(s.q, data.length - 1);
  const d = data[qi];
  const re = d[s.scorer];
  const firstPos = new Map(d.first.map((f, i) => [f.id, i + 1]));
  const goldFirst = d.first.findIndex((x) => d.gold.includes(x.id)) + 1;
  const goldRe = re.findIndex((x) => d.gold.includes(x.id)) + 1;
  return (
    <StepLayout
      eyebrow="Real models"
      title="Rerank the shortlist"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            {data.map((x, i) => (
              <button
                key={x.q}
                type="button"
                onClick={() => set({ q: i })}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-left text-xs",
                  qi === i
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {x.q}
              </button>
            ))}
          </div>
          <Segmented
            size="sm"
            value={s.scorer}
            options={SCORERS.map(([k, n]) => [k, n] as [RerankState["scorer"], string])}
            onChange={(v) => set({ scorer: v })}
          />
          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <p className="text-muted mb-1 text-[11px]">
                First search (vector) · right passage at{" "}
                <span className="font-mono">#{goldFirst}</span>
              </p>
              <ol className="flex flex-col gap-1">
                {d.first.slice(0, 6).map((f, i) => (
                  <Row key={f.id} id={f.id} rank={i + 1} gold={d.gold.includes(f.id)} />
                ))}
              </ol>
            </div>
            <div>
              <p className="text-muted mb-1 text-[11px]">
                Reranked · right passage at <span className="font-mono">#{goldRe}</span> ·{" "}
                {SCORERS.find((x) => x[0] === s.scorer)![2]}
              </p>
              <ol className="flex flex-col gap-1">
                {re.slice(0, 6).map((r, i) => (
                  <Row
                    key={r.id}
                    id={r.id}
                    rank={i + 1}
                    p={r.p}
                    move={(firstPos.get(r.id) ?? 0) - (i + 1)}
                    gold={d.gold.includes(r.id)}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Each question&apos;s top 10 from vector search (multilingual-e5-small, over the 32
        Kalpanagar passages) was rescored by three real judges. The percentage is each judge&apos;s
        confidence that the passage is relevant.
      </p>
      <p>
        Try the leaking-pipe question: the first search puts the right rule third, and the rerankers
        lift it. Then try the Hindi question with the small English model: it scores every passage
        at about 0%, because it can&apos;t read the question at all.
      </p>
      <p className="text-muted text-sm">
        The &ldquo;LLM as judge&rdquo; asks a language model a yes/no question per passage.
        Purpose-built decision models such as TypeSafe&apos;s Jev (September 2026) are designed for
        exactly this kind of call: one community test reranked with it and then filtered out 92% of
        candidates while keeping every relevant one. Promising, new and closed; test before relying
        on it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Keep only what helps ⭐ (threshold) ------------------------------------------------------ */

export function FilterLab() {
  const [s, set] = useSceneState<RerankState>();
  const summary = data.map((d) => {
    const kept = d[s.scorer].filter((x) => x.p >= s.threshold);
    return { d, kept, goldKept: kept.some((x) => d.gold.includes(x.id)) };
  });
  const qi = Math.min(s.q, data.length - 1);
  const cur = summary[qi];
  const totalKept = summary.reduce((a, x) => a + x.kept.length, 0);
  const goldKept = summary.filter((x) => x.goldKept).length;
  return (
    <StepLayout
      eyebrow="Real scores"
      title="Keep only what helps"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.scorer}
            options={SCORERS.map(([k, n]) => [k, n] as [RerankState["scorer"], string])}
            onChange={(v) => set({ scorer: v })}
          />
          <label className="flex items-center gap-3 text-xs">
            <span className="text-muted shrink-0">Keep passages scoring at least</span>
            <input
              type="range"
              min={0}
              max={0.95}
              step={0.05}
              value={s.threshold}
              onChange={(e) => set({ threshold: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Relevance threshold"
            />
            <span className="w-10 font-mono">{Math.round(s.threshold * 100)}%</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">
                Passages sent to the model (6 questions × top 10)
              </p>
              <p className="text-sm font-semibold">{totalKept} of 60</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                goldKept === 6 ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              <p className="text-muted text-[10px]">Questions whose right passage survived</p>
              <p className="text-sm font-semibold">{goldKept} of 6</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {summary.map((x, i) => (
              <button
                key={x.d.q}
                type="button"
                onClick={() => set({ q: i })}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2.5 py-1 text-left text-[11px]",
                  qi === i
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {x.goldKept ? (
                  <Check className="text-good size-3.5 shrink-0" />
                ) : (
                  <X className="text-bad size-3.5 shrink-0" />
                )}
                <span className="flex-1 truncate">{x.d.q}</span>
                <span className="text-muted font-mono">{x.kept.length} kept</span>
              </button>
            ))}
          </div>
          <ol className="flex flex-col gap-1">
            {cur.d[s.scorer].map((r) => {
              const keep = r.p >= s.threshold;
              return (
                <li
                  key={r.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2 py-0.5 text-[10px]",
                    cur.d.gold.includes(r.id) ? "border-good" : "border-line",
                    !keep && "opacity-35",
                  )}
                >
                  <span className="flex-1 truncate">{BY_ID[r.id].title}</span>
                  <span className="font-mono">{Math.round(r.p * 100)}%</span>
                  <span className={keep ? "text-good" : "text-muted"}>
                    {keep ? "kept" : "dropped"}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      }
    >
      <p>
        Rerankers also give a <Term id="relevance-threshold">relevance score</Term>. Drop everything
        below a threshold and the model gets less, better context. Research on RAG finds that
        near-misses, passages that look relevant but don&apos;t contain the answer, are what hurt
        answers most.
      </p>
      <p>
        Slide the threshold. At 50% most judges keep about one passage in ten. But look at the
        three-months question: the right rule says &ldquo;90 days&rdquo;, and every judge is unsure
        of it, so a high threshold drops the only answer.
      </p>
      <p className="text-muted text-sm">
        Scores from different judges aren&apos;t comparable, like embedding scores (the small
        cross-encoder&apos;s raw scores were converted to 0–1 here; Azure&apos;s run from 0 to 4).
        Choose the threshold by testing on labelled questions.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When nothing passes ---------------------------------------------------------------------- */

export function NothingPassed() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="When nothing passes"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="rerank-nothing"
            prompt="A citizen asks “Will my water be cut if I don't pay for three months?” Your filter drops every passage. What should the system do?"
            options={[
              {
                id: "answer",
                label: "Let the model answer from its own knowledge",
                feedback:
                  "That's how the invented schedules in module 2 happened. The filter exists to stop exactly this.",
              },
              {
                id: "unfiltered",
                label: "Quietly send the unfiltered top 10 instead",
                feedback:
                  "That throws the filter away whenever it matters most, and may hide a threshold that's simply set too high.",
              },
              {
                id: "fallback",
                label:
                  "Try again (rewrite the query or search more widely); if still nothing, say so and point to a human",
                correct: true,
                feedback:
                  "Yes. An empty result is a signal. Retry with a rewritten question (module 11), then admit “I couldn't find this” rather than guess. And check your threshold on labelled questions: here it was too strict.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Filtering creates a new decision: what to do when nothing is good enough.</p>
    </StepLayout>
  );
}

/* 5 ─ Rerankers to know ------------------------------------------------------------------------- */

export function Rerankers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rerankers to know"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {RERANKERS.map(([n, by, d], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="flex flex-wrap items-baseline gap-x-2 text-xs">
                <span className="font-semibold">{n}</span>
                <span className="text-muted text-[10px]">{by}</span>
              </p>
              <p className="text-muted text-[11px]">{d}</p>
            </motion.div>
          ))}
          <p className="text-muted text-[10px]">As of September 2026; check current docs.</p>
        </div>
      }
    >
      <p>
        Rerankers come as open models you host, as APIs, and built into search services. The usual
        pattern: retrieve a generous shortlist (roughly 50–150 passages), rerank, keep the best
        5–20.
      </p>
      <p>
        Cost and time grow with the number of candidates and their length, since every pair is a
        separate model run. That&apos;s the reason for the shortlist.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Retrieve wide, rerank narrow", "Fast search for a shortlist; a careful model to order it."],
  [
    "Cross-encoders read pairs",
    "Question and passage together: accurate, and too slow for everything.",
  ],
  ["Filter, carefully", "Fewer, better passages help, but a strict threshold can drop the answer."],
  ["Plan for empty results", "Retry or admit it; never let the model guess."],
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
        That completes the search chapter: keywords, vectors, indexes, fusion and reranking. Next,
        the questions themselves.
      </p>
    </StepLayout>
  );
}
