"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { ContextState } from "./state";

type Mode = ContextState["mode"];
type Ranks = { vec: number | null; kw: number | null; hyb: number | null; top: number[] };

const { chunks: CHUNKS, sections: SECTIONS } = data;
const QS = data.questions as ((typeof data.questions)[number] & Record<Mode, Ranks>)[];

const SHORT = [
  "Senior citizens' fee",
  "BPL free water",
  "Hospital supply",
  "Road leak",
  "Days to pay",
  "Disconnection notice",
];

const MODES: [Mode, string][] = [
  ["plain", "Chunk alone"],
  ["head", "+ title & heading"],
  ["ctx", "+ model-written note"],
];

/** Phi-4-mini's notes were capped at 60 tokens; mark the ones that were cut off. */
const note = (t: string) => (/[.!?"”)]$/.test(t) ? t : `${t}…`);

function prefix(i: number, mode: Mode) {
  const c = CHUNKS[i];
  if (mode === "head") return `${SECTIONS[c.sec].title}.`;
  if (mode === "ctx") return note(c.context);
  return null;
}

function Year({ doc }: { doc: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded px-1 font-mono text-[9px]",
        doc === "2026" ? "bg-good/15 text-good" : "bg-bad/15 text-bad",
      )}
    >
      {doc}
    </span>
  );
}

function QuestionPills({ value, onChange }: { value: number; onChange(i: number): void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SHORT.map((t, i) => (
        <button
          key={t}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px]",
            value === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* 1 ─ The torn-out page ------------------------------------------------------------------------- */

export function TornPage() {
  const sec = SECTIONS[2];
  const sentences = sec.text.split(/(?<=\.) /);
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The torn-out page"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface w-full max-w-md rounded-xl border p-4 text-sm">
            <p className="text-muted text-[10px] tracking-wide uppercase">{sec.title}</p>
            <p className="mt-1.5">
              {sentences.map((t, i) => (
                <span
                  key={i}
                  className={cn(i === 1 && "bg-accent-soft rounded px-0.5 font-medium")}
                >
                  {t}{" "}
                </span>
              ))}
            </p>
          </div>
          <ArrowDown className="text-muted size-4" />
          <motion.div
            initial={{ opacity: 0, rotate: 0, y: -6 }}
            animate={{ opacity: 1, rotate: -2, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-accent bg-surface w-full max-w-xs rounded-md border border-dashed px-3 py-2 text-sm font-medium"
          >
            {sentences[1]}
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2">
            {["Whose limit?", "Water, or something else?", "2019 rules or 2026?"].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + 0.2 * i }}
                className="border-bad/50 bg-bad/10 rounded-full border px-2.5 py-0.5 text-xs"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Tear one sentence out of a rule book and hand it to a stranger: &ldquo;The limit is 20
        kilolitres per month, free of charge.&rdquo; On the page it was obvious. On its own, nobody
        can tell who gets it or which year&apos;s rules it belongs to.
      </p>
      <p>
        Chunking does this to every document. A <Term id="chunk">chunk</Term> keeps its own words
        but loses the headings and sentences around it, so a search for &ldquo;free water for BPL
        households&rdquo; may never find it. The chunk that answers the question doesn&apos;t
        mention the question&apos;s words.
      </p>
      <p>
        This module tries two fixes: give each chunk back its context before indexing, and search
        with small pieces but hand the model the whole section.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Give each chunk its context ⭐ (real notes, real rankings) --------------------------------- */

function RankCell({ label, r, base }: { label: string; r: number | null; base: number | null }) {
  const b = base ?? 99;
  const v = r ?? 99;
  return (
    <div className="border-line bg-surface rounded-lg border px-2 py-1.5 text-center">
      <p className="text-muted text-[10px]">{label}</p>
      <p
        className={cn(
          "font-mono text-lg font-semibold",
          v === 1 ? "text-good" : v > 3 && "text-bad",
        )}
      >
        #{r ?? "–"}
      </p>
      <p className="text-muted text-[10px]">{v < b ? "better" : v > b ? "worse" : "same"}</p>
    </div>
  );
}

export function AddContext() {
  const [s, set] = useSceneState<ContextState>();
  const q = QS[s.q];
  const r = q[s.mode];
  const pre = prefix(q.gold, s.mode);
  return (
    <StepLayout
      eyebrow="Simulation · real output"
      title="Give each chunk its context"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <QuestionPills value={s.q} onChange={(i) => set({ q: i })} />
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
            {q.q}
          </p>
          <Segmented size="sm" value={s.mode} options={MODES} onChange={(v) => set({ mode: v })} />
          <div>
            <p className="text-muted mb-1 text-[11px]">The chunk that answers it, as indexed</p>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              {pre && (
                <motion.span
                  key={s.mode + s.q}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-accent-soft mr-1 rounded px-0.5"
                >
                  {pre}
                </motion.span>
              )}
              <span className="font-medium">{CHUNKS[q.gold].text}</span>
            </div>
          </div>
          <div>
            <p className="text-muted mb-1 text-[11px]">
              Its place among 32 chunks (change from the chunk alone)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <RankCell label="Vector" r={r.vec} base={q.plain.vec} />
              <RankCell label="Keyword (BM25)" r={r.kw} base={q.plain.kw} />
              <RankCell label="Hybrid (RRF)" r={r.hyb} base={q.plain.hyb} />
            </div>
          </div>
          <div>
            <p className="text-muted mb-1 text-[11px]">Hybrid top 3</p>
            <ol className="flex flex-col gap-1">
              {r.top.map((i, n) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-1.5 rounded border px-2 py-1 text-[11px]",
                    i === q.gold ? "border-good bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <span className="font-mono">{n + 1}</span>
                  <Year doc={CHUNKS[i].doc} />
                  <span>{CHUNKS[i].text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      }
    >
      <p>
        32 one-sentence chunks from Kalpanagar&apos;s water rules: the current 2026 rules and the
        old 2019 ones they replaced. Each question asks about the current rules. Try the three ways
        of indexing each chunk and watch where the right one lands.
      </p>
      <p>
        <strong>Title &amp; heading</strong> sticks the document title and section heading on the
        front: free, no model needed. <strong>Model-written note</strong> is{" "}
        <Term id="contextual-retrieval">contextual retrieval</Term>: a small model (Phi-4-mini) read
        the whole rule book and wrote a note for each chunk. The notes are shown unedited; some are
        sharp, some are vague, some were cut off.
      </p>
      <p>
        What we found, honestly: context helps keyword search most (hospital #6 → #1). On these six
        questions the free heading did about as well as the model&apos;s notes, and one got worse
        with a note. And look at the 2019 chunks still sitting in the top 3. Context doesn&apos;t
        retire old rules; a <Term id="metadata-filter">metadata filter</Term> does.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How it's done, and what it costs ---------------------------------------------------------- */

const PROMPT = `<document>
{{WHOLE_DOCUMENT}}
</document>
Here is the chunk we want to situate within the whole document
<chunk>
{{CHUNK_CONTENT}}
</chunk>
Please give a short succinct context to situate this chunk within the overall document for the purposes of improving search retrieval of the chunk. Answer only with the succinct context and nothing else.`;

const RESULTS: [string, number][] = [
  ["Plain chunks", 5.7],
  ["+ contextual embeddings", 3.7],
  ["+ contextual BM25", 2.9],
  ["+ reranking", 1.9],
];

const COUSINS: [string, string][] = [
  [
    "Cheaper: title and headings",
    "No model calls. LlamaIndex already adds a chunk's metadata to the text it embeds, by default.",
  ],
  [
    "Cheaper: late chunking",
    "Embed the whole document first, then cut the vectors into chunks. No model call, but it needs a long-context embedding model.",
  ],
];

export function HowItsDone() {
  return (
    <StepLayout
      eyebrow="Step-through"
      title="How it's done, and what it costs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div>
            <p className="text-muted mb-1 text-[11px]">
              Anthropic&apos;s prompt (Sept 2024), run once per chunk
            </p>
            <Code className="whitespace-pre-wrap">{PROMPT}</Code>
          </div>
          <div>
            <p className="text-muted mb-1.5 text-[11px]">
              Right chunk missing from the top 20 (Anthropic&apos;s own tests, their datasets)
            </p>
            <div className="flex flex-col gap-1.5">
              {RESULTS.map(([t, v], i) => (
                <div key={t} className="flex items-center gap-2 text-xs">
                  <span className="w-40 shrink-0">{t}</span>
                  <div className="bg-surface-2 h-4 flex-1 overflow-hidden rounded">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(v / 5.7) * 100}%` }}
                      transition={{ delay: 0.15 * i, duration: 0.5 }}
                      className={cn("h-full rounded", i === 0 ? "bg-viz-idle" : "bg-accent")}
                    />
                  </div>
                  <span className="w-10 text-right font-mono">{v}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {COUSINS.map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted mt-0.5 text-[11px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        For every chunk, a model reads the whole document plus that one chunk and writes a short
        note, usually 50–100 tokens. The note is stuck on the front of the chunk before it is
        embedded <em>and</em> before it goes into the keyword index. The chunk&apos;s own words stay
        unchanged.
      </p>
      <p>
        In Anthropic&apos;s tests, failed retrievals fell by 35% with contextual embeddings, 49%
        with contextual BM25 as well, and 67% with a <Term id="reranker">reranker</Term> on top.
        Those are Anthropic&apos;s own figures; one small independent study found it only slightly ahead
        of <Term id="late-chunking">late chunking</Term>, at much higher cost.
      </p>
      <p>
        The cost: one model call per chunk, and each call reads the whole document. With{" "}
        <Term id="prompt-caching">prompt caching</Term> the document is stored once and re-read at
        about a tenth of the normal input price on most Claude models. Anthropic estimated $1.02 per
        million document tokens in 2024 with its smallest model; treat that as an order of
        magnitude, not today&apos;s price.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Search small, answer big ⭐ (real answers) -------------------------------------------------- */

export function SearchSmall() {
  const [s, set] = useSceneState<ContextState>();
  const q = QS[s.bq];
  return (
    <StepLayout
      eyebrow="Simulation · real output"
      title="Search small, answer big"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <QuestionPills value={s.bq} onChange={(i) => set({ bq: i })} />
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
            {q.q}
          </p>
          <Segmented
            size="sm"
            value={s.big ? "big" : "small"}
            options={[
              ["small", "Give the model the 3 matched sentences"],
              ["big", "Give it their whole sections"],
            ]}
            onChange={(v) => set({ big: v === "big" })}
          />
          {!s.big ? (
            <ol className="flex flex-col gap-1">
              {q.top.map((i, n) => (
                <li
                  key={i}
                  className="border-line bg-surface flex items-start gap-1.5 rounded border px-2 py-1 text-[11px]"
                >
                  <span className="font-mono">{n + 1}</span>
                  <Year doc={CHUNKS[i].doc} />
                  <span>{CHUNKS[i].text}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex flex-col gap-1.5">
              {q.parents.map((p) => (
                <div
                  key={p}
                  className="border-line bg-surface rounded-lg border px-2.5 py-1.5 text-[11px]"
                >
                  <p className="text-muted flex items-center gap-1.5 text-[10px]">
                    <Year doc={SECTIONS[p].doc} />
                    {SECTIONS[p].title}
                  </p>
                  <p className="mt-0.5">
                    {CHUNKS.map((c, i) =>
                      c.sec === p ? (
                        <span
                          key={i}
                          className={cn(q.top.includes(i) && "bg-accent-soft rounded px-0.5")}
                        >
                          {c.text}{" "}
                        </span>
                      ) : null,
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
          <motion.div
            key={`${s.bq}-${s.big}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs"
          >
            <p className="text-muted flex items-center gap-1 text-[10px] tracking-wide uppercase">
              Phi-4-mini answered <ArrowRight className="size-3" />
            </p>
            {s.big ? q.big : q.small}
          </motion.div>
        </div>
      }
    >
      <p>
        Small pieces make sharp searches: one sentence has one meaning, so its vector is precise.
        But one sentence is a poor thing to answer from. So search with sentences, then hand the
        model each sentence&apos;s whole section. This is{" "}
        <Term id="parent-child-chunks">small-to-big retrieval</Term>.
      </p>
      <p>
        Try <strong>BPL free water</strong>. The search finds &ldquo;BPL households receive a
        lifeline allowance&rdquo;, but the number is in the next sentence, which never matched. With
        sentences alone the model (correctly) says it can&apos;t find the amount. With whole
        sections it answers 20 kilolitres. On the easy questions, both work.
      </p>
      <p>
        Every framework has this: LangChain&apos;s parent-document retriever, LlamaIndex&apos;s
        sentence-window retriever (three sentences each side by default) and auto-merging retriever,
        and hierarchical chunking in Amazon Bedrock Knowledge Bases. The cost is a longer prompt.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Where to start ---------------------------------------------------------------------------- */

export function WhereToStart() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where to start"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="context-first"
            prompt="You're indexing 20,000 department circulars. Many chunks say things like “the above scheme” or “this limit”, and searches miss them. The budget is tight. What do you try first?"
            options={[
              {
                id: "head",
                label:
                  "Put each circular's title and section heading on every chunk, measure on test questions, then add model-written notes where it still fails",
                correct: true,
                feedback:
                  "Yes. Headings cost nothing and often do most of the work, as they did here. Pay for a model call per chunk only where measurement shows it helps.",
              },
              {
                id: "all",
                label: "Write a model note for every chunk straight away",
                feedback:
                  "It may well help, but that's one model call per chunk, each reading the whole circular. Try the free fix first and measure.",
              },
              {
                id: "bigger",
                label: "Make every chunk a whole page, so nothing loses context",
                feedback:
                  "Big chunks blur the search (module 4). Search small and return big instead.",
              },
              {
                id: "rerank",
                label: "Nothing; the reranker will sort it out",
                feedback:
                  "A reranker can only reorder what was retrieved. A chunk that never reaches the shortlist can't be rescued.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Every fix here costs something: model calls, index size or prompt length.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Chunks lose their context", "“The limit is 20 kilolitres” doesn't say whose limit."],
  ["Put it back before indexing", "Headings for free, or a model-written note per chunk."],
  ["Search small, answer big", "Match sentences, hand the model their sections."],
  ["Measure before you pay", "Context isn't always a win, and it won't retire old rules."],
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
        Next: what to do with the passages once you have them: assembling the prompt so the model
        cites them and says &ldquo;I don&apos;t know&rdquo; when it should.
      </p>
    </StepLayout>
  );
}
