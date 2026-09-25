"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  LANGS,
  LATENCY_TARGET,
  MODELS,
  QUALITY_TARGET,
  QUESTIONS,
  replayQuestion,
  runDay,
  type Design,
} from "./model";
import data from "./data.json";
import type { ChooseState } from "./state";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 1 ─ The brief ----------------------------------------------------------------------------------- */

export function Brief() {
  return (
    <StepLayout
      eyebrow="Capstone"
      title="The brief"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
            <p className="font-semibold">From: the state e-governance department</p>
            <p className="text-muted mt-2">
              We want <strong>Nagarika Sahaya</strong>, an assistant that answers citizens&apos;
              questions about our 400 services (certificates, pensions, ration cards) around the
              clock. Expect about <strong>40,000 questions a day</strong>: 60% in Kannada, 25% in
              English, 15% in Hindi, busiest between 10 and noon. Answers must be correct in every
              language, start appearing within 2 seconds, and citizens&apos; data should stay in
              India. Rules change often. And please don&apos;t spend a fortune.
            </p>
          </div>
          <PredictCheckpoint
            id="kannada-tokens"
            prompt="A short helpdesk answer is 40 tokens in English on Llama 3.2's tokenizer. The same answer in Kannada is about the same length in characters. How many tokens is it?"
            min={0}
            max={500}
            step={10}
            answer={322}
            tolerance={60}
            unit=" tokens"
            explanation="322 tokens: eight times English. Kannada is rare in most tokenizers' training text, so it's split into tiny pieces. You pay for, wait for and fit every one of them. The next step measures four tokenizers."
          />
        </div>
      }
    >
      <p>
        A helpdesk with a language mix like this is the whole track in one design: tokens, context,
        hosting, cost and latency all pull against each other.
      </p>
      <p>Start with the fact that surprises most teams.</p>
    </StepLayout>
  );
}

/* 2 ─ Same answer, three languages (real tokenizers) ----------------------------------------------- */

const LANG_LABEL = { en: "English", hi: "Hindi", kn: "Kannada" } as const;

export function ThreeLanguages() {
  const ids = Object.keys(data.tok) as (keyof typeof data.tok)[];
  const max = Math.max(...ids.map((id) => data.tok[id].kn));
  return (
    <StepLayout
      eyebrow="Real tokenizers"
      title="Same answer, three languages"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface grid gap-1.5 rounded-xl border p-3 text-xs">
            {(["en", "hi", "kn"] as const).map((l) => (
              <p key={l}>
                <span className="text-muted mr-1.5 text-[10px] uppercase">{LANG_LABEL[l]}</span>
                {data.texts[l]}
              </p>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[11px]">Tokens for the same answer</p>
            <div className="grid gap-3">
              {ids.map((id) => {
                const [label, vocab] = data.labels[id];
                return (
                  <div key={id}>
                    <p className="mb-1 text-xs font-medium">
                      {label}{" "}
                      <span className="text-muted font-normal">({vocab}-token vocabulary)</span>
                    </p>
                    {(["en", "hi", "kn"] as const).map((l) => {
                      const n = data.tok[id][l];
                      return (
                        <div
                          key={l}
                          className="grid grid-cols-[4rem_1fr_5.5rem] items-center gap-2"
                        >
                          <span className="text-muted text-[11px]">{LANG_LABEL[l]}</span>
                          <div className="bg-surface-2 h-2.5 overflow-hidden rounded">
                            <motion.div
                              className={cn("h-full", l === "kn" ? "bg-accent" : "bg-accent/45")}
                              initial={{ width: 0 }}
                              animate={{ width: `${(n / max) * 100}%` }}
                            />
                          </div>
                          <span className="text-right font-mono text-[11px]">
                            {n}{" "}
                            <span className="text-muted">
                              ({(n / data.tok[id].en).toFixed(1)}×)
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Measured with the real tokenizers (Transformers.js). Closed models don&apos;t all
            publish theirs; measure with the provider&apos;s token-counting tool before you budget.
          </p>
        </div>
      }
    >
      <p>
        The same ration-card answer, counted by four real <Term id="tokenizer">tokenizers</Term>.
        English costs about 40 tokens on all of them. Kannada costs anything from under 2× to over
        12×.
      </p>
      <p>
        For this helpdesk that multiplier lands on 60% of the traffic. It raises the bill, slows
        answers, fills the <Term id="context-window">context window</Term> faster and, on your own
        GPUs, eats capacity.
      </p>
      <p className="text-muted text-sm">
        Two ways out: choose a model whose tokenizer handles Indian languages well, or{" "}
        <Term id="pivot-translation">translate through English</Term>: translate the question,
        answer in English, and translate the answer back.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Make your design ⭐ -------------------------------------------------------------------------- */

type Key = "model" | "context" | "lang" | "host" | "answer";

const DECISIONS: { key: Key; q: string; opts: [string, string, string][] }[] = [
  {
    key: "model",
    q: "1. Which model?",
    opts: (["large", "mid", "small"] as const).map((id) => [id, MODELS[id].label, MODELS[id].hint]),
  },
  {
    key: "context",
    q: "2. How does it know the 400 services?",
    opts: [
      [
        "rag",
        "Retrieve the 3 most relevant pages",
        "Search the service pages for each question and put the best three in the prompt (~2,000 tokens).",
      ],
      [
        "stuff",
        "Put all 400 pages in every prompt",
        "About 300,000 tokens of English per question. Nothing to build.",
      ],
      [
        "finetune",
        "Fine-tune the model on the pages",
        "Train the knowledge in once; prompts stay short.",
      ],
    ],
  },
  {
    key: "lang",
    q: "3. How does it handle Kannada and Hindi?",
    opts: [
      [
        "native",
        "Answer directly in the user's language",
        "One step, full nuance; token cost depends on the tokenizer.",
      ],
      [
        "pivot",
        "Translate to English, answer, translate back",
        "A dedicated translation model (such as AI4Bharat's IndicTrans2, or the government's Bhashini platform) around an English-only prompt.",
      ],
    ],
  },
  {
    key: "host",
    q: "4. Where does it run?",
    opts: [
      [
        "api",
        "The provider's global API",
        "Pay per token. Simplest; data may be processed abroad.",
      ],
      [
        "india",
        "A cloud platform's Indian region",
        "Pay per token, a little more; data stays in India (Bedrock, Microsoft Foundry, Gemini Enterprise Agent Platform…).",
      ],
      [
        "own",
        "Your own GPUs in the state data centre",
        "Open models only. A fixed cost per GPU-hour, busy or idle.",
      ],
    ],
  },
  {
    key: "answer",
    q: "5. How are answers delivered?",
    opts: [
      [
        "stream",
        "Stream, and keep answers short",
        "Words appear as they're generated; about 300 tokens (English) per answer.",
      ],
      [
        "full",
        "Show the full answer when it's done",
        "Longer, complete answers (about 600 tokens) that appear all at once.",
      ],
    ],
  },
];

export function Decide() {
  const [s, set] = useSceneState<ChooseState>();
  return (
    <StepLayout
      eyebrow="Branching decisions"
      title="Make your design"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          {DECISIONS.map((d) => (
            <div key={d.key}>
              <p className="mb-1 text-xs font-semibold">{d.q}</p>
              <div
                className={cn(
                  "grid gap-1.5",
                  d.opts.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
                )}
              >
                {d.opts.map(([id, label, hint]) => {
                  const disabled = d.key === "host" && id === "own" && !MODELS[s.model].open;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={disabled}
                      aria-pressed={s[d.key] === id}
                      onClick={() =>
                        set({
                          [d.key]: id,
                          replayed: false,
                          ...(d.key === "model" && id === "large" && s.host === "own"
                            ? { host: "india" }
                            : {}),
                        })
                      }
                      className={cn(
                        "rounded-xl border px-2.5 py-2 text-left disabled:opacity-40",
                        s[d.key] === id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      <span className="block text-xs font-medium">{label}</span>
                      <span className="text-muted mt-0.5 block text-[10px] leading-snug">
                        {hint}
                      </span>
                    </button>
                  );
                })}
              </div>
              {d.key === "host" && s.host === "own" && (
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-muted">GPUs:</span>
                  {[1, 2, 4, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={s.gpus === n}
                      onClick={() => set({ gpus: n, replayed: false })}
                      className={cn(
                        "rounded-full border px-2.5 py-0.5",
                        s.gpus === n ? "border-accent bg-accent-soft" : "border-line",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="text-muted">at about $2.50 per GPU-hour</span>
                </div>
              )}
            </div>
          ))}
          <p className="text-muted text-xs">
            Your choices carry into the replay on the next step. The large model&apos;s weights
            aren&apos;t available, so it can&apos;t run on your own GPUs.
          </p>
        </div>
      }
    >
      <p>
        Five decisions, each from an earlier module: model choice, <Term id="rag">retrieval</Term>{" "}
        versus stuffing the context, tokenizers, hosting and <Term id="streaming">streaming</Term>.
      </p>
      <p className="text-muted text-sm">
        The starting design is what a hurried team might ship. Change what you think is wrong.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Replay a day ⭐ ------------------------------------------------------------------------------ */

function DayChart({ day }: { day: ReturnType<typeof runDay> }) {
  const W = 360;
  const H = 130;
  const maxQ = Math.max(...day.hours.map((h) => h.questions));
  const bw = (W - 30) / 24;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Questions per hour and whether answers started within 2 seconds"
    >
      {day.hours.map((h) => {
        const bh = (h.questions / maxQ) * (H - 30);
        const late = h.firstWords > LATENCY_TARGET || h.dropped > 0 || day.fitShare < 1;
        return (
          <motion.rect
            key={h.h}
            x={24 + h.h * bw + 1}
            width={bw - 2}
            initial={{ height: 0, y: H - 16 }}
            animate={{ height: bh, y: H - 16 - bh }}
            transition={{ delay: h.h * 0.02 }}
            fill={late ? "var(--bad)" : "var(--good)"}
            opacity={0.55}
          />
        );
      })}
      {[0, 6, 12, 18, 23].map((h) => (
        <text
          key={h}
          x={24 + h * bw + bw / 2}
          y={H - 4}
          textAnchor="middle"
          className="fill-subtle text-[8px]"
        >
          {String(h).padStart(2, "0")}:00
        </text>
      ))}
      <text x={20} y={16} textAnchor="end" className="fill-subtle text-[7px]">
        {Math.round(maxQ).toLocaleString("en-IN")}
      </text>
    </svg>
  );
}

export function Replay() {
  const [s, set] = useSceneState<ChooseState>();
  const design: Design = {
    model: s.model,
    context: s.context,
    lang: s.lang,
    host: s.model === "large" && s.host === "own" ? "india" : s.host,
    answer: s.answer,
    gpus: s.gpus,
  };
  const day = useMemo(
    () => runDay(design),
    [design.model, design.context, design.lang, design.host, design.answer, design.gpus], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const qualityOk = LANGS.every(([l]) => day.lang[l].quality >= QUALITY_TARGET);
  const fastOk = day.peakFirstWords <= LATENCY_TARGET && day.droppedShare === 0 && day.fitShare > 0;
  const allOk = qualityOk && fastOk && day.inIndia && !day.stale;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Replay a day of questions"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-muted text-xs">
            Your design:{" "}
            {DECISIONS.map((d) => d.opts.find((o) => o[0] === design[d.key])?.[1]).join(" · ")}
            {design.host === "own" ? ` · ${design.gpus} GPU${design.gpus > 1 ? "s" : ""}` : ""}
          </p>
          {!s.replayed ? (
            <button
              type="button"
              onClick={() => set({ replayed: true })}
              className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
            >
              Replay 00:00 → 23:59
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-3"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Stat label="Cost per month" value={usd(day.monthly)} />
                <Stat
                  label="First words, busiest hour"
                  value={day.fitShare === 0 ? "—" : `${day.peakFirstWords.toFixed(1)} s`}
                  bad={!fastOk}
                />
                <Stat
                  label="Questions failed or timed out"
                  value={`${Math.round((1 - day.fitShare + day.droppedShare) * 100)}%`}
                  bad={day.fitShare < 1 || day.droppedShare > 0}
                />
                <Stat
                  label="Data stays in India"
                  value={day.inIndia ? "yes" : "no"}
                  bad={!day.inIndia}
                />
              </div>
              <div className="border-line bg-surface grid gap-3 rounded-xl border p-3 sm:grid-cols-[1fr_12rem]">
                <div>
                  <DayChart day={day} />
                  <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="bg-good/55 size-2.5" /> questions per hour, on time
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="bg-bad/55 size-2.5" /> slow or failing
                    </span>
                  </div>
                </div>
                <div className="grid content-start gap-1.5">
                  <p className="text-muted text-[10px]">
                    Correct answers (target {QUALITY_TARGET * 100}%)
                  </p>
                  {LANGS.map(([l, name]) => {
                    const q = day.lang[l].quality;
                    return (
                      <div
                        key={l}
                        className="grid grid-cols-[4rem_1fr_2.5rem] items-center gap-1.5"
                      >
                        <span className="text-[11px]">{name}</span>
                        <div className="bg-surface-2 relative h-2.5 overflow-hidden rounded">
                          <motion.div
                            className={cn("h-full", q >= QUALITY_TARGET ? "bg-good" : "bg-bad")}
                            animate={{ width: `${q * 100}%` }}
                          />
                          <span
                            className="bg-fg absolute inset-y-0 w-px"
                            style={{ left: `${QUALITY_TARGET * 100}%` }}
                          />
                        </div>
                        <span className="text-right font-mono text-[11px]">
                          {Math.round(q * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {QUESTIONS.map((q, i) => {
                  const r = replayQuestion(design, day, q);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs",
                        r.ok ? "border-good/40 bg-good/5" : "border-bad/40 bg-bad/5",
                      )}
                    >
                      <p className="text-muted text-[10px]">
                        {String(q.time).padStart(2, "0")}:{i % 2 ? "40" : "15"} ·{" "}
                        {LANGS.find(([l]) => l === q.lang)![1]}
                      </p>
                      <p className="mt-0.5">{q.text}</p>
                      {q.gloss && <p className="text-muted text-[10px]">{q.gloss}</p>}
                      <p className="mt-1 flex items-start gap-1">
                        {r.ok ? (
                          <Check className="text-good mt-0.5 size-3 shrink-0" />
                        ) : (
                          <X className="text-bad mt-0.5 size-3 shrink-0" />
                        )}
                        {r.why}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  allOk ? "border-good/40 bg-good/10" : "border-line bg-surface",
                )}
              >
                <p className="font-semibold">
                  {allOk
                    ? day.monthly < 3000
                      ? "Every target met, for under $3,000 a month."
                      : "Every target met. Can you do it for less?"
                    : "Not there yet."}
                </p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs">
                  {day.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
              <p className="text-muted text-xs">
                Go back, change your design and replay. There are several good answers; one meets
                every target for under $3,000 a month.
              </p>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Here comes a day: 40,000 questions, busiest mid-morning. Watch cost, speed and correctness
        in each language, then six real questions from the day.
      </p>
      <p className="text-muted text-sm">
        Illustrative model: prices follow real September 2026 tiers, the language multipliers are
        the ones you just measured, and quality and GPU speeds are round, plausible figures.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ---------------------------------------------------------------------------------- */

export function NewRule() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A rule changes tomorrow"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="new-rule"
            prompt="The pension department moves its application deadline, effective tomorrow. What's the quickest way to make the helpdesk give the new date?"
            options={[
              {
                id: "rag",
                label:
                  "Update the service page; retrieval puts the new page in the prompt from the next question on",
                correct: true,
                feedback:
                  "Yes. With retrieval, knowledge lives in documents you control. Change the document and the answers change, with the source to show for it.",
              },
              {
                id: "finetune",
                label: "Fine-tune the model again on the new pages",
                feedback:
                  "Days of work and testing per change, and the old date may still surface. Fine-tuning is for style and skills, not fast-changing facts.",
              },
              {
                id: "prompt",
                label: "Add “the deadline is now 30 November” to the system prompt",
                feedback:
                  "Works for one fact, but a system prompt full of patches soon becomes a buried, contradictory mess. That's the next capstone's problem.",
              },
              {
                id: "bigger",
                label: "Switch to a larger model that knows more",
                feedback:
                  "No model knows about a rule announced yesterday. It has to be given the fact.",
              },
            ]}
            explanation="Keep facts in documents, fetch them per question, and show the source. Models bring language skill; your pages bring the truth."
          />
        </div>
      }
    >
      <p>Government rules change constantly. Your design has to keep up without a rebuild.</p>
    </StepLayout>
  );
}

/* 6 ─ Debrief -------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Measure tokens per language",
    "Kannada can cost 2× or 8× English depending on the tokenizer. It changes every other number.",
  ],
  [
    "Retrieve, don't stuff or fine-tune facts",
    "A few relevant pages per question: cheap, fast, current and citable.",
  ],
  [
    "Right-size the model",
    "A mid-size model with translation can match a large one on a narrow job, for a fraction of the cost.",
  ],
  [
    "Hosting is a data decision",
    "Indian regions or your own GPUs keep data here; own GPUs must be sized for the busiest hour.",
  ],
  ["Stream and keep it short", "First words fast matter more than a long, complete essay."],
];

export function Debrief() {
  return (
    <StepLayout
      eyebrow="Debrief"
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
        Before launch you&apos;d also run the checks from the last module: a bias test across
        languages, a clear notice, and a route to a human officer.
      </p>
      <p>
        The final capstone: the helpdesk&apos;s cousin is misbehaving in production. Find out why.
      </p>
    </StepLayout>
  );
}
