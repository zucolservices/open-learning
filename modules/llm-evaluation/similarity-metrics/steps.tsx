"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CANDIDATES, REFERENCE, bleu, rouge1, rougeL, words } from "./model";
import type { SimilarityState } from "./state";

/* 1 ─ Marking by matching words ------------------------------------------------------------------- */

export function SpotTheDifference() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Marking by matching words"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-sm">
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="text-muted text-[10px]">MODEL ANSWER</p>
            <p>The capital of Australia is Canberra.</p>
          </div>
          <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2">
            <p className="text-muted text-[10px]">STUDENT A · 5 of 6 words match</p>
            <p>The capital of Australia is Sydney.</p>
          </div>
          <div className="border-good bg-good/10 rounded-lg border px-3 py-2">
            <p className="text-muted text-[10px]">STUDENT B · 1 of 6 words match</p>
            <p>Canberra.</p>
          </div>
        </div>
      }
    >
      <p>
        Imagine a teacher who marks by counting how many words match the model answer. Student A
        copies the sentence but gets the city wrong, and scores high. Student B writes one correct
        word, and scores low.
      </p>
      <p>
        That teacher is a <Term id="similarity-metric">similarity metric</Term>. These metrics
        compare an answer with a <Term id="reference-answer">reference answer</Term>. They&apos;re
        cheap and automatic, and they measure resemblance, not correctness.
      </p>
    </StepLayout>
  );
}

/* 2 ─ When overlap lies ⭐ ------------------------------------------------------------------------ */

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-2 text-xs">
      <span className="text-muted">{label}</span>
      <div className="bg-surface-2 h-2.5 overflow-hidden rounded">
        <motion.div animate={{ width: `${Math.round(v * 100)}%` }} className="bg-viz-data h-full" />
      </div>
      <span className="text-right font-mono">{v.toFixed(2)}</span>
    </div>
  );
}

export function OverlapLies() {
  const [s, set] = useSceneState<SimilarityState>();
  const cand = CANDIDATES.find((c) => c.id === s.pick);
  const text = s.pick === "custom" ? s.custom : (cand?.text ?? "");
  const ref = new Set(words(REFERENCE));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="When overlap lies"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <span className="text-muted text-[10px]">REFERENCE </span>
            {REFERENCE}
          </p>
          <div className="flex flex-col gap-1">
            {CANDIDATES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={s.pick === c.id}
                onClick={() => set({ pick: c.id })}
                className={cn(
                  "flex items-baseline justify-between gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.pick === c.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span>{c.text}</span>
                <span className={cn("shrink-0 text-[10px]", c.correct ? "text-good" : "text-bad")}>
                  {c.verdict}
                </span>
              </button>
            ))}
            <input
              value={s.custom}
              onFocus={() => set({ pick: "custom" })}
              onChange={(e) => set({ custom: e.target.value, pick: "custom" })}
              placeholder="…or type your own answer"
              aria-label="Your own answer"
              className={cn(
                "bg-surface rounded-lg border px-3 py-1.5 text-xs",
                s.pick === "custom" ? "border-accent" : "border-line",
              )}
            />
          </div>
          {text && (
            <p className="text-xs leading-relaxed">
              {text.split(/(\s+)/).map((w, i) => (
                <span
                  key={i}
                  className={cn(ref.has(words(w)[0] ?? "") && "bg-viz-data/25 rounded")}
                >
                  {w}
                </span>
              ))}
            </p>
          )}
          <div className="border-line bg-surface flex flex-col gap-1.5 rounded-lg border px-3 py-2">
            <Bar label="BLEU (1–2 words)" v={bleu(text, REFERENCE)} />
            <Bar label="ROUGE-1 recall" v={rouge1(text, REFERENCE)} />
            <Bar label="ROUGE-L recall" v={rougeL(text, REFERENCE)} />
            {cand && s.pick !== "custom" && <Bar label="Embedding cosine" v={cand.emb} />}
          </div>
          <p className="text-subtle text-[10px]">
            BLEU and ROUGE computed live (BLEU simplified to 1- and 2-word sequences). Embedding
            scores are illustrative.
          </p>
        </div>
      }
    >
      <p>
        Here are five answers to compare with the reference. Two are right; three are wrong in ways
        that matter. Click each and watch the scores, or type your own answer.
      </p>
      <p>
        <Term id="bleu">BLEU</Term> (2002, from translation) counts shared word sequences;{" "}
        <Term id="rouge">ROUGE</Term> (2004, from summarisation) counts how much of the reference
        appears. The wrong number and the opposite meaning score highest; the correct paraphrase
        scores lowest.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Comparing meanings instead ------------------------------------------------------------------ */

export function Meaning() {
  const pts: [string, number, number, boolean, boolean][] = [
    ["reference", 170, 70, true, false],
    ["30 days", 196, 50, false, false],
    ["drops condition", 142, 50, false, true],
    ["not accepted", 148, 94, false, true],
    ["paraphrase", 124, 114, true, true],
    ["more detail", 214, 122, true, true],
    ["about delivery times", 40, 24, false, false],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Comparing meanings instead"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <svg viewBox="0 0 260 140" className="mx-auto w-full max-w-md">
            <circle
              cx={170}
              cy={70}
              r={42}
              className="fill-viz-data/10 stroke-viz-data"
              strokeDasharray="3 3"
            />
            {pts.map(([l, x, y, ok, left]) => (
              <g key={l}>
                <circle
                  cx={x}
                  cy={y}
                  r={4}
                  className={l === "reference" ? "fill-accent" : ok ? "fill-good" : "fill-bad"}
                />
                <text
                  x={left ? x - 6 : x + 6}
                  y={y + 3}
                  textAnchor={left ? "end" : "start"}
                  className="fill-muted font-mono text-[7px]"
                >
                  {l}
                </text>
              </g>
            ))}
          </svg>
          <p className="text-muted text-center text-[11px]">
            A sketch of answers placed by meaning. Close to the reference means similar, not
            correct. Illustrative.
          </p>
        </div>
      }
    >
      <p>
        Newer metrics compare meanings using <Term id="embedding">embeddings</Term>. BERTScore
        (2020) matches each word with its most similar word in the other text, so paraphrases get
        credit. Embedding <Term id="cosine-similarity">cosine similarity</Term> compares whole
        answers.
      </p>
      <p>
        They fix the paraphrase problem but not the deeper one. &ldquo;Within 30 days&rdquo; and
        &ldquo;not accepted&rdquo; are about exactly the same topic, so they sit right next to the
        reference. Similarity is not correctness.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What the evidence says ---------------------------------------------------------------------- */

export function Evidence() {
  const items: [string, string][] = [
    [
      "Dialogue, 2016",
      "Liu and colleagues found word-overlap metrics correlated weakly or not at all with human judgements of chatbot replies.",
    ],
    [
      "A review of BLEU, 2018",
      "Ehud Reiter reviewed 284 correlations and concluded BLEU is only suitable for diagnosing translation systems as a whole, not individual outputs.",
    ],
    [
      "Code, 2021",
      "The Codex paper showed wrong code can get a higher BLEU score than correct code.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the evidence says"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <span className="font-semibold">Still useful for: </span>
            cheap trend lines across a whole system, spotting answers that drift far from the
            reference, and translation research. Not for deciding whether one answer is right.
          </div>
        </div>
      }
    >
      <p>
        Researchers have tested these metrics against human judgement for years, and the results are
        humbling for open-ended answers.
      </p>
      <p>
        For free-form answers you need a grader that understands meaning and checks facts. The next
        module covers the most common one: another language model acting as judge.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Would similarity catch it? ------------------------------------------------------------------ */

export function WouldItCatch() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Would similarity catch it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="would-it-catch"
            prompt="Would a similarity metric flag each problem with an answer?"
            categories={[
              { id: "yes", label: "Likely flagged" },
              { id: "no", label: "Likely missed" },
            ]}
            items={[
              {
                id: "number",
                label: "One wrong number in an otherwise identical sentence",
                category: "no",
                why: "Nearly all words still match.",
              },
              {
                id: "topic",
                label: "An answer about a completely different topic",
                category: "yes",
                why: "Few shared words or meanings.",
              },
              {
                id: "negation",
                label: "A missing “not” that flips the meaning",
                category: "no",
                why: "One word out of many.",
              },
              { id: "empty", label: "An empty answer", category: "yes", why: "Nothing overlaps." },
              {
                id: "para",
                label: "A correct answer in different words (wrongly flagged?)",
                category: "yes",
                why: "Overlap metrics often flag correct paraphrases: a false alarm.",
              },
            ]}
            explanation="Similarity catches answers that are far off, and misses small changes that flip the meaning. It can also flag correct paraphrases."
          />
        </div>
      }
    >
      <p>Sort the problems.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Overlap metrics count words", "BLEU, ROUGE: cheap, automatic."],
  ["Meaning metrics use embeddings", "BERTScore, cosine similarity."],
  ["Similar isn't correct", "Small changes flip meaning unnoticed."],
  ["Paraphrases lose points", "Especially with word overlap."],
  ["Use for trends, not verdicts", "Pair with checks that understand facts."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: using a language model as the judge.</p>
    </StepLayout>
  );
}
