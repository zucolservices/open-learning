"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { PromptState } from "./state";

type RuleKey = "only" | "idk" | "cite";

const RULE_LABELS: [RuleKey, string][] = [
  ["only", "Only use the passages"],
  ["idk", "Say you don't know"],
  ["cite", "Cite passage numbers"],
];

const CASE_LABELS = ["BPL free water", "Fee for widows", "Paying late"];

/** What to look for in each question's answers (all eight versions are real, unedited). */
const NOTICE: Record<string, string> = {
  bpl: "Passage [1] is the old 2019 rule and says 15 kilolitres. Every version answered 20, because each passage's title says which rules it comes from. Labels on passages do real work.",
  widow:
    "The passages don't answer this. With no rules, the model says so but pads the answer with the senior-citizen waiver, which is beside the point. With “say you don't know” it answers in three words (once, oddly, “You don't know.”). With citations too, it cites all three passages for an answer none of them contains: a citation marker isn't proof.",
  late: "With no rules it lists the auto-debit rebate as a “consequence” of paying late, and runs out of room. Any one rule keeps it on topic. The citations point at [1] and [3] and skip the 2019 rules in [2], which is right.",
};

/** Answers were capped at 110 tokens; mark the ones that were cut off. */
const ended = (t: string) => (/[.!?\]]$/.test(t.trim()) ? t : `${t}…`);

/* 1 ─ Briefing a stand-in ----------------------------------------------------------------------- */

const BRIEF: [string, string, string][] = [
  [
    "Ground rules",
    "Use only what's in these folders. If they don't say, tell the patient you'll check.",
    "Instructions",
  ],
  [
    "Labelled folders",
    "Folder 1: discharge note, 12 March. Folder 2: lab report, 14 March.",
    "Passages, numbered, with their source",
  ],
  ["The question", "“Can she take ibuprofen?”", "The user's question, last"],
];

export function Briefing() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Briefing a stand-in"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2.5">
          {BRIEF.map(([t, d, m], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface grid gap-2 rounded-xl border px-4 py-3 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted mt-0.5 text-xs">{d}</p>
              </div>
              <span className="bg-accent-soft self-center justify-self-start rounded-full px-2.5 py-0.5 text-[11px]">
                {m}
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A doctor going on leave briefs the stand-in: first the ground rules, then the patient&apos;s
        papers in labelled folders, then the question they&apos;ll be asked. The stand-in knows
        medicine but not this patient; everything specific has to be in the briefing.
      </p>
      <p>
        A language model in a RAG system is that stand-in. It sees one page of text, the{" "}
        <Term id="prompt">prompt</Term>, and nothing else. Retrieval found the right passages; now
        they have to be laid out so the model uses them, says which one it used, and admits when
        they don&apos;t answer the question.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build the prompt ⭐ (8 real answers per question) ----------------------------------------- */

export function BuildPrompt() {
  const [s, set] = useSceneState<PromptState>();
  const c = data.cases[s.c];
  const ans = data.builder.find(
    (b) => b.id === c.id && b.only === s.only && b.idk === s.idk && b.cite === s.cite,
  )!;
  const system = [
    "You answer questions from residents of Kalpanagar.",
    ...RULE_LABELS.filter(([k]) => s[k]).map(([k]) => data.rules[k]),
  ];
  return (
    <StepLayout
      eyebrow="Build & connect · real output"
      title="Build the prompt"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CASE_LABELS.map((t, i) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.c === i}
                onClick={() => set({ c: i })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.c === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {RULE_LABELS.map(([k, label]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s[k]}
                onClick={() => set({ [k]: !s[k] })}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs",
                  s[k]
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <span
                  className={cn(
                    "grid size-3.5 place-items-center rounded border",
                    s[k] ? "border-accent bg-accent text-accent-fg" : "border-line",
                  )}
                >
                  {s[k] && <Check className="size-2.5" />}
                </span>
                {label}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface-2 flex flex-col gap-2 rounded-lg border p-3 font-mono text-[10.5px] leading-relaxed">
            <div>
              <p className="text-muted">system</p>
              {system.map((l, i) => (
                <motion.p
                  key={l}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(i > 0 && "bg-accent-soft rounded px-0.5")}
                >
                  {l}
                </motion.p>
              ))}
            </div>
            <div>
              <p className="text-muted">user</p>
              <p>Passages:</p>
              {c.ps.map((p, i) => (
                <p key={i} className="mt-1">
                  <span className="font-semibold">
                    [{i + 1}] {p.title}
                  </span>
                  <br />
                  <span className="line-clamp-2">{p.text}</span>
                </p>
              ))}
              <p className="mt-1">Question: {c.q}</p>
            </div>
          </div>
          <motion.div
            key={`${s.c}${s.only}${s.idk}${s.cite}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs"
          >
            <p className="text-muted text-[10px] tracking-wide uppercase">Phi-4-mini answered</p>
            <p className="whitespace-pre-line">{ended(ans.answer)}</p>
          </motion.div>
          <p className="text-muted text-[11px]">{NOTICE[c.id]}</p>
        </div>
      }
    >
      <p>
        Switch the three rules on and off for three questions. Each combination is a real answer
        from a small model (Phi-4-mini), unedited. One question has no answer in the passages.
      </p>
      <p>
        <strong>Only use the passages</strong> keeps the model from filling gaps from memory.{" "}
        <strong>Say you don&apos;t know</strong> gives it a way out, known as{" "}
        <Term id="abstention">abstention</Term>. It helps but guarantees nothing: in a 2025 study,
        models abstained <em>less</em> once they were given retrieved text, and another found models
        often believe a wrong passage over what they knew.
      </p>
      <p>
        <strong>Cite passage numbers</strong> lets a reader check the answer. Providers offer
        built-in <Term id="grounded-citation">citations</Term> too (Anthropic, OpenAI file search,
        Gemini, Cohere, Bedrock Knowledge Bases). Either way a marker only points; it doesn&apos;t
        prove the passage says what the sentence claims. In a 2023 study only 74.5% of citations
        from AI search engines fully supported their sentence.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Does position matter? ⭐ (18 + 18 real answers) ------------------------------------------- */

const SHORT_Q = [
  "Senior citizens' fee",
  "BPL free water",
  "Hospital supply",
  "Road leak",
  "Days to pay",
  "Disconnection notice",
];

const VERDICT: Record<string, [string, string]> = {
  ok: ["Right", "border-good bg-good/10"],
  muddled: ["Right, but muddled", "border-line bg-surface-2"],
  badcite: ["Right, wrong citation", "border-bad/50 bg-bad/5"],
  wrong: ["Wrong: used the 2019 rule", "border-bad bg-bad/15"],
};

export function WherePassagesGo() {
  const [s, set] = useSceneState<PromptState>();
  const runs = s.hard ? data.hard : data.easy;
  const [qi, pos] = s.cell.split("-").map(Number);
  const cur = runs.find((r) => r.qi === qi && r.pos === pos)!;
  const old = "old" in cur ? (cur.old as number[]) : [];
  return (
    <StepLayout
      eyebrow="Simulation · real output"
      title="Does position matter?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.hard ? "hard" : "easy"}
            options={[
              ["easy", "Right passage + 19 unrelated"],
              ["hard", "…with the old 2019 rules mixed in"],
            ]}
            onChange={(v) => set({ hard: v === "hard" })}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-muted">
                  <th className="py-1 text-left font-normal">Right passage at</th>
                  {[1, 10, 20].map((p) => (
                    <th key={p} className="font-normal">
                      #{p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHORT_Q.map((t, q) => (
                  <tr key={t}>
                    <td className="py-0.5 pr-2">{t}</td>
                    {[1, 10, 20].map((p) => {
                      const r = runs.find((x) => x.qi === q && x.pos === p)!;
                      const on = q === qi && p === pos;
                      return (
                        <td key={p} className="px-0.5 py-0.5">
                          <button
                            type="button"
                            aria-label={`${t}, position ${p}: ${VERDICT[r.verdict][0]}`}
                            aria-pressed={on}
                            onClick={() => set({ cell: `${q}-${p}` })}
                            className={cn(
                              "grid h-6 w-full place-items-center rounded border",
                              VERDICT[r.verdict][1],
                              on && "ring-accent ring-2",
                            )}
                          >
                            {r.verdict === "ok" ? (
                              <Check className="text-good size-3.5" />
                            ) : r.verdict === "wrong" ? (
                              <X className="text-bad size-3.5" />
                            ) : (
                              <span className="font-mono">~</span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted -mt-1 text-[10px]">
            ✓ right · ~ right, but muddled or citing the wrong passage · ✗ wrong. Tap a cell to read
            the answer.
          </p>
          <div>
            <p className="text-muted mb-1 text-[11px]">The 20 passages in the prompt</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <div
                  key={n}
                  title={n === pos ? "right passage" : old.includes(n) ? "2019 rule" : "unrelated"}
                  className={cn(
                    "h-4 flex-1 rounded-sm",
                    n === pos ? "bg-good" : old.includes(n) ? "bg-bad/70" : "bg-surface-2",
                  )}
                />
              ))}
            </div>
            <p className="text-muted mt-1 flex flex-wrap gap-x-3 text-[10px]">
              <span>
                <span className="bg-good mr-1 inline-block size-2 rounded-sm" />
                right 2026 section
              </span>
              {s.hard && (
                <span>
                  <span className="bg-bad/70 mr-1 inline-block size-2 rounded-sm" />
                  superseded 2019 section
                </span>
              )}
            </p>
          </div>
          <motion.div
            key={`${s.hard}-${s.cell}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-lg border px-3 py-2 text-xs", VERDICT[cur.verdict][1])}
          >
            <p className="text-muted text-[10px] tracking-wide uppercase">
              {SHORT_Q[qi]} · #{pos} · {VERDICT[cur.verdict][0]}
            </p>
            <p className="mt-0.5">{ended(cur.answer)}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A famous 2023 study found models used facts at the start or end of a long prompt far better
        than facts in the middle; with 20–30 documents, one model sometimes did worse than with none
        at all. This is <Term id="lost-in-the-middle">lost in the middle</Term>.
      </p>
      <p>
        We tried it: six questions, 20 passages, the right one at position 1, 10 or 20, with all
        three rules on. With unrelated passages, Phi-4-mini got all 18 right, in line with newer
        studies that find little position effect on simple lookups. With the old 2019 rules mixed
        in, it slipped twice, both times with the right passage <em>last</em>, and muddled two more.
        Too few to prove a pattern, but near-miss passages clearly make things harder.
      </p>
      <p>
        Newer evidence says the bigger risk is length and noise, not position. So send fewer, better
        passages; if you send many, tools such as LangChain&apos;s LongContextReorder and
        Haystack&apos;s LostInTheMiddleRanker put the best ones at the start and end.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Order for caching ------------------------------------------------------------------------- */

const BAR: [string, string][] = [
  ["Instructions", "bg-accent text-accent-fg"],
  ["Fixed reference text", "bg-accent text-accent-fg"],
  ["Retrieved passages", "bg-viz-data text-white"],
  ["Question", "bg-viz-data text-white"],
];

export function OrderAndCache() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Order for caching"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div>
            <div className="flex h-8 overflow-hidden rounded-lg">
              {BAR.map(([t, c], i) => (
                <div
                  key={t}
                  className={cn(
                    c,
                    "grid place-items-center border-r border-black/10 text-[10px] font-medium",
                  )}
                  style={{ flex: [2, 3, 4, 1][i] }}
                >
                  <span className="truncate px-1">{t}</span>
                </div>
              ))}
            </div>
            <div className="text-muted mt-1 flex text-[10px]">
              <span className="flex-[5]">↑ cached prefix: re-read at a fraction of the price</span>
              <span className="flex-[5] text-right">new every time ↑</span>
            </div>
          </div>
          <OrderCheckpoint
            id="prompt-order"
            prompt="Put these parts of a RAG prompt in order, top to bottom, so the provider can cache as much as possible and the model reads the question last."
            items={[
              { id: "inst", label: "Instructions (rules, answer format)" },
              { id: "ref", label: "A fixed glossary of scheme names, the same for every user" },
              { id: "pass", label: "The passages retrieved for this question" },
              { id: "q", label: "The user's question" },
            ]}
            explanation="Caches match the start of the prompt exactly, so everything that never changes goes first. Retrieved passages change with every question, so they come after. The question goes last: Anthropic and Google both recommend it after long documents."
          />
        </div>
      }
    >
      <p>
        <Term id="prompt-caching">Prompt caching</Term> reuses the start of a prompt that a provider
        has seen recently. On Anthropic, cached reads cost about a tenth of the normal input price
        on most models; OpenAI and Google cache too, each with its own minimum length and prices.
        The cache matches from the very first token, so one changed word early on wastes it.
      </p>
      <p>
        Anthropic reports that putting the question after long documents &ldquo;can improve response
        quality by up to 30 percent in tests&rdquo;. OpenAI&apos;s guide suggests repeating the
        instructions before and after long documents.
      </p>
      <p>
        One warning: passages are data, not orders. Tags and labels help the model tell them apart
        from your instructions, but they don&apos;t stop{" "}
        <Term id="prompt-injection">prompt injection</Term> (module 21).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Rules, labelled passages, question", "In that order, with each passage's source in its label."],
  ["Give it a way out", "Say what to answer when the passages don't cover it."],
  ["Citations point; they don't prove", "Check that the passage really says it."],
  ["Fewer, better passages", "Near-misses and length hurt more than position."],
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
        That completes the basic RAG pipeline. The next chapter goes beyond text passages: tables
        and SQL, graphs, agents and images.
      </p>
    </StepLayout>
  );
}
