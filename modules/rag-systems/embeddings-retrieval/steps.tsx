"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CORPUS } from "../_shared/corpus";
import data from "./data.json";
import { LANGS, MODELS, QUERIES } from "./queries";
import { CHOICES } from "./choices";
import type { EmbState } from "./state";

type ModelId = (typeof MODELS)[number]["id"];
const results = data.results as Record<
  ModelId,
  { rank: number; top: { id: string; score: number }[]; targetScore: number }[][]
>;

const PASSAGES = Object.fromEntries(
  CORPUS.flatMap((d) => d.paras.map((t, i) => [`${d.id}-${i + 1}`, { title: d.title, text: t }])),
);

function rankTone(rank: number) {
  if (rank === 1) return "bg-good/25 text-good";
  if (rank <= 3) return "bg-viz-compute/25 text-fg";
  return "bg-bad/20 text-bad";
}

/* 1 ─ Meaning, not words -------------------------------------------------------------------------- */

const NEAR = [
  { text: "When will they pick up my rubbish?", x: 22, y: 30 },
  { text: "मेरा कूड़ा कब ले जाएंगे?", x: 70, y: 22 },
  { text: "Which days is dry waste collected?", x: 30, y: 72 },
];

export function MeaningNotWords() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Meaning, not words"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface relative mx-auto aspect-[4/3] w-full max-w-md rounded-xl border">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-accent-soft border-accent absolute top-1/2 left-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-dashed p-3 text-center text-[10px]"
            >
              “Wet waste daily… dry waste Wednesdays and Saturdays”
            </motion.div>
            {NEAR.map((n, i) => (
              <motion.span
                key={n.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + 0.2 * i }}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                className="bg-surface-2 border-line absolute max-w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-md border px-2 py-1 text-[10px]"
              >
                {n.text}
              </motion.span>
            ))}
          </div>
          <p className="text-muted text-center text-xs">
            Three ways of asking the same thing; only one shares words with the passage. A good
            embedding model places all three close to it.
          </p>
        </div>
      }
    >
      <p>
        Keyword search failed on &ldquo;rubbish&rdquo; and on Hindi because it only compares words.
        A librarian who understands the question doesn&apos;t care whether you say rubbish, garbage
        or कूड़ा.
      </p>
      <p>
        <Term id="dense-retrieval">Dense retrieval</Term> gives search that understanding. An{" "}
        <Term id="embedding">embedding</Term> model turns the question and every passage into
        vectors, and retrieval finds the passages whose vectors point the same way. Whether it works
        across languages depends entirely on the model.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three ways to ask ⭐ (sandbox, real results) ----------------------------------------------- */

export function LanguageLab() {
  const [s, set] = useSceneState<EmbState>();
  const model = (MODELS.find((m) => m.id === s.model) ?? MODELS[0]).id;
  const qi = Math.min(s.q, QUERIES.length - 1);
  const li = Math.min(s.lang, 2);
  const r = results[model][qi][li];
  const target = QUERIES[qi].target;
  return (
    <StepLayout
      eyebrow="Sandbox · real results"
      title="Three ways to ask"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            {QUERIES.map((q, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={qi === i}
                onClick={() => set({ q: i })}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-left text-xs",
                  qi === i
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {q.forms[0]}
              </button>
            ))}
          </div>
          <Segmented
            size="sm"
            value={String(li)}
            options={LANGS.map((l, i) => [String(i), l] as [string, string])}
            onChange={(v) => set({ lang: Number(v) })}
          />
          <p className="bg-surface-2 rounded-lg px-3 py-2 text-sm">{QUERIES[qi].forms[li]}</p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {MODELS.map((m) => {
              const rr = results[m.id][qi][li];
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={model === m.id}
                  onClick={() => set({ model: m.id })}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left",
                    model === m.id
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-md font-mono text-xs font-semibold",
                      rankTone(rr.rank),
                    )}
                  >
                    #{rr.rank}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium">{m.name}</span>
                    <span className="text-muted block text-[10px]">{m.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="border-line bg-surface rounded-lg border p-2">
            <p className="text-muted mb-1 text-[10px] tracking-wide uppercase">
              {MODELS.find((m) => m.id === model)!.name}: top 3 of 15 passages
            </p>
            <ol className="flex flex-col gap-1">
              {r.top.map((t, i) => (
                <li
                  key={t.id}
                  className={cn(
                    "flex gap-2 rounded-md px-1.5 py-1 text-[11px]",
                    t.id === target ? "bg-good/15" : "",
                  )}
                >
                  <span className="font-mono">{i + 1}</span>
                  <span className="flex-1">
                    <span className="font-medium">{PASSAGES[t.id].title}: </span>
                    <span className="text-muted">{PASSAGES[t.id].text}</span>
                  </span>
                  <span className="font-mono">{t.score.toFixed(3)}</span>
                </li>
              ))}
            </ol>
            {r.rank > 3 && (
              <p className="text-bad mt-1 text-[11px]">
                The right passage came {r.rank}th of 15: it wouldn&apos;t reach the model.
              </p>
            )}
          </div>
          <div>
            <p className="text-muted mb-1 text-[10px] tracking-wide uppercase">
              Rank of the right passage, every question and language
            </p>
            <div className="grid grid-cols-[auto_repeat(3,1fr)] gap-1 text-center text-[10px]">
              <span />
              {LANGS.map((l) => (
                <span key={l} className="text-muted">
                  {l}
                </span>
              ))}
              {QUERIES.map((q, i) => (
                <div key={i} className="contents">
                  <span className="text-muted pr-1 text-right">Q{i + 1}</span>
                  {[0, 1, 2].map((j) => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => set({ q: i, lang: j })}
                      className={cn(
                        "rounded py-0.5 font-mono",
                        rankTone(results[model][i][j].rank),
                        qi === i && li === j && "ring-accent ring-2",
                      )}
                    >
                      {results[model][i][j].rank}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Citizens of Kalpanagar ask in English, in Hindi, and in Hindi typed with English letters.
        The 15 help passages are in English. Pick a question and a language, then compare four real
        embedding models.
      </p>
      <p>
        Green: the right passage came first. Amber: in the top 3. Red: lower, so it probably
        won&apos;t reach the model at all.
      </p>
      <p className="text-muted text-sm">
        Look at the Hindi column for the English-only model, then for the multilingual ones. And
        notice that <Term id="romanised-hindi">romanised Hindi</Term> (&ldquo;sukha kachra&rdquo;)
        is hard for every model here.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Scores are relative ------------------------------------------------------------------------- */

export function ScoresAreRelative() {
  const rows = MODELS.map((m) => {
    const all = results[m.id].flat();
    const tops = all.map((x) => x.top[0].score);
    const thirds = all.map((x) => x.top[2].score);
    return { m, lo: Math.min(...thirds), hi: Math.max(...tops) };
  });
  const x = (v: number) => `${Math.max(0, Math.min(1, v)) * 100}%`;
  return (
    <StepLayout
      eyebrow="Real data"
      title="Scores are relative"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[11px]">
            Range of the top-3 similarity scores across all twelve questions, per model (0 to 1)
          </p>
          {rows.map(({ m, lo, hi }) => (
            <div key={m.id} className="flex flex-col gap-1">
              <span className="text-xs font-medium">{m.name}</span>
              <div className="bg-surface-2 relative h-4 rounded">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-accent absolute inset-y-0 rounded"
                  style={{ left: x(lo), width: `calc(${x(hi)} - ${x(lo)})` }}
                />
              </div>
              <span className="text-muted font-mono text-[10px]">
                {lo.toFixed(2)} – {hi.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Similarity scores are not percentages or probabilities. Each model has its own habits: one
        spreads scores widely, another squeezes everything between about 0.75 and 0.9.
      </p>
      <p>
        So a rule like &ldquo;only use passages scoring above 0.8&rdquo; means something completely
        different for each model, and changes when you switch. Compare scores within a model, for
        ranking. Set any cut-off by testing on real questions.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Choosing a model ------------------------------------------------------------------------- */

export function ChooseModel() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing a model"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CHOICES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="flex flex-wrap items-baseline gap-x-2 text-xs">
                <span className="font-semibold">{c.name}</span>
                <span className="text-muted text-[10px]">{c.by}</span>
              </p>
              <p className="text-muted text-[11px]">{c.note}</p>
            </motion.div>
          ))}
          <p className="text-muted text-[10px]">
            Details as of September 2026; check current docs before choosing.
          </p>
        </div>
      }
    >
      <p>
        Four questions decide most choices: which languages must it handle, how long are your
        passages, where may your data go (an API or your own servers), and what does it cost at your
        volume?
      </p>
      <p>
        Public leaderboards such as <Term id="mteb">MTEB</Term> help you shortlist. They can&apos;t
        tell you how a model handles your documents and your users&apos; way of asking, so the final
        test is always your own.
      </p>
      <p className="text-muted text-sm">
        Some models, trained with <Term id="matryoshka">Matryoshka</Term> learning, let you keep
        only the first part of each vector to save storage. One rule never changes: embed questions
        and passages with the same model. Vectors from different models aren&apos;t comparable, so
        switching models means re-embedding everything.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What would you do? ------------------------------------------------------------------------ */

export function TestFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What would you do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="emb-test"
            prompt="Kalpanagar's citizens mostly type Hindi in English letters (“sukha kachra kab uthega?”). The help pages are in English. What's the best first step in choosing an embedding model?"
            options={[
              {
                id: "top",
                label: "Pick the model at the top of the English leaderboard",
                feedback:
                  "The leaderboard doesn't test romanised Hindi against English civic pages. Your own test does.",
              },
              {
                id: "test",
                label:
                  "Collect real citizen questions, label the right passages, and test several candidates on them",
                correct: true,
                feedback:
                  "Yes. Thirty real questions tell you more than any leaderboard. Include romanised Hindi and consider rewriting queries into English or Devanagari before search (module 11).",
              },
              {
                id: "biggest",
                label: "Use the biggest model available; bigger is always better",
                feedback:
                  "Size helps on average, but costs more and may still struggle with romanised Hindi. Measure.",
              },
              {
                id: "keywords",
                label: "Skip embeddings and rely on keyword search",
                feedback: "Keywords can't match Hindi to English at all; module 6 showed that.",
              },
            ]}
          />
        </div>
      }
    >
      <p>A decision you&apos;ll face on any Indian deployment.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Search by meaning", "Embeddings match paraphrases and, with the right model, other languages."],
  [
    "Models differ a lot",
    "An English-only model can't find English passages from Hindi questions.",
  ],
  ["Scores are model-specific", "Rank with them; don't treat them as probabilities."],
  ["Test on your own questions", "Especially languages, scripts and domain terms."],
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
        Embeddings fix keyword search&apos;s blindness to meaning, but they can miss exact terms
        such as form numbers. Module 9 combines the two.
      </p>
      <p>Next: how a vector index finds nearest neighbours among millions of vectors, fast.</p>
    </StepLayout>
  );
}
