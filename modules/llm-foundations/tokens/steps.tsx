"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { learnBpe } from "./bpe";
import { toChips, useTokenizer, type Encoding } from "./use-tokenizer";
import type { TokensState } from "./state";

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

/* 1 ─ Tokenizer playground ⭐ ---------------------------------------------------------------------- */

const PRESETS: [string, string][] = [
  ["English", "I would like a cup of masala chai, please."],
  ["हिन्दी", "मुझे एक कप मसाला चाय चाहिए।"],
  ["ಕನ್ನಡ", "ನನಗೆ ಒಂದು ಕಪ್ ಮಸಾಲಾ ಚಹಾ ಬೇಕು."],
  ["Code", "for (let i = 0; i < orders.length; i++) total += orders[i].price;"],
  ["Numbers", "Order 4,815,162,342 costs ₹1,499.00"],
  ["Emoji", "Chai time ☕🍪✨"],
  ["strawberry", "How many r's are in strawberry?"],
];

const ENCODINGS: [Encoding, string, string][] = [
  ["r50k_base", "GPT-2 (2019)", "50,257 tokens"],
  ["cl100k_base", "GPT-4 (2023)", "~100,000 tokens"],
  ["o200k_base", "GPT-4o and later", "~200,000 tokens"],
];

const HUES = [
  "bg-viz-data/25",
  "bg-viz-compute/25",
  "bg-viz-meta/25",
  "bg-good/20",
  "bg-accent/20",
];

export function Playground() {
  const [s, set] = useSceneState<TokensState>();
  const tok = useTokenizer(s.encoding);
  const ids = useMemo(() => (tok ? tok.encode(s.text) : []), [tok, s.text]);
  const chips = useMemo(() => (tok ? toChips(ids, tok.decode) : []), [tok, ids]);
  const words = s.text.trim() ? s.text.trim().split(/\s+/).length : 0;
  const chars = [...s.text].length;
  const split = chips.filter((c) => c.ids.length > 1).length;
  return (
    <StepLayout
      eyebrow="Sandbox"
      title="See what the model sees"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(([label, text]) => (
              <button
                key={label}
                type="button"
                onClick={() => set({ text })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.text === text
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={s.text}
            onChange={(e) => set({ text: e.target.value })}
            rows={3}
            aria-label="Text to tokenize"
            className="border-line bg-surface focus:border-accent w-full resize-none rounded-xl border p-3 text-sm outline-none"
          />
          <div className="grid gap-1.5 sm:grid-cols-3">
            {ENCODINGS.map(([id, label, size]) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ encoding: id })}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-left",
                  s.encoding === id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                <span className="block text-xs font-medium">{label}</span>
                <span className="text-muted block text-[10px]">
                  {id} · {size}
                </span>
              </button>
            ))}
          </div>
          <div className="border-line bg-surface min-h-24 rounded-xl border p-3">
            {!tok ? (
              <p className="text-muted animate-pulse text-xs">Loading the tokenizer…</p>
            ) : (
              <div className="flex flex-wrap gap-y-1.5">
                {chips.map((c, i) => (
                  <span
                    key={`${i}-${c.ids.join(".")}`}
                    title={`token ID${c.ids.length > 1 ? "s" : ""}: ${c.ids.join(", ")}`}
                    className={cn(
                      "relative rounded px-0.5 font-mono text-sm whitespace-pre",
                      HUES[i % HUES.length],
                      c.ids.length > 1 && "ring-bad/60 ring-1",
                    )}
                  >
                    {c.text}
                    {c.ids.length > 1 && (
                      <sup className="text-bad ml-0.5 text-[8px] font-semibold">
                        ×{c.ids.length}
                      </sup>
                    )}
                  </span>
                ))}
              </div>
            )}
            {tok && (
              <p className="text-muted mt-3 truncate font-mono text-[10px]">
                IDs: [{ids.slice(0, 24).join(", ")}
                {ids.length > 24 ? ", …" : ""}]
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Characters" value={String(chars)} />
            <Stat label="Words" value={String(words)} />
            <Stat label="Tokens" value={tok ? String(ids.length) : "…"} />
            <Stat
              label="Characters per token"
              value={tok && ids.length ? (chars / ids.length).toFixed(1) : "…"}
              bad={tok ? chars / Math.max(1, ids.length) < 2 : false}
            />
          </div>
          {split > 0 && (
            <p className="text-muted text-xs">
              <span className="text-bad font-semibold">×n</span> marks a single character that
              needed several tokens: the tokenizer fell back to raw bytes because it has no piece
              for it.
            </p>
          )}
        </div>
      }
    >
      <p>
        A child learning to read starts with letters, then recognises common chunks like
        &ldquo;-ing&rdquo; and &ldquo;the&rdquo; at a glance. Models do something similar: they read
        text as <Term id="token">tokens</Term>, chunks from a fixed vocabulary.
      </p>
      <p>
        Type anything, or try the presets. These are real <Term id="tokenizer">tokenizers</Term>{" "}
        used by OpenAI models, running in your browser. Compare the three generations, especially on
        Hindi and Kannada.
      </p>
      <p className="text-muted text-sm">
        Hover a token to see its ID. The model never sees letters, only these numbers.
      </p>
    </StepLayout>
  );
}

/* 2 ─ How the pieces are chosen ⭐ ------------------------------------------------------------------ */

const STEPS = learnBpe(8);

export function LearnBpe() {
  const [s, set] = useSceneState<TokensState>();
  const step = Math.min(s.bpeStep, STEPS.length - 1);
  const st = STEPS[step];
  const prev = step > 0 ? STEPS[step - 1].merged : null;
  const joined = prev ? prev[0] + prev[1] : null;
  return (
    <StepLayout
      eyebrow="Step through"
      title="How the pieces are chosen"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[10px]">
              Training text (word × how often it appears); _ marks the end of a word
            </p>
            <div className="grid gap-1.5">
              {st.words.map((w) => (
                <div key={w.parts.join("")} className="flex items-center gap-2">
                  <span className="text-muted w-8 text-right font-mono text-[10px]">
                    ×{w.count}
                  </span>
                  <div className="flex flex-wrap gap-0.5">
                    {w.parts.map((p, i) => (
                      <motion.span
                        key={`${step}-${i}-${p}`}
                        layout
                        initial={p === joined ? { scale: 1.3, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "rounded border px-1.5 py-0.5 font-mono text-xs",
                          p === joined
                            ? "border-accent bg-accent-soft"
                            : "border-line bg-surface-2",
                        )}
                      >
                        {p}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="text-muted mb-1.5 text-[10px]">Most common neighbouring pairs</p>
              {st.pairs.map((p, i) => (
                <p
                  key={p.pair.join("+")}
                  className={cn(
                    "font-mono text-xs",
                    i === 0 && st.merged && "text-accent font-semibold",
                  )}
                >
                  {p.pair[0]} + {p.pair[1]} → {p.count}
                </p>
              ))}
            </div>
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="text-muted mb-1.5 text-[10px]">Vocabulary: {st.vocab.length} pieces</p>
              <div className="flex flex-wrap gap-0.5">
                {st.vocab.map((v) => (
                  <span
                    key={v}
                    className={cn(
                      "rounded px-1 font-mono text-[10px]",
                      v.length > 1 ? "bg-accent-soft" : "bg-surface-2",
                    )}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Stepper step={step} count={STEPS.length} onChange={(n) => set({ bpeStep: n })} />
          <FrameCaption
            frameKey={step}
            title={step === 0 ? "Start with single characters" : `Merge ${step}: “${joined}”`}
          >
            {step === 0
              ? "Every word is split into characters. Now count every pair of neighbours across the whole text, weighted by how often each word appears."
              : step === STEPS.length - 1
                ? "After just 8 merges, frequent words like 'newest' are a single piece, while rarer ones stay in parts. Real tokenizers repeat this tens of thousands of times over enormous text."
                : `The most frequent pair was merged into a new piece, “${joined}”, and added to the vocabulary. Count again, merge again.`}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Where does the vocabulary come from? Most tokenizers learn it with{" "}
        <Term id="bpe">byte-pair encoding</Term>: start from characters and keep gluing together the
        most frequent neighbouring pair.
      </p>
      <p>Step through a real run on a tiny text.</p>
      <p className="text-muted text-sm">
        That&apos;s why common words become one token while rare words, names and less-represented
        languages break into many.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Predict ------------------------------------------------------------------------------------- */

export function PredictRatio() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="Words to tokens"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="words-to-tokens"
            prompt="A 1,000-word English document goes to a model with a modern tokenizer. Roughly how many tokens is it?"
            min={200}
            max={3000}
            step={50}
            unit=" tokens"
            answer={1300}
            tolerance={200}
            explanation="The usual rule of thumb for English is about ¾ of a word per token (roughly 4 characters), so 1,000 words ≈ 1,300 tokens. Code, numbers and other languages can need many more."
          />
        </div>
      }
    >
      <p>
        Prices and limits are in tokens, but people think in words. A rough conversion is worth
        knowing.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The language tax ⭐ ---------------------------------------------------------------------------- */

// Tokens needed for the same meaning, relative to English, on the FLORES-200 translated sentences.
// cl100k values match Petrov et al. (NeurIPS 2023); o200k measured the same way (Sept 2026).
const LANGS: [string, number, number][] = [
  ["English", 1, 1],
  ["Hindi", 4.77, 1.57],
  ["Bengali", 5.83, 1.7],
  ["Tamil", 7.64, 1.98],
  ["Telugu", 8.29, 1.93],
  ["Kannada", 8.86, 1.97],
];

export function LanguageTax() {
  const [s, set] = useSceneState<TokensState>();
  const col = s.langEnc === "cl100k" ? 1 : 2;
  const max = 9;
  return (
    <StepLayout
      eyebrow="Explore"
      title="The same sentence, a different price"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.langEnc}
            options={[
              ["cl100k", "GPT-4's tokenizer (2023)"],
              ["o200k", "GPT-4o's tokenizer (2024)"],
            ]}
            onChange={(v) => set({ langEnc: v as TokensState["langEnc"] })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[10px]">
              Tokens for the same meaning, relative to English
            </p>
            <div className="grid gap-2">
              {LANGS.map((l) => {
                const v = l[col] as number;
                return (
                  <div key={l[0]} className="flex items-center gap-2 text-xs">
                    <span className="w-16 shrink-0">{l[0]}</span>
                    <span className="bg-surface-2 relative h-4 flex-1 overflow-hidden rounded">
                      <motion.span
                        className={cn(
                          "absolute inset-y-0 left-0 rounded",
                          v > 3 ? "bg-bad/60" : v > 1.2 ? "bg-viz-compute/60" : "bg-good/60",
                        )}
                        initial={false}
                        animate={{ width: `${(v / max) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </span>
                    <span className="w-12 text-right font-mono">{v.toFixed(1)}×</span>
                  </div>
                );
              })}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.langEnc}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                s.langEnc === "cl100k" ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
              )}
            >
              {s.langEnc === "cl100k"
                ? "A Kannada helpdesk paid almost 9 times as much as an English one for the same answers, used up its context window 9 times faster, and waited longer for replies."
                : "A larger vocabulary with more Indian-language pieces cut the gap to about 1.6–2×. Better, but not equal: check the tokenizer when you price a multilingual product."}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Because vocabularies are learned from mostly English text, other languages get fewer
        ready-made pieces and break into more tokens. More tokens means higher cost, slower replies
        and less room in the context window.
      </p>
      <p>Compare two generations of the same company&apos;s tokenizer on translated sentences.</p>
      <p className="text-muted text-sm">
        Measured on the FLORES-200 benchmark&apos;s translated sentences. The GPT-4 numbers match
        Petrov et al. (NeurIPS 2023), who found gaps of up to 15× across languages. Other
        vendors&apos; tokenizers differ: measure yours.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: strawberry ---------------------------------------------------------------------- */

export function Strawberry() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The strawberry problem"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="strawberry"
            prompt="Models have famously miscounted the r's in 'strawberry'. Based on this module, why is letter counting hard for them?"
            options={[
              {
                id: "tokens",
                label:
                  "They see tokens like 'st' 'raw' 'berry' (as ID numbers), not individual letters, so spelling isn't directly visible",
                correct: true,
                feedback:
                  "Right. The letters are hidden inside token IDs. Models can learn spellings, but it's indirect, which is why such tasks trip them up.",
              },
              {
                id: "maths",
                label: "They can't do any arithmetic",
                feedback:
                  "They often can, especially with reasoning. The issue here is that the letters aren't what they see.",
              },
              {
                id: "rare",
                label: "'strawberry' is too rare a word",
                feedback:
                  "It's common: it's a single token or a few in most tokenizers. That's exactly the problem.",
              },
              {
                id: "case",
                label: "They ignore upper and lower case",
                feedback: "Case is preserved in tokens. The issue is the chunking.",
              },
            ]}
            explanation="Tokenization explains a family of quirks: spelling, rhyming, counting characters, reversing words and some arithmetic on long numbers."
          />
        </div>
      }
    >
      <p>Try &ldquo;strawberry&rdquo; in the playground first if you haven&apos;t.</p>
    </StepLayout>
  );
}

/* 6 ─ Vocabularies you'll meet -------------------------------------------------------------------- */

const VOCABS: [string, string, string][] = [
  ["GPT-2 (2019)", "50,257", "byte-level BPE"],
  ["GPT-4 (cl100k_base)", "~100,000", "OpenAI, 2023"],
  ["GPT-4o and GPT-5 family (o200k_base)", "~200,000", "OpenAI, 2024 onwards"],
  ["Llama 3", "128,256", "Meta"],
  ["Mistral (Tekken)", "131,072", "Mistral"],
  ["DeepSeek-V3", "129,280", "DeepSeek"],
  ["Qwen3", "151,936", "Alibaba"],
  ["Gemma 3", "~262,000", "Google"],
];

export function Vocabularies() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Vocabularies you'll meet"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <div className="border-line bg-surface divide-line divide-y rounded-xl border">
            {VOCABS.map(([m, n, who], i) => (
              <motion.div
                key={m}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
              >
                <span>
                  <span className="font-medium">{m}</span>{" "}
                  <span className="text-muted">· {who}</span>
                </span>
                <span className="font-mono">{n}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every model family has its own tokenizer and <Term id="vocabulary">vocabulary</Term>. Bigger
        vocabularies cover more languages and code in fewer tokens, at the cost of a larger final
        layer in the model.
      </p>
      <p className="text-muted text-sm">
        The same text can be a different number of tokens on different models (Anthropic, for
        example, notes its newer tokenizer produces more tokens per word). Always count with the
        tokenizer of the model you&apos;ll use.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Models read tokens", "Chunks of text turned into ID numbers, never raw letters."],
  ["Learned from frequency", "BPE merges common pairs; common text gets fewer, bigger tokens."],
  ["Tokens are the unit of cost", "Price, speed and context limits are all counted in tokens."],
  ["~¾ word per token in English", "Other languages, code and numbers often need more."],
  ["Quirks come from tokens", "Spelling and letter counting are hard because letters are hidden."],
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
      <p>Token IDs are just numbers with no meaning of their own.</p>
      <p>Next: embeddings, how models turn those numbers into meaning.</p>
    </StepLayout>
  );
}
