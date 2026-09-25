"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, Shuffle, Sparkles, Trophy } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CORPUS, pick, predict, train } from "./ngram";
import type { LlmState } from "./state";

const MODEL = train(CORPUS);

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/* 2 ─ Be the model ⭐ ---------------------------------------------------------------------------- */

export function BeTheModel() {
  const [s, set] = useSceneState<LlmState>();
  const { preds, used } = useMemo(() => predict(MODEL, s.words, s.context), [s.words, s.context]);
  const done = s.words[s.words.length - 1] === "." || s.words.length >= 24 || !preds.length;
  const add = (w: string | undefined, seed = s.seed) =>
    w && set({ words: [...s.words, w], seed: seed + 1 });
  const autoWrite = (mode: "top" | "sample") => {
    let words = [...s.words];
    let seed = s.seed;
    for (let i = 0; i < 16; i++) {
      const next = pick(predict(MODEL, words, s.context).preds, mode, rand(seed));
      seed += 1;
      if (!next) break;
      words = [...words, next];
      if (next === "." || words.length >= 24) break;
    }
    set({ words, seed });
  };
  const loops = s.words.join(" ").match(/(\b\w+ \w+ \w+\b).*\1/);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Be the model"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Looks back</span>
            <Segmented
              size="sm"
              value={String(s.context)}
              options={[
                ["1", "1 word"],
                ["2", "2 words"],
              ]}
              onChange={(v) => set({ context: Number(v) as 1 | 2, words: ["the"] })}
            />
          </div>
          <div className="border-line bg-surface min-h-20 rounded-xl border p-3">
            <p className="flex flex-wrap gap-1 font-mono text-sm">
              {s.words.map((w, i) => {
                const inContext = i >= s.words.length - s.context;
                return (
                  <motion.span
                    key={`${i}-${w}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "rounded px-1",
                      inContext && !done ? "bg-accent-soft ring-accent/50 ring-1" : "",
                    )}
                  >
                    {w}
                  </motion.span>
                );
              })}
              {!done && <span className="text-accent animate-pulse px-1">▍</span>}
            </p>
            {!done && (
              <p className="text-subtle mt-2 text-[10px]">
                Highlighted: the context the model can see (
                {used === "(start)" ? "start of text" : `“${used}”`})
              </p>
            )}
          </div>
          {!done ? (
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="text-muted mb-2 text-[10px]">
                Next-word probabilities. Click one to choose it.
              </p>
              <div className="grid gap-1">
                <AnimatePresence initial={false}>
                  {preds.slice(0, 7).map((p) => (
                    <motion.button
                      key={`${s.words.length}-${p.word}`}
                      type="button"
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => add(p.word)}
                      className="hover:bg-surface-2 flex items-center gap-2 rounded px-1 py-0.5 text-left text-xs"
                    >
                      <span className="w-20 shrink-0 truncate text-right font-mono">{p.word}</span>
                      <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
                        <motion.span
                          className="bg-accent absolute inset-y-0 left-0 rounded"
                          initial={{ width: 0 }}
                          animate={{ width: `${p.p * 100}%` }}
                        />
                      </span>
                      <span className="text-muted w-10 text-right font-mono">
                        {Math.round(p.p * 100)}%
                      </span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <p className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
              {s.words[s.words.length - 1] === "."
                ? "Finished: the model predicted a full stop."
                : "Stopped: the model had nothing it could predict next, or the sentence got too long."}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={done}
              onClick={() => add(preds[0]?.word)}
              className="bg-accent text-accent-fg inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              <Trophy className="size-3.5" /> Pick the favourite
            </button>
            <button
              type="button"
              disabled={done}
              onClick={() => add(pick(preds, "sample", rand(s.seed)))}
              className="border-line inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs disabled:opacity-40"
            >
              <Shuffle className="size-3.5" /> Roll the dice
            </button>
            <button
              type="button"
              disabled={done}
              onClick={() => autoWrite("top")}
              className="border-line inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs disabled:opacity-40"
            >
              <Sparkles className="size-3.5" /> Write the rest: favourites
            </button>
            <button
              type="button"
              disabled={done}
              onClick={() => autoWrite("sample")}
              className="border-line inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs disabled:opacity-40"
            >
              <Sparkles className="size-3.5" /> Write the rest: dice
            </button>
            <button
              type="button"
              onClick={() => set({ words: ["the"] })}
              className="text-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
            >
              <RotateCcw className="size-3.5" /> Start over
            </button>
          </div>
          {loops && s.context === 1 && (
            <p className="border-bad/40 bg-bad/10 rounded-xl border px-4 py-3 text-sm">
              It&apos;s going in circles. Seeing only one word back, it can&apos;t tell where it is
              in the sentence. Real LLMs look back over thousands of tokens.
            </p>
          )}
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">
              What this model read (its entire training data)
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto font-mono text-[10px] whitespace-pre-wrap">
              {CORPUS.trim()}
            </pre>
          </details>
        </div>
      }
    >
      <p>
        This is a real language model, just a tiny one. It has read 25 sentences about a café and
        counted which word follows which. Now it predicts.
      </p>
      <p>
        Build a sentence: choose words yourself, always take the favourite, or roll the dice. Then
        switch it to look back only one word and let it write with its favourites.
      </p>
      <p className="text-muted text-sm">
        An LLM does the same job with a neural network instead of counts, trained on trillions of
        tokens, looking back over a whole conversation.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: same question, different answer --------------------------------------------------- */

export function SameQuestion() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Same question, different answer"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="different-answers"
            prompt="You ask an assistant the same question twice and get two differently worded answers. What's the most likely reason?"
            options={[
              {
                id: "sample",
                label:
                  "At each step it samples from a probability distribution, so different words can be picked",
                correct: true,
                feedback:
                  "Right. Like 'Roll the dice' in the last step. With sampling turned off (always the favourite), answers repeat much more closely.",
              },
              {
                id: "learned",
                label: "It learned from your first question and improved",
                feedback:
                  "The model's weights don't change while you chat. Only the conversation text changes.",
              },
              {
                id: "search",
                label: "It searched the web differently each time",
                feedback:
                  "Some assistants can search, but a plain model varies even without any search.",
              },
              {
                id: "bug",
                label: "It's a bug",
                feedback: "It's by design: sampling makes text more natural and varied.",
              },
            ]}
            explanation="Sampling settings such as temperature control how adventurous the choice is. You'll tune them yourself in the sampling module."
          />
        </div>
      }
    >
      <p>You&apos;ve just seen the reason, with dice.</p>
    </StepLayout>
  );
}

/* 4 ─ A chat is a document ------------------------------------------------------------------------- */

const CHAT_FRAMES: {
  title: string;
  text: string;
  doc: string;
  highlight?: string;
  tone?: "good" | "bad";
}[] = [
  {
    title: "What you see",
    text: "A chat window: your message, then the assistant's reply. It looks like a conversation between two parties.",
    doc: "You: What's a good snack with masala chai?\n\nAssistant: …",
  },
  {
    title: "What the model sees",
    text: "Behind the scenes the whole conversation is flattened into one piece of text, with special markers for who said what. The instructions from the app developer come first.",
    doc: "<|system|>You are Brewline's helpful café assistant.<|end|>\n<|user|>What's a good snack with masala chai?<|end|>\n<|assistant|>",
    highlight: "<|assistant|>",
  },
  {
    title: "It continues the document",
    text: "The model's only job is to predict what comes next. After '<|assistant|>', the most likely continuation is… an assistant's reply. One token at a time.",
    doc: "<|system|>You are Brewline's helpful café assistant.<|end|>\n<|user|>What's a good snack with masala chai?<|end|>\n<|assistant|>Try warm samosas or buttery khari biscuits",
  },
  {
    title: "It knows when to stop",
    text: "Eventually the most likely next token is the end marker. The app stops generating and shows you the reply.",
    doc: "<|system|>You are Brewline's helpful café assistant.<|end|>\n<|user|>What's a good snack with masala chai?<|end|>\n<|assistant|>Try warm samosas or buttery khari biscuits: they're classic with chai.<|end|>",
    highlight: "<|end|>",
    tone: "good",
  },
  {
    title: "Your next message joins the document",
    text: "When you reply, your new message is added to the end and the whole document is sent again. The model has no memory between calls; the conversation text is its memory.",
    doc: "<|system|>…<|end|>\n<|user|>What's a good snack with masala chai?<|end|>\n<|assistant|>Try warm samosas or buttery khari biscuits: they're classic with chai.<|end|>\n<|user|>Anything without gluten?<|end|>\n<|assistant|>",
  },
];

export function ChatDocument() {
  const [s, set] = useSceneState<LlmState>();
  const step = Math.min(s.chatFrame, CHAT_FRAMES.length - 1);
  const f = CHAT_FRAMES[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="A chat is just a document"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Code>{f.doc}</Code>
            </motion.div>
          </AnimatePresence>
          <Stepper step={step} count={CHAT_FRAMES.length} onChange={(n) => set({ chatFrame: n })} />
          <FrameCaption frameKey={step} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        If a model only predicts the next piece of text, how does it hold a conversation? Step
        through what really happens when you chat.
      </p>
      <p className="text-muted text-sm">
        The markers here are simplified; each model family has its own format (a{" "}
        <Term id="chat-template">chat template</Term>). The idea is the same everywhere.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: not a database ------------------------------------------------------------------- */

export function NotADatabase() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where do its answers come from?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="not-a-database"
            prompt="An assistant confidently tells you the opening hours of a café that closed last year. What does that tell you about how it works?"
            options={[
              {
                id: "patterns",
                label:
                  "It generates likely text from patterns learned in training, not by looking facts up, so it can be out of date or simply wrong",
                correct: true,
                feedback:
                  "Right. Its knowledge is frozen at training time and stored as patterns in its weights, not as records it can check.",
              },
              {
                id: "db",
                label: "Its database hasn't been updated",
                feedback:
                  "There's no database of facts inside the model, only billions of numbers that encode patterns.",
              },
              {
                id: "lying",
                label: "It's lying on purpose",
                feedback: "It has no intent. It produced the most plausible-looking continuation.",
              },
              {
                id: "rare",
                label: "This can't happen with modern models",
                feedback:
                  "It still happens. Grounding answers in current sources (covered later) reduces it.",
              },
            ]}
            explanation="Keep this picture in mind for the whole track: fluent text comes first, truth is not guaranteed. Later modules cover grounding, retrieval and hallucinations."
          />
        </div>
      }
    >
      <p>Next-token prediction explains both the magic and the mistakes.</p>
    </StepLayout>
  );
}

/* 6 ─ How we got here --------------------------------------------------------------------------------- */

export const MILESTONES: { year: string; title: string; text: string }[] = [
  {
    year: "2017",
    title: "The transformer",
    text: "Google researchers publish “Attention Is All You Need”, the architecture every modern LLM builds on.",
  },
  {
    year: "2018",
    title: "GPT-1",
    text: "OpenAI shows that pretraining on lots of text, then fine-tuning, works across many tasks (about 117 million parameters).",
  },
  {
    year: "2019",
    title: "GPT-2",
    text: "1.5 billion parameters. Its fluent paragraphs were so convincing that OpenAI released it in stages through 2019.",
  },
  {
    year: "2020",
    title: "GPT-3",
    text: "175 billion parameters. It can do new tasks from a few examples in the prompt.",
  },
  {
    year: "2022",
    title: "ChatGPT",
    text: "An instruction-tuned, preference-trained model in a chat window reaches a million users within days.",
  },
  {
    year: "2023",
    title: "Open weights take off",
    text: "Meta's Llama and others publish model weights, so anyone can run capable models themselves.",
  },
  {
    year: "2024",
    title: "Reasoning models",
    text: "Models trained to think step by step before answering, spending more tokens for better answers on hard problems.",
  },
  {
    year: "Today",
    title: "Closed and open, side by side",
    text: "Frontier models from OpenAI, Anthropic and Google compete with open-weight models from DeepSeek, Qwen and Mistral; context windows reach a million tokens.",
  },
];

export function Timeline() {
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="How we got here"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ol className="relative grid gap-3 pl-6">
            <span className="bg-line absolute top-2 bottom-2 left-[7px] w-px" aria-hidden />
            {MILESTONES.map((m, i) => (
              <motion.li
                key={m.year + m.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="relative"
              >
                <span className="bg-accent border-bg absolute top-1 -left-6 size-3.5 rounded-full border-2" />
                <p className="text-sm">
                  <span className="text-accent font-mono font-semibold">{m.year}</span>{" "}
                  <span className="font-semibold">{m.title}</span>
                </p>
                <p className="text-muted text-xs">{m.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      }
    >
      <p>
        The core idea hasn&apos;t changed since 2018: predict the next token. What changed is scale,
        training data, and how models are tuned to be helpful.
      </p>
      <p className="text-muted text-sm">
        Every step up in size and data brought abilities nobody explicitly programmed.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Predict the next token",
    "That's the whole job; everything else emerges from doing it very well.",
  ],
  ["One token at a time", "Replies are built by a loop: predict, pick, append, repeat."],
  ["Probabilities, not certainties", "Sampling is why answers vary."],
  ["Context is everything", "More of the text visible means better predictions."],
  ["Patterns, not a database", "Fluent doesn't mean true."],
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
        You&apos;ve been saying &ldquo;word&rdquo;. Models actually see something slightly
        different.
      </p>
      <p>Next: tokens.</p>
    </StepLayout>
  );
}
