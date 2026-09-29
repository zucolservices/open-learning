"use client";

import { motion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PASSAGES } from "../hybrid-search/corpus";
import { CASES, type Technique } from "./cases";
import data from "./data.json";
import { TECHNIQUES } from "./techniques";
import type { QueryState } from "./state";

const BY_ID = Object.fromEntries(PASSAGES.map((p) => [p.id, p]));

const TECH: [Technique, string][] = [
  ["rewrite", "Rewrite it as a standalone question"],
  ["decompose", "Split it into separate searches"],
  ["expand", "Use the documents' own words"],
  ["translate", "Translate it first"],
  ["hyde", "Search with a drafted answer (HyDE)"],
];

/* 1 ─ The good shopkeeper ----------------------------------------------------------------------- */

export function AskingWell() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The good shopkeeper"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            ["Customer", "“Same as last time, but the bigger one.”"],
            ["Shopkeeper thinks", "Last time: the 5-litre pressure cooker. So: the 7-litre one."],
            ["Customer", "“And do you have that thing for the lid, and is there a warranty?”"],
            [
              "Shopkeeper thinks",
              "Two questions: a gasket for that model, and the warranty terms.",
            ],
          ].map(([who, t], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn(
                "max-w-[85%] rounded-xl border px-3 py-2 text-sm",
                who === "Customer"
                  ? "border-line bg-surface self-start"
                  : "border-accent bg-accent-soft self-end",
              )}
            >
              <p className="text-muted text-[10px] tracking-wide uppercase">{who}</p>
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A good shopkeeper doesn&apos;t search the shelves for &ldquo;the bigger one&rdquo;. They
        work out what you mean first: fill in what you said earlier, split a double question,
        translate your words into their catalogue&apos;s.
      </p>
      <p>
        Real questions to a RAG system are just as messy.{" "}
        <Term id="query-rewriting">Query rewriting</Term> uses a language model to turn them into
        good searches before retrieval. It costs an extra model call, so it&apos;s worth knowing
        when it helps, and when it hurts.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the question ⭐ (real rewrites, real retrieval) --------------------------------------- */

function Mini({ list, gold }: { list: { id: string; s: number }[]; gold: string[] }) {
  return (
    <ol className="flex flex-col gap-0.5">
      {list.slice(0, 3).map((x, i) => (
        <li
          key={x.id}
          className={cn(
            "border-line flex gap-1.5 rounded border px-1.5 py-0.5 text-[10px]",
            gold.includes(x.id) ? "border-good bg-good/10" : "bg-surface",
          )}
        >
          <span className="font-mono">{i + 1}</span>
          <span className="truncate">{BY_ID[x.id].title}</span>
        </li>
      ))}
    </ol>
  );
}

function rankIn(list: { id: string }[], gold: string[]) {
  const r = Math.min(
    ...gold.map((g) => {
      const i = list.findIndex((x) => x.id === g);
      return i < 0 ? 99 : i + 1;
    }),
  );
  return r;
}

export function FixQuestions() {
  const [s, set] = useSceneState<QueryState>();
  const ci = Math.min(s.c, CASES.length - 1);
  const c = CASES[ci];
  const d = data.find((x) => x.id === c.id)!;
  const pick = s.picks[c.id] as Technique | undefined;
  const right = pick === c.technique;
  // For a split question every part must be found, so judge by the worst-placed answer.
  const all = c.technique === "decompose";
  const before = all ? Math.max(...c.gold.map((g) => rankIn(d.before, [g]))) : d.beforeRank;
  const after = all
    ? Math.max(...c.gold.map((g) => Math.min(...d.results.map((r) => rankIn(r.top, [g])))))
    : Math.min(...d.results.map((r) => rankIn(r.top, c.gold)));
  return (
    <StepLayout
      eyebrow="Fix the problem · real output"
      title="Fix the question"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CASES.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ c: i })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  ci === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  s.picks[x.id] === x.technique && ci !== i && "text-muted",
                )}
              >
                {x.title}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            {c.history?.map((h) => (
              <p key={h} className="text-muted text-[11px]">
                {h}
              </p>
            ))}
            <p className="mt-1 text-sm font-medium">
              {c.history ? "User: " : ""}
              {c.q}
            </p>
          </div>
          <div>
            <p className="text-muted mb-1 text-[11px]">
              Searched as asked · right passage at{" "}
              <span
                className={cn(
                  "font-mono",
                  before <= 1 ? "text-good" : before <= 3 ? "" : "text-bad",
                )}
              >
                #{before > 32 ? "–" : before}
              </span>
            </p>
            <Mini list={d.before} gold={c.gold} />
          </div>
          <div>
            <p className="text-muted mb-1 text-xs">What would you do before searching?</p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {TECH.map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={pick === k}
                  onClick={() => set({ picks: { ...s.picks, [c.id]: k } })}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left text-xs",
                    pick === k
                      ? k === c.technique
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  {pick === k &&
                    (k === c.technique ? (
                      <Check className="size-3.5 shrink-0" />
                    ) : (
                      <X className="size-3.5 shrink-0" />
                    ))}
                  {label}
                </button>
              ))}
            </div>
            {pick && !right && (
              <p className="text-muted mt-1 text-[11px]">
                Not the best fit for this one. Try another.
              </p>
            )}
          </div>
          {right && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
                <p className="text-muted text-[10px] tracking-wide uppercase">Phi-4-mini wrote</p>
                <p className="whitespace-pre-line">{d.rewritten}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {d.results.map((r) => (
                  <div key={r.query}>
                    <p className="text-muted mb-1 truncate text-[10px]">Search: {r.query}</p>
                    <Mini list={r.top} gold={c.gold} />
                  </div>
                ))}
              </div>
              <p
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium",
                  after < before
                    ? "border-good/50 bg-good/10"
                    : after === before
                      ? "border-line bg-surface"
                      : "border-bad/50 bg-bad/10",
                )}
              >
                Right passage: #{before > 32 ? "–" : before} <ArrowRight className="size-3" /> #
                {after}
                <span className="text-muted font-normal">
                  {after < before ? "· better" : after === before ? "· no change" : "· worse"}
                </span>
              </p>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Five questions that trouble a RAG system. For each, choose what to do before searching. Then
        see what a real small model (Phi-4-mini) actually wrote, and whether retrieval improved.
      </p>
      <p>
        Nothing is edited. Some rewrites are clumsy, one mistranslates, one makes things worse, and
        the <Term id="hyde">HyDE</Term> draft invents a meaning for &ldquo;BPL&rdquo;. That&apos;s
        fine for a search query, which the user never sees, but it&apos;s why the draft must never
        be shown as an answer.
      </p>
    </StepLayout>
  );
}

/* 3 ─ More techniques --------------------------------------------------------------------------- */

export function Techniques() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="More techniques"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TECHNIQUES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
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
        These all trade an extra model call (more time and cost) for better searches. Vendors such
        as OpenAI recommend a small, fast model for this step, and combining steps where you can.
        Azure&apos;s query-rewrite feature warns that rewrites can drop exact codes and IDs, one
        more reason to keep the original query too.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When rewriting hurts ---------------------------------------------------------------------- */

export function WhenRewritingHurts() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="When rewriting hurts"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="rewrite-hurts"
            prompt="The house-tax rewrite turned “concession on house tax for paying in advance” into a garbled question about “tax relief for a municipal corporation”, and the right passage dropped from 2nd to 3rd. What's the safest design?"
            options={[
              {
                id: "never",
                label: "Never rewrite questions",
                feedback:
                  "Then the follow-up, the two-part question and romanised Hindi all stay broken.",
              },
              {
                id: "both",
                label: "Search with both the original and the rewrite, and fuse the results",
                correct: true,
                feedback:
                  "Yes. Multi-query search with fusion (module 9's RRF) keeps what the original got right and adds what the rewrite finds.",
              },
              {
                id: "bigger",
                label: "Trust the rewrite; the model knows best",
                feedback: "Rewrites can drift from what the user meant, as this one did.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Rewriting is a guess about what the user meant. Guesses can be wrong.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Resolve the conversation", "Turn “how long does it take?” into a standalone question."],
  ["Split, translate, rephrase", "One search per question, in the documents' language and words."],
  ["Rewrites can go wrong", "Keep the original too, and fuse."],
  ["It costs a model call", "Use a small, fast model, and rewrite only when needed."],
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
        Better questions often matter more than a better index. Next: making each chunk carry its
        context, so the right one is found even when it doesn&apos;t mention its topic.
      </p>
    </StepLayout>
  );
}
