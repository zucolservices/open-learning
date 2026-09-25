"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, CircleSlash, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { HalState } from "./state";

const MODEL = `${data.model.replace("onnx-community/", "")} (4-bit)`;

/* 1 ─ Fluent isn't true ---------------------------------------------------------------------------- */

const NEXT_NOTES = [
  "A fact it knows: nearly all the probability sits on two spellings of the same right answer, Bengaluru and Bangalore.",
  "A fact it can't know (the company is invented for this course). No option stands out, yet every option is the start of a plausible name. Pick one, keep going, and you get a confident-sounding founder.",
];

export function FluentIsntTrue() {
  const [s, set] = useSceneState<HalState>();
  const n = data.next[s.next];
  return (
    <StepLayout
      eyebrow="Real probabilities"
      title="Fluent isn't the same as true"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={String(s.next)}
            options={[
              ["0", "Capital of Karnataka"],
              ["1", "Founder of Kirana Express"],
            ]}
            onChange={(v) => set({ next: Number(v) })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[11px]">{n.q}</p>
            <p className="mt-1 font-mono text-xs">
              {n.stem}
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="bg-accent ml-1 inline-block h-3.5 w-1.5 translate-y-0.5"
              />
            </p>
            <div className="mt-3 grid gap-1">
              {n.top.map(([t, p]) => (
                <div key={t as string} className="flex items-center gap-2 text-xs">
                  <span className="w-20 shrink-0 truncate text-right font-mono">
                    {JSON.stringify(t)}
                  </span>
                  <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
                    <motion.span
                      className="bg-accent absolute inset-y-0 left-0 rounded"
                      initial={{ width: 0 }}
                      animate={{ width: `${(p as number) * 100}%` }}
                      key={`${s.next}${t}`}
                      transition={{ duration: 0.5 }}
                    />
                  </span>
                  <span className="text-muted w-12 text-right font-mono">
                    {((p as number) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted mt-2 text-[11px]">
              Top 10 tokens cover{" "}
              {Math.round(n.top.reduce((a, [, p]) => a + (p as number), 0) * 100)}% of the
              probability.
            </p>
          </div>
          <FrameCaption frameKey={s.next} title={s.next ? "Guessing" : "Knowing"}>
            {NEXT_NOTES[s.next]}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Real next-token probabilities from {MODEL}, on a 0–100% scale.
          </p>
        </div>
      }
    >
      <p>
        Picture a quiz contestant who must always say <em>something</em>. When they know, they
        answer crisply. When they don&apos;t, they still produce a fluent answer that sounds right.
      </p>
      <p>
        A model is built the same way: it always predicts a next token. A{" "}
        <Term id="hallucination">hallucination</Term> is a fluent, confident answer that isn&apos;t
        true. Compare what the model&apos;s probabilities look like when it knows and when it
        doesn&apos;t.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Ask it five times ⭐ ---------------------------------------------------------------------------- */

const SAMPLE_Q: Record<string, { label: string; tags: [string, "ok" | "bad" | "none"][] }> = {
  anthem: {
    label: "Who wrote Jana Gana Mana?",
    tags: [
      ["Tagore, 1911", "ok"],
      ["Tagore; mistranslated title", "ok"],
      ["Two invented authors", "bad"],
      ["Tagore, but “1947”", "bad"],
      ["No author; wrong history", "bad"],
    ],
  },
  founder: {
    label: "Who founded Kirana Express?",
    tags: [
      ["Declines", "none"],
      ["Invents a founder, year and city", "bad"],
      ["Declines", "none"],
      ["Declines", "none"],
      ["Declines", "none"],
    ],
  },
  book: {
    label: "Third chapter of “Monsoon Ledgers”?",
    tags: [
      ["Odd refusal", "none"],
      ["Invents a title", "bad"],
      ["Odd refusal", "none"],
      ["Asks for details", "none"],
      ["Rambles", "none"],
    ],
  },
};

export function AskFiveTimes() {
  const [s, set] = useSceneState<HalState>();
  const q = SAMPLE_Q[s.sample];
  const answers = data.samples[s.sample as keyof typeof data.samples];
  return (
    <StepLayout
      eyebrow="Real samples"
      title="Ask it five times"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(SAMPLE_Q).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ sample: k })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  k === s.sample
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="grid gap-1.5">
            <AnimatePresence mode="popLayout">
              {answers.map((a, i) => {
                const [tag, tone] = q.tags[i];
                return (
                  <motion.div
                    key={`${s.sample}${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="border-line bg-surface rounded-xl border p-2.5 text-xs"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-muted text-[10px]">Sample {i + 1}</span>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px]",
                          tone === "ok"
                            ? "border-good/40 bg-good/10"
                            : tone === "bad"
                              ? "border-bad/40 bg-bad/10"
                              : "border-line",
                        )}
                      >
                        {tag}
                      </span>
                    </div>
                    <p>{a}</p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <p className="text-subtle text-[10px]">
            Five real samples from {MODEL} at temperature 1, cut at 40 tokens. Kirana Express and
            the novel are invented.
          </p>
        </div>
      }
    >
      <p>
        With <Term id="sampling">sampling</Term> on, the same question can get a different answer
        each time. That turns out to be useful.
      </p>
      <p>
        Where the model really knows something, the samples agree. Where it&apos;s guessing, they
        scatter: here, even the anthem&apos;s author wobbles in this small model, and one sample
        invents a founder, a year and a city.
      </p>
      <p className="text-muted text-sm">
        Checking whether several samples agree is a real detection technique (SelfCheckGPT, 2023).
        Disagreement is a warning sign; agreement isn&apos;t proof.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Diagnose and fix ⭐ ---------------------------------------------------------------------------- */

const MODES: Record<string, { label: string; prompt: string; note: string }> = {
  plain: {
    label: "Just ask",
    prompt: "The question on its own.",
    note: "Mostly declines what it can't know, but still slips invented details into answers.",
  },
  idk: {
    label: "Allow “I don't know”",
    prompt:
      "System: “Answer briefly. If you are not sure of the answer, say “I don't know” instead of guessing.”",
    note: "Abstains on every unknowable question, but gets two wrong, including one it answered correctly before. Instructions help, but measure them.",
  },
  grounded: {
    label: "Ground in sources",
    prompt:
      "System: “Answer briefly using only the sources provided, and cite them like [1]. If the sources don't contain the answer, say “The sources don't say.”” Plus one help-centre article.",
    note: "No wrong answers, and the company questions are answered with a citation. The trade-off: it now refuses everything outside the sources.",
  },
};

const KIND: Record<string, string> = {
  known: "Common knowledge",
  private: "Your company's data",
  unknowable: "Doesn't exist",
  obscure: "Too obscure",
  recent: "After the training data",
};

const VERDICT = {
  correct: { label: "Correct", Icon: Check, cls: "border-good/40 bg-good/10", icon: "text-good" },
  abstained: {
    label: "Declined",
    Icon: CircleSlash,
    cls: "border-line bg-surface-2",
    icon: "text-muted",
  },
  wrong: { label: "Wrong", Icon: X, cls: "border-bad/40 bg-bad/10", icon: "text-bad" },
} as const;

export function DiagnoseAndFix() {
  const [s, set] = useSceneState<HalState>();
  const answers = data.answers[s.mode as keyof typeof data.answers];
  const counts = { correct: 0, abstained: 0, wrong: 0 };
  answers.forEach((a) => counts[a.verdict as keyof typeof counts]++);
  const q = data.questions[s.q];
  const a = answers[s.q];
  const v = VERDICT[a.verdict as keyof typeof VERDICT];
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Diagnose and fix"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.mode}
            options={Object.entries(MODES).map(([k, m]) => [k, m.label])}
            onChange={(m) => set({ mode: m })}
          />
          <p className="text-muted text-[11px]">{MODES[s.mode].prompt}</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(VERDICT) as (keyof typeof VERDICT)[]).map((k) => {
              const V = VERDICT[k];
              return (
                <div key={k} className={cn("rounded-xl border px-3 py-2", V.cls)}>
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <V.Icon className={cn("size-3.5", V.icon)} /> {V.label}
                  </p>
                  <motion.p
                    key={`${s.mode}${k}`}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="font-mono text-lg"
                  >
                    {counts[k]}
                  </motion.p>
                </div>
              );
            })}
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="grid content-start gap-1">
              {data.questions.map((qq, i) => {
                const vv = VERDICT[answers[i].verdict as keyof typeof VERDICT];
                return (
                  <button
                    key={qq.id}
                    type="button"
                    onClick={() => set({ q: i })}
                    className={cn(
                      "flex w-full min-w-0 items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-xs",
                      i === s.q
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <vv.Icon className={cn("size-3.5 shrink-0", vv.icon)} aria-label={vv.label} />
                    <span className="min-w-0 truncate">{qq.q}</span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${s.mode}${s.q}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border-line bg-surface flex flex-col gap-2 rounded-xl border p-3 text-xs"
              >
                <p className="text-muted text-[10px] tracking-wide uppercase">{KIND[q.kind]}</p>
                <p className="font-semibold">{q.q}</p>
                <p className="bg-surface-2 rounded-lg p-2 font-mono text-[11px]">{a.text}</p>
                <p className={cn("rounded-lg border px-2 py-1", v.cls)}>
                  <v.Icon className={cn("mr-1 inline size-3.5 -translate-y-px", v.icon)} />
                  <span className="font-semibold">{v.label}.</span>
                  {a.note && <span className="text-muted"> {a.note}</span>}
                </p>
                <p className="text-muted text-[11px]">Truth: {q.truth}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <FrameCaption frameKey={s.mode} title={MODES[s.mode].label}>
            {MODES[s.mode].note}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Real answers from {MODEL}, greedy decoding; verdicts are ours.
          </p>
        </div>
      }
    >
      <p>
        Eight questions with different reasons to go wrong: common knowledge, your company&apos;s
        private data, a book that doesn&apos;t exist, an obscure statistic, and an event after the
        model&apos;s training data.
      </p>
      <p>Try the three fixes and compare how many answers are correct, declined or wrong.</p>
      <p className="text-muted text-sm">
        No single fix wins: each cause needs its own. Private data needs{" "}
        <Term id="grounding">grounding</Term> in your documents; recent events need a search tool;
        unknowables need permission to say &ldquo;I don&apos;t know&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Why models guess ------------------------------------------------------------------------------- */

const SIMPLEQA: [string, number, number, number][] = [
  ["gpt-5-thinking-mini", 22, 52, 26],
  ["o4-mini", 24, 1, 75],
];

export function WhyModelsGuess() {
  const [s, set] = useSceneState<HalState>();
  const p = s.conf / 100;
  const guess = p * 1 - (1 - p) * s.penalty;
  const best = guess > 0 ? "guess" : "abstain";
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why models guess"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface grid gap-3 rounded-xl border p-3 text-xs sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-muted">How sure is the model? {s.conf}%</span>
              <input
                type="range"
                min={5}
                max={95}
                step={5}
                value={s.conf}
                onChange={(e) => set({ conf: Number(e.target.value) })}
                aria-label="Model confidence"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-muted">
                Marks lost for a wrong answer: {s.penalty === 0 ? "none" : `−${s.penalty}`}
              </span>
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={s.penalty}
                onChange={(e) => set({ penalty: Number(e.target.value) })}
                aria-label="Penalty for a wrong answer"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["guess", "Guess", guess],
              ["abstain", "Say “I don't know”", 0],
            ].map(([k, l, v]) => (
              <motion.div
                key={k as string}
                animate={{ scale: best === k ? 1.02 : 1 }}
                className={cn(
                  "rounded-xl border px-3 py-2",
                  best === k ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[11px]">{l as string}: expected marks</p>
                <p className="font-mono text-lg">{(v as number).toFixed(2)}</p>
                {best === k && (
                  <p className="text-accent text-[11px] font-semibold">Best strategy</p>
                )}
              </motion.div>
            ))}
          </div>
          <div className="border-line bg-surface overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">SimpleQA (OpenAI, 2025)</th>
                  <th className="px-3 py-2 font-medium">Correct</th>
                  <th className="px-3 py-2 font-medium">Declined</th>
                  <th className="px-3 py-2 font-medium">Wrong</th>
                </tr>
              </thead>
              <tbody>
                {SIMPLEQA.map(([m, c, a, w]) => (
                  <tr key={m} className="border-line border-t">
                    <td className="px-3 py-2 font-mono">{m}</td>
                    <td className="px-3 py-2">{c}%</td>
                    <td className="px-3 py-2">{a}%</td>
                    <td className={cn("px-3 py-2", w > 50 && "text-bad font-semibold")}>{w}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-subtle text-[10px]">
            Kalai et al., &ldquo;Why language models hallucinate&rdquo; (OpenAI, Sep 2025; in
            Nature, 2026). Numbers from OpenAI&apos;s write-up of that paper.
          </p>
        </div>
      }
    >
      <p>
        Think of an exam that gives a mark for a right answer and nothing for a blank. Even at 10%
        confidence, guessing beats leaving it blank. Most AI benchmarks are graded like that.
      </p>
      <p>
        OpenAI researchers argue this is a root cause: training and leaderboards reward guessing, so
        models learn to bluff. Add a penalty for wrong answers and watch the best strategy flip.
      </p>
      <p className="text-muted text-sm">
        In the table, the older model scores about the same on accuracy but is wrong three times as
        often, because it almost never declines.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function MatchTheFix() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Match the fix to the cause"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="fixes"
            prompt="Your assistant gave each of these confident wrong answers. What's the best fix?"
            categories={[
              { id: "ground", label: "Ground in your documents" },
              { id: "search", label: "Give it a search tool" },
              { id: "abstain", label: "Allow “I don't know”" },
            ]}
            items={[
              {
                id: "policy",
                label: "Invents a return policy for your shop",
                category: "ground",
                why: "The real policy exists, in your documents. Put the relevant page in the context and ask for citations.",
              },
              {
                id: "price",
                label: "Quotes last year's price for a product",
                category: "ground",
                why: "Your catalogue has today's price: retrieve it rather than relying on what the model saw in training.",
              },
              {
                id: "news",
                label: "Says an election hasn't happened yet",
                category: "search",
                why: "The event is after its training data. Only fresh information from a search can fix that.",
              },
              {
                id: "citation",
                label: "Makes up a research paper when asked for a source on a niche topic",
                category: "abstain",
                why: "Better to say it can't find one (and reward that) than to invent a plausible reference. A search tool helps too.",
              },
              {
                id: "trivia",
                label: "Gives a confident birth year for an obscure local historian",
                category: "abstain",
                why: "Nothing to retrieve and no source likely to have it: the honest answer is “I don't know”.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Diagnose the cause first. The fix follows from it.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Likely, not true",
    "Models produce plausible text. When they don't know, a plausible guess still comes out.",
  ],
  [
    "Diagnose the cause",
    "Private data, fresh events, unknowables and small-model gaps each need a different fix.",
  ],
  [
    "Ground and cite",
    "Retrieved sources with citations turn “trust me” into “check here”, and still need checking.",
  ],
  [
    "Reward honesty",
    "Let the model decline, count wrong answers as worse than blanks, and measure both.",
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
      <p>That completes using models well.</p>
      <p>Next chapter: running models, starting with what actually happens during inference.</p>
    </StepLayout>
  );
}
