"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import { METRICS, dcg, ndcgAt, precisionAt, recallAt, rrAt, type Labels } from "./metrics";
import type { EvalState } from "./state";

type Setup = EvalState["setup"];

const QS = data.questions;
const BY_ID = Object.fromEntries(data.passages.map((p) => [p.id, p]));
const SETUPS: [Setup, string][] = [
  ["keyword", "Keyword"],
  ["vector", "Vector"],
  ["hybrid", "Hybrid"],
  ["rerank", "Hybrid + reranker"],
];

const labelsFor = (s: EvalState, qi: number): Labels =>
  s.labels[qi] ?? (QS[qi].rel as unknown as Labels);

const GRADE_TONE = ["border-line bg-surface", "border-good/40 bg-good/5", "border-good bg-good/15"];
const GRADE_NAME = ["Not relevant", "Helps", "Answers it"];

function QuestionPicker({ value, onChange }: { value: number; onChange(i: number): void }) {
  return (
    <select
      aria-label="Question"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border-line bg-surface rounded-lg border px-2 py-1.5 text-sm"
    >
      {QS.map((q, i) => (
        <option key={q.q} value={i}>
          {i + 1}. {q.q}
        </option>
      ))}
    </select>
  );
}

const fmt = (v: number) => v.toFixed(2);

/* 1 ─ Write the exam first ---------------------------------------------------------------------- */

export function Exam() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Write the exam first"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "Without an exam",
              "“The new search feels better.” Tried on two questions you remembered, on a good day.",
            ],
            [
              "With an exam",
              "The same 12 questions, the same answer key, every time. The score goes up, down, or doesn't move.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                i ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A teacher who changes how they teach doesn&apos;t ask the class whether it felt better. They
        set the same exam and compare marks. Retrieval is the same: before changing chunking,
        embeddings or search, write the exam.
      </p>
      <p>
        The exam is a <Term id="golden-set">golden test set</Term>: real questions, each paired with
        the passages that truly answer it. Ours has 12 resident questions over the 32 Kalpanagar
        passages used since module 9.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build the answer key ⭐ (learner labels) --------------------------------------------------- */

export function AnswerKey() {
  const [s, set] = useSceneState<EvalState>();
  const rel = labelsFor(s, s.q);
  const edited = s.labels[s.q] !== undefined;
  // Show every passage any setup ranked in its top 6, plus any labelled one.
  const ids = [
    ...new Set([...Object.keys(rel), ...Object.values(QS[s.q].runs).flatMap((l) => l.slice(0, 6))]),
  ];
  const setGrade = (id: string) => {
    const next = { ...rel, [id]: ((rel[id] ?? 0) + 1) % 3 };
    if (!next[id]) delete next[id];
    set({ labels: { ...s.labels, [s.q]: next } });
  };
  return (
    <StepLayout
      eyebrow="Build · interactive"
      title="Build the answer key"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <QuestionPicker value={s.q} onChange={(i) => set({ q: i })} />
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-muted">Tap a passage to change its label:</span>
            {GRADE_NAME.map((g, i) => (
              <span key={g} className={cn("rounded border px-1.5 py-0.5", GRADE_TONE[i])}>
                {i} · {g}
              </span>
            ))}
            {edited && (
              <button
                type="button"
                onClick={() => {
                  const next = { ...s.labels };
                  delete next[s.q];
                  set({ labels: next });
                }}
                className="text-muted ml-auto flex items-center gap-1"
              >
                <RotateCcw className="size-3" /> Our labels
              </button>
            )}
          </div>
          <ul className="flex flex-col gap-1">
            {ids.map((id) => {
              const g = rel[id] ?? 0;
              const p = BY_ID[id];
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setGrade(id)}
                    aria-label={`${p.title}: ${GRADE_NAME[g]}`}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[11px]",
                      GRADE_TONE[g],
                    )}
                  >
                    <span className="w-4 shrink-0 font-mono font-semibold">{g}</span>
                    <span>
                      <span className="font-medium">{p.title}: </span>
                      {p.text}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      }
    >
      <p>
        For each question, someone who knows the rules marks which passages answer it. We used three
        grades: 2 answers it, 1 helps, 0 doesn&apos;t. These are our labels; tap to change any you
        disagree with, and every score in this module will follow.
      </p>
      <p>
        Some calls are hard. For the garbage fine, the September 2026 circular (₹500) answers it;
        the older ₹200 rules only help. Deciding that is the real work of a golden set, and why it
        needs someone who knows the subject.
      </p>
      <p>
        Label the answer, not the chunk number. If you re-chunk later, chunk ids change and the
        labels break; store the document and the sentence that answers the question instead.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Score one question ⭐ ---------------------------------------------------------------------- */

export function ScoreOne() {
  const [s, set] = useSceneState<EvalState>();
  const rel = labelsFor(s, s.q);
  const list = QS[s.q].runs[s.setup];
  const k = s.k;
  const top = list.slice(0, k);
  const nRel = Object.values(rel).filter((g) => g > 0).length;
  const found = top.filter((id) => (rel[id] ?? 0) > 0).length;
  const first = top.findIndex((id) => (rel[id] ?? 0) > 0);
  const gains = top.map((id) => rel[id] ?? 0);
  const ideal = Object.values(rel)
    .filter((g) => g > 0)
    .sort((a, b) => b - a)
    .slice(0, k);
  const rows: [string, string, string][] = [
    [
      "Recall@k",
      `${found} of ${nRel} relevant passages are in the top ${k}`,
      fmt(recallAt(list, rel, k)),
    ],
    [
      "Precision@k",
      `${found} of the ${k} returned passages are relevant`,
      fmt(precisionAt(list, rel, k)),
    ],
    [
      "Reciprocal rank",
      first < 0
        ? `no relevant passage in the top ${k}`
        : `first relevant passage at #${first + 1} → 1/${first + 1}`,
      fmt(rrAt(list, rel, k)),
    ],
    [
      "nDCG@k",
      `DCG ${fmt(dcg(gains))} ÷ best possible ${fmt(dcg(ideal))}`,
      fmt(ndcgAt(list, rel, k)),
    ],
  ];
  return (
    <StepLayout
      eyebrow="Simulation · real rankings"
      title="Score one question"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <QuestionPicker value={s.q} onChange={(i) => set({ q: i })} />
          <Segmented
            size="sm"
            value={s.setup}
            options={SETUPS}
            onChange={(v) => set({ setup: v })}
          />
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">k =</span>
            <input
              type="range"
              min={1}
              max={10}
              value={k}
              onChange={(e) => set({ k: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-5 font-mono">{k}</span>
          </label>
          <ol className="flex flex-col gap-0.5">
            {list.map((id, i) => {
              const g = rel[id] ?? 0;
              return (
                <li
                  key={id}
                  className={cn(
                    "flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px]",
                    GRADE_TONE[g],
                    i >= k && "opacity-35",
                  )}
                >
                  <span className="w-4 font-mono">{i + 1}</span>
                  <span className="w-3 font-mono font-semibold">{g || ""}</span>
                  <span className="truncate">{BY_ID[id].title}</span>
                  {i < k && (
                    <span className="text-muted ml-auto font-mono text-[10px]">
                      {g ? `${g}/log₂(${i + 2}) = ${fmt(g / Math.log2(i + 2))}` : ""}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <table className="w-full text-[11px]">
            <tbody>
              {rows.map(([n, how, v]) => (
                <tr key={n} className="border-line border-t">
                  <td className="py-1 pr-2 font-semibold">{n}</td>
                  <td className="text-muted py-1 pr-2">{how}</td>
                  <td className="py-1 text-right font-mono text-sm">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    >
      <p>
        The real top 10 from each setup, with your labels. Slide k to change how far down the list
        counts.
      </p>
      <p>
        <strong>Recall</strong>: did we find what exists? <strong>Precision</strong>: how much of
        what we returned is useful? With only two relevant passages, even a perfect list scores 0.2
        precision at k = 10. <strong>Reciprocal rank</strong>: how soon the first useful one
        appears; averaged over questions it&apos;s <Term id="mrr">MRR</Term>.
      </p>
      <p>
        <Term id="ndcg">nDCG</Term> gives more credit for better passages and for higher places,
        shrinking with a logarithm of the position, then divides by the perfect ordering, so 1.0
        means &ldquo;couldn&apos;t be better&rdquo;. (A second formula, with gain 2<sup>grade</sup>−
        1, is also common; with yes/no labels they agree.)
      </p>
    </StepLayout>
  );
}

/* 4 ─ Compare four setups ⭐ --------------------------------------------------------------------- */

export function CompareSetups() {
  const [s, set] = useSceneState<EvalState>();
  const k = s.k;
  const avg = (setup: Setup, f: (l: string[], r: Labels, k: number) => number) =>
    QS.reduce((a, q, i) => a + f(q.runs[setup], labelsFor(s, i), k), 0) / QS.length;
  const per = QS.map((q, i) => SETUPS.map(([setup]) => ndcgAt(q.runs[setup], labelsFor(s, i), k)));
  const differs = per.filter((r) => Math.max(...r) - Math.min(...r) > 0.001).length;
  return (
    <StepLayout
      eyebrow="Comparison · real rankings"
      title="Compare four setups"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">k =</span>
            <input
              type="range"
              min={1}
              max={10}
              value={k}
              onChange={(e) => set({ k: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-5 font-mono">{k}</span>
          </label>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-muted">
                  <th className="py-1 text-left font-normal">Average of 12</th>
                  {METRICS.map(([n]) => (
                    <th key={n} className="py-1 text-right font-normal">
                      {n}@{k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SETUPS.map(([setup, name]) => (
                  <tr key={setup} className="border-line border-t">
                    <td className="py-1 font-medium">{name}</td>
                    {METRICS.map(([n, f]) => (
                      <td key={n} className="py-1 text-right font-mono">
                        {fmt(avg(setup, f))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="text-muted mb-1 text-[11px]">
              nDCG@{k} per question: {differs} of 12 questions tell the setups apart
            </p>
            <div className="flex flex-col gap-0.5">
              {per.map((r, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-5 font-mono">{i + 1}</span>
                  <div className="grid flex-1 grid-cols-4 gap-0.5">
                    {r.map((v, j) => (
                      <div
                        key={j}
                        className="bg-surface-2 h-3 overflow-hidden rounded-sm"
                        title={`${SETUPS[j][1]}: ${fmt(v)}`}
                      >
                        <div className="bg-accent h-full" style={{ width: `${v * 100}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="text-muted flex gap-1.5 text-[10px]">
                <span className="w-5" />
                <div className="grid flex-1 grid-cols-4 gap-0.5">
                  {SETUPS.map(([, n]) => (
                    <span key={n} className="truncate">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <p>
        The same 12 questions, four real setups: keyword (BM25), vector (e5), hybrid (both, fused
        with RRF) and hybrid with a reranker (bge-reranker-v2-m3) reordering the top 10. Scores use
        your labels.
      </p>
      <p>
        Look at the numbers honestly. Hit rate is 1.0 for everyone, so it tells you nothing here.
        Keyword search trails clearly. The other three are close, and most questions score the same
        everywhere; only a handful decide the ranking. Those few are where to look, and where to add
        more questions like them.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Ways to fool yourself --------------------------------------------------------------------- */

const PITFALLS: [string, string][] = [
  [
    "Too few, too easy",
    "Thirty to fifty real questions catch a big regression. Telling close systems apart needs well over 50, often hundreds, and a paired significance test (a randomization test is a good default).",
  ],
  [
    "Synthetic questions",
    "A model asked to write a question from a chunk tends to reuse the chunk's words, which flatters keyword search. Mix in real questions from logs and staff.",
  ],
  [
    "Unlabelled isn't wrong",
    "Labels only cover what someone looked at. A new setup that finds a good passage nobody labelled gets no credit. In one study, filling in missing labels lifted a dense retriever from 0.654 to 0.735 nDCG@10.",
  ],
  [
    "Benchmarks aren't your data",
    "BEIR and MTEB report nDCG@10 on public collections. They're good for a shortlist. Your own questions decide.",
  ],
];

export function Pitfalls() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Ways to fool yourself"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {PITFALLS.map(([t, d], i) => (
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
        Tools compute these metrics for you: ranx, pytrec_eval and ir_measures in Python, and the
        evaluation features of Ragas, Arize Phoenix, LangSmith, Microsoft Foundry, Amazon Bedrock
        and Google&apos;s agent platform. The hard part isn&apos;t the arithmetic; it&apos;s a test
        set you can trust.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Ship it? ---------------------------------------------------------------------------------- */

export function ShipIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Ship it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="ship-hybrid"
            prompt="With our labels, adding the reranker lifts nDCG@10 from 0.928 (vector alone) to 0.951. The difference comes from three of the 12 questions; the reranker also adds a model call to every query. What do you do?"
            options={[
              {
                id: "ship",
                label: "Ship it: the score went up",
                feedback:
                  "Three questions is thin evidence. The gap could flip with the next few questions you add.",
              },
              {
                id: "more",
                label:
                  "Add more real questions like the ones that differed, run a paired significance test, and weigh the gain against the extra time",
                correct: true,
                feedback:
                  "Yes. Grow the test set where the systems disagree, test whether the difference is real, then decide whether it's worth the extra time and cost.",
              },
              {
                id: "hit",
                label: "Look at hit rate instead; it's simpler",
                feedback: "Hit rate is 1.0 for every setup here. It can't tell them apart at all.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Numbers from a small test set are a start, not a verdict.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Write the exam first",
    "Real questions, passages that answer them, graded by someone who knows.",
  ],
  [
    "Know what each metric asks",
    "Recall: found it? Precision: how much noise? MRR, nDCG: how high?",
  ],
  ["Look at the questions that differ", "Averages hide that most questions score the same."],
  ["Grow the set where it matters", "Then test whether a difference is real."],
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
        Good retrieval is only half of RAG. Next: judging the answers themselves, and whether a
        model can do the judging.
      </p>
    </StepLayout>
  );
}
