"use client";

import { motion } from "motion/react";
import { Check, Play, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { SchemeState } from "./state";

type Cell = { top: string[]; hit: boolean; a: number };
const CONFIGS = data.configs as Record<string, Record<string, Cell>>;
const TEXTS = data.texts as Record<string, string>;
const QS = data.questions;

const LABEL: Record<string, string> = {
  page: "Whole pages",
  section: "Sections",
  sentence: "Sentences",
  keyword: "Keyword",
  vector: "Vector",
  hybrid: "Hybrid",
  none: "No reranker",
  rerank: "Reranker",
  basic: "Basic prompt",
  strict: "Strict prompt",
};

const score = (key: string) =>
  Object.values(CONFIGS[key]).filter((c) => data.answers[c.a].ok).length;
const SORTED = Object.keys(CONFIGS).sort((a, b) => score(b) - score(a));
const textOf = (chunk: string, id: string) => TEXTS[`${chunk}:${id}`] ?? TEXTS[`other:${id}`] ?? id;

/* 1 ─ The brief --------------------------------------------------------------------------------- */

export function Brief() {
  const [s, set] = useSceneState<SchemeState>();
  const sc = data.schemes;
  return (
    <StepLayout
      eyebrow="Capstone"
      title="The brief"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={String(s.scheme)}
            options={sc.map((x, i) => [String(i), x.title] as [string, string])}
            onChange={(v) => set({ scheme: Number(v) })}
          />
          <motion.div
            key={s.scheme}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <p className="font-semibold">{sc[s.scheme].title}</p>
            <ol className="mt-1.5 flex flex-col gap-1 text-xs">
              {sc[s.scheme].sections.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </motion.div>
          <div className="border-line bg-surface-2 rounded-xl border px-3 py-2 text-xs">
            <p className="font-semibold">The test set: 8 questions</p>
            <ul className="mt-1 flex flex-col gap-0.5">
              {QS.map((q) => (
                <li key={q.id}>
                  <span className="text-muted">{q.lang}:</span> {q.q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    >
      <p>
        The corporation wants an assistant that answers residents&apos; questions about two schemes,
        in English and Hindi. Real assistants like this exist: India&apos;s myScheme portal lists
        over 5,000 government schemes and has a Hindi and English chatbot.
      </p>
      <p>
        Your documents: each scheme&apos;s page in English and in Hindi (made up, and the same facts
        in both), mixed in with the 32 passages from earlier modules. The water scheme conflicts
        with the normal rules on purpose: the usual deposit is ₹3,000, the scheme&apos;s is ₹500.
      </p>
      <p>
        The test set has English, Hindi and romanised Hindi questions, and one the documents
        can&apos;t answer. Next, you design the pipeline.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make your choices (branching) ------------------------------------------------------------- */

const CHOICES: {
  key: "chunk" | "search" | "rerank" | "prompt";
  title: string;
  mod: string;
  options: [string, string][];
}[] = [
  {
    key: "chunk",
    title: "How to chunk the scheme pages",
    mod: "Module 4",
    options: [
      ["page", "One chunk per page: everything together, but a long, blurred vector."],
      ["section", "One chunk per section, with the scheme's title in front."],
      ["sentence", "One chunk per sentence: sharp, but loses its context."],
    ],
  },
  {
    key: "search",
    title: "How to search",
    mod: "Modules 6–9",
    options: [
      ["keyword", "Keyword search (BM25): exact words, any script."],
      ["vector", "Vector search (multilingual e5): meaning, across languages."],
      ["hybrid", "Both, fused with RRF."],
    ],
  },
  {
    key: "rerank",
    title: "Rerank before answering?",
    mod: "Module 10",
    options: [
      ["none", "No: send the top 3 as they are."],
      ["rerank", "Yes: a multilingual reranker picks the best 3 of the top 10."],
    ],
  },
  {
    key: "prompt",
    title: "Which prompt",
    mod: "Module 13",
    options: [
      ["basic", "Basic: use the passages, answer in the question's language."],
      ["strict", "Strict: only the passages, say “I don't know”, cite, same language."],
    ],
  },
];

export function Design() {
  const [s, set] = useSceneState<SchemeState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Make your choices"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          {CHOICES.map((c) => (
            <div key={c.key}>
              <p className="mb-1 text-xs font-semibold">
                {c.title} <span className="text-muted font-normal">({c.mod})</span>
              </p>
              <div className="grid gap-1.5 sm:grid-cols-3">
                {c.options.map(([v, d]) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={s[c.key] === v}
                    onClick={() => set({ [c.key]: v, ran: false })}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-left text-[11px]",
                      s[c.key] === v
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <span className="block font-medium">{LABEL[v]}</span>
                    <span className="text-muted">{d}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Four decisions, each from an earlier module. There are 36 possible designs, and we ran every
        one of them for real: the same documents, the same test set, real retrieval and real answers
        from a small model (Phi-4-mini).
      </p>
      <p>Choose what you think works best, then run the test set.</p>
    </StepLayout>
  );
}

/* 3 ─ Run the test set ⭐ ------------------------------------------------------------------------ */

export function Results() {
  const [s, set] = useSceneState<SchemeState>();
  const ready = s.chunk && s.search && s.rerank && s.prompt;
  if (!ready)
    return (
      <StepLayout
        eyebrow="Simulation"
        title="Run the test set"
        stage={
          <p className="text-muted m-auto text-sm">Go back and make all four choices first.</p>
        }
      >
        <p>Your design isn&apos;t complete yet.</p>
      </StepLayout>
    );
  const key = `${s.chunk}|${s.search}|${s.rerank}|${s.prompt}`;
  const cfg = CONFIGS[key];
  const mine = score(key);
  const better = SORTED.filter((k) => score(k) > mine).length;
  const q = QS[s.q];
  const cell = cfg[q.id];
  const ans = data.answers[cell.a] as { text: string; ok: boolean; note?: string };
  return (
    <StepLayout
      eyebrow="Simulation · real output"
      title="Run the test set"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-muted text-[11px]">
            Your design: {LABEL[s.chunk]} · {LABEL[s.search]} · {LABEL[s.rerank]} ·{" "}
            {LABEL[s.prompt]}
          </p>
          {!s.ran ? (
            <button
              type="button"
              onClick={() => set({ ran: true })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-sm font-medium"
            >
              <Play className="size-4" /> Run the 8 questions
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-3"
            >
              <div className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="font-mono text-2xl font-semibold">
                  {mine}/8{" "}
                  <span className="text-muted text-sm font-normal">answered correctly</span>
                </p>
                <p className="text-muted text-[11px]">
                  {better === 0
                    ? "Joint best of the 36 designs."
                    : `${better} of the 36 designs scored higher.`}
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                {QS.map((x, i) => {
                  const c = cfg[x.id];
                  const ok = data.answers[c.a].ok;
                  return (
                    <button
                      key={x.id}
                      type="button"
                      aria-pressed={s.q === i}
                      onClick={() => set({ q: i })}
                      className={cn(
                        "flex items-center gap-2 rounded border px-2 py-1 text-left text-[11px]",
                        s.q === i
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-surface hover:bg-surface-2",
                      )}
                    >
                      {ok ? (
                        <Check className="text-good size-3.5 shrink-0" />
                      ) : (
                        <X className="text-bad size-3.5 shrink-0" />
                      )}
                      <span className="flex-1 truncate">{x.q}</span>
                      <span className="text-muted shrink-0 text-[10px]">
                        {x.id === "sewer" ? "no answer exists" : c.hit ? "found" : "not found"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div>
                <p className="text-muted mb-0.5 text-[11px]">
                  Passages sent to the model for “{q.q}”
                </p>
                {cell.top.length === 0 && (
                  <p className="border-bad/50 bg-bad/5 rounded border px-2 py-1 text-[11px]">
                    None: no passage shares a single word with this question, so keyword search
                    returned nothing.
                  </p>
                )}
                <ol className="flex flex-col gap-0.5">
                  {cell.top.map((id, i) => (
                    <li
                      key={id}
                      className="border-line bg-surface line-clamp-2 rounded border px-2 py-0.5 text-[10.5px]"
                    >
                      <span className="font-mono">{i + 1}</span> {textOf(s.chunk, id)}
                    </li>
                  ))}
                </ol>
              </div>
              <div
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  ans.ok ? "border-good/50 bg-good/10" : "border-bad bg-bad/10",
                )}
              >
                <p className="text-muted text-[10px] tracking-wide uppercase">
                  Phi-4-mini answered
                </p>
                <p className="line-clamp-6">{ans.text}</p>
                {ans.note && <p className="mt-1 font-medium">{ans.note}</p>}
              </div>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Run your design against the test set. For each question you see whether retrieval found the
        right section, what went into the prompt, and the real answer, graded by us.
      </p>
      <p>
        We graded by the facts each answer needs, then read all 139 different answers by hand.
        Answers in the wrong language, garbled or looping text, and answers that mixed up the two
        schemes count as wrong.
      </p>
      <p>Change a choice on the previous step and run again; every combination has real results.</p>
    </StepLayout>
  );
}

/* 4 ─ All 36 designs ⭐ -------------------------------------------------------------------------- */

const DIMS: [string, number, string[]][] = [
  ["Chunking", 0, ["section", "page", "sentence"]],
  ["Search", 1, ["hybrid", "vector", "keyword"]],
  ["Reranker", 2, ["rerank", "none"]],
  ["Prompt", 3, ["strict", "basic"]],
];

export function AllDesigns() {
  const [s] = useSceneState<SchemeState>();
  const mineKey = `${s.chunk}|${s.search}|${s.rerank}|${s.prompt}`;
  const avg = (dim: number, v: string) => {
    const ks = SORTED.filter((k) => k.split("|")[dim] === v);
    return ks.reduce((a, k) => a + score(k), 0) / ks.length;
  };
  return (
    <StepLayout
      eyebrow="Comparison · real output"
      title="All 36 designs"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-4">
            {DIMS.map(([name, i, vals]) => (
              <div key={name} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <p className="text-xs font-semibold">{name}</p>
                {vals.map((v) => (
                  <p key={v} className="flex justify-between text-[11px]">
                    <span>{LABEL[v]}</span>
                    <span className="font-mono">{avg(i, v).toFixed(1)}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
          <p className="text-muted -mt-1 text-[10px]">
            Average questions right (of 8) across all designs with that choice.
          </p>
          <div className="flex max-h-80 flex-col gap-0.5 overflow-y-auto">
            {SORTED.map((k) => {
              const v = score(k);
              return (
                <div
                  key={k}
                  className={cn(
                    "flex items-center gap-2 text-[10.5px]",
                    k === mineKey && "font-semibold",
                  )}
                >
                  <span className="w-60 shrink-0 truncate">
                    {k
                      .split("|")
                      .map((x) => LABEL[x])
                      .join(" · ")}
                    {k === mineKey && " ← yours"}
                  </span>
                  <div className="bg-surface-2 h-3 flex-1 overflow-hidden rounded-sm">
                    <div
                      className={cn("h-full", k === mineKey ? "bg-accent" : "bg-viz-data")}
                      style={{ width: `${(v / 8) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono">{v}</span>
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        Every design, ranked. Section chunks with hybrid search, a reranker and the strict prompt
        got all 8 right, and so did four other designs. Sentence chunks did worst: a sentence like
        &ldquo;Applications can be made until 31 March 2027&rdquo; doesn&apos;t say which scheme it
        belongs to (module 12).
      </p>
      <p>
        Keyword search alone struggled with romanised Hindi: &ldquo;cycle kab milegi&rdquo; shares
        no words with the Devanagari page. The strict prompt helped most often, but the small model
        sometimes answered in German, Spanish or French when told to &ldquo;answer in the same
        language as the question&rdquo;. A bigger model, or naming the allowed languages, would be
        the next thing to test.
      </p>
      <p>
        Differences of one question on an 8-question test are within noise (module 18). The clear
        lessons are the big gaps.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Ready to launch? -------------------------------------------------------------------------- */

export function Launch() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Ready to launch?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="launch-scheme"
            prompt="Your design gets 8 of 8 right. The department wants to launch next week. What do you say?"
            options={[
              {
                id: "launch",
                label: "Launch: it's perfect on the test set",
                feedback:
                  "Eight questions can't show that. One more question, or a new way of asking, could fail.",
              },
              {
                id: "grow",
                label:
                  "Collect real questions from residents and staff (in all the languages they use), grow the test set, check the answers by hand, and launch to a small group first with logging",
                correct: true,
                feedback:
                  "Yes. Real questions, a bigger test set and a careful first launch will find the failures that eight questions can't.",
              },
              {
                id: "model",
                label: "Swap in the biggest model available; then it will be fine",
                feedback:
                  "A bigger model may fix the language slips, but retrieval and chunking still decide what it sees. Measure first.",
              },
            ]}
          />
        </div>
      }
    >
      <p>A good score on a small test is where launching starts, not where it ends.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Every stage mattered", "Chunking, search, reranking and prompt each moved the score."],
  [
    "Test in every language",
    "Romanised Hindi broke keyword search; prompts caused language slips.",
  ],
  ["Measure, don't guess", "36 designs, one test set: the evidence picked the design."],
  ["Launch small, keep testing", "Grow the test set from real questions and keep logging."],
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
        You designed and measured a <Term id="rag">RAG</Term> system end to end. The last module
        turns it around: a system that gives wrong answers, and the traces you need to find out why.
      </p>
    </StepLayout>
  );
}
