"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import { QUESTIONS } from "./policy";
import type { ChunkState } from "./state";

type Config = (typeof data.configs)[number];
type Result = Config["results"][number];

const METHOD_LABEL: Record<ChunkState["method"], string> = {
  fixed: "Fixed size",
  sentence: "Whole sentences",
  heading: "By heading",
};
const SIZE_LABEL: Record<ChunkState["size"], string> = {
  small: "Small · ~150 chars",
  medium: "Medium · ~400",
  large: "Large · ~900",
};

function configFor(s: Pick<ChunkState, "method" | "size" | "overlap">): Config {
  const id = s.method === "heading" ? "heading" : `${s.method}-${s.size}-${s.overlap}`;
  return data.configs.find((c) => c.id === id)!;
}

function verdict(r: Result): [string, "good" | "mixed" | "bad"] {
  if (r.top1) return ["The complete rule came back first", "good"];
  if (r.split) return ["No chunk holds the whole rule: it was cut apart", "bad"];
  if (r.old1) return ["A rule from the superseded 2019 version came back first", "bad"];
  if (r.top3) return ["The complete rule came back, but not first", "mixed"];
  return ["The complete rule didn't come back at all", "bad"];
}

/* 1 ─ Cutting flashcards ------------------------------------------------------------------------- */

const CARDS: { title: string; card: string; tone: "good" | "bad"; text: string }[] = [
  {
    title: "Too small",
    card: "“However, the fee is waived for senior citizens…”",
    tone: "bad",
    text: "Which fee? The card on its own has lost the sentence before it. A search can find it and still not know what it's about.",
  },
  {
    title: "Too big",
    card: "The whole chapter on water bills, disconnection and reconnection",
    tone: "bad",
    text: "The answer is on the card somewhere, but so are twenty other rules. Its meaning is a blur, and the reader may grab the wrong line.",
  },
  {
    title: "About right",
    card: "“7. Reconnection: the fee is ₹1,000. However, it is waived for senior citizens who…”",
    tone: "good",
    text: "One complete idea, with its heading and its exception, small enough to be precise.",
  },
];

export function Flashcards() {
  const [s, set] = useSceneState<ChunkState>();
  const c = CARDS[Math.min(s.card, CARDS.length - 1)];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Cutting flashcards"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper step={Math.min(s.card, 2)} count={3} onChange={(n) => set({ card: n })} />
          <motion.div
            key={c.title}
            initial={{ rotate: -2, opacity: 0, y: 8 }}
            animate={{ rotate: 0, opacity: 1, y: 0 }}
            className="border-line bg-surface mx-auto flex min-h-32 w-full max-w-sm items-center justify-center rounded-xl border p-5 text-center text-sm shadow-sm"
          >
            {c.card}
          </motion.div>
          <FrameCaption frameKey={c.title} title={c.title} tone={c.tone}>
            {c.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Imagine revising from a textbook by cutting it into flashcards. Cut each sentence onto its
        own card and many cards stop making sense. Paste whole chapters onto cards and you can never
        find anything.
      </p>
      <p>
        A RAG system searches <Term id="chunk">chunks</Term>, not whole files, and faces exactly
        this choice. Embedding models also have a limit: multilingual-e5-small reads at most 512
        tokens and silently cuts off the rest.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The chunk lab ⭐ (simulation, real retrieval and answers) ---------------------------------- */

export function ChunkLab() {
  const [s, set] = useSceneState<ChunkState>();
  const cfg = configFor(s);
  const qi = Math.min(s.q, QUESTIONS.length - 1);
  const r = cfg.results[qi];
  const [vText, vTone] = verdict(r);
  const rank = new Map(r.top.map((t, n) => [t.i, n + 1]));
  const must = QUESTIONS[qi].must;
  const heading = s.method === "heading";
  return (
    <StepLayout
      eyebrow="Simulation · real data"
      title="The chunk lab"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Segmented
              size="sm"
              value={s.method}
              options={(Object.keys(METHOD_LABEL) as ChunkState["method"][]).map((k) => [
                k,
                METHOD_LABEL[k],
              ])}
              onChange={(v) => set({ method: v })}
            />
            <div
              className={cn("flex flex-wrap gap-2", heading && "pointer-events-none opacity-40")}
            >
              <Segmented
                size="sm"
                value={s.size}
                options={(Object.keys(SIZE_LABEL) as ChunkState["size"][]).map((k) => [
                  k,
                  SIZE_LABEL[k],
                ])}
                onChange={(v) => set({ size: v })}
              />
              <Segmented
                size="sm"
                value={String(s.overlap) as "0" | "25"}
                options={[
                  ["0", "No overlap"],
                  ["25", "25% overlap"],
                ]}
                onChange={(v) => set({ overlap: Number(v) as 0 | 25 })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {QUESTIONS.map((q, i) => {
              const res = cfg.results[i];
              return (
                <button
                  key={q.q}
                  type="button"
                  aria-pressed={qi === i}
                  onClick={() => set({ q: i })}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs",
                    qi === i
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  {res.ok ? (
                    <Check className="text-good size-3.5 shrink-0" />
                  ) : (
                    <X className="text-bad size-3.5 shrink-0" />
                  )}
                  {q.q.replace("Under the current water rules, ", "")}
                </button>
              );
            })}
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-muted text-[11px]">
                {cfg.chunks.length} chunks · the three closest to the question first, then the rest
              </p>
              <div className="border-line flex max-h-72 flex-col gap-1 overflow-y-auto rounded-lg border p-1.5">
                {[
                  ...r.top.map((t) => t.i),
                  ...cfg.chunks.map((_, i) => i).filter((i) => !rank.has(i)),
                ].map((i) => {
                  const c = cfg.chunks[i];
                  const n = rank.get(i);
                  const complete = c.doc === "2026" && must.every((m) => c.text.includes(m));
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-1.5 rounded-md border px-1.5 py-1 text-[10px] leading-snug",
                        n ? "border-accent bg-accent-soft" : "border-line bg-surface",
                        c.doc === "2019" && "italic",
                        !n && "opacity-60",
                      )}
                    >
                      <span className="w-3 shrink-0 font-mono font-semibold">{n ?? ""}</span>
                      <span className="flex-1 whitespace-pre-line">
                        {c.doc === "2019" && <span className="text-bad not-italic">[2019] </span>}
                        {c.text}
                      </span>
                      {complete && (
                        <Check
                          className="text-good size-3 shrink-0"
                          aria-label="holds the whole rule"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs",
                  vTone === "good"
                    ? "border-good/50 bg-good/10"
                    : vTone === "mixed"
                      ? "border-line-strong bg-surface-2"
                      : "border-bad/50 bg-bad/10",
                )}
              >
                <p className="text-muted text-[10px] tracking-wide uppercase">Retrieval</p>
                <p className="font-medium">{vText}</p>
              </div>
              <div
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs",
                  r.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                )}
              >
                <p className="text-muted flex items-center gap-1 text-[10px] tracking-wide uppercase">
                  {r.ok ? <Check className="size-3" /> : <X className="size-3" />}
                  Answer from the top 3 chunks
                </p>
                <p className="whitespace-pre-line">{r.answer}</p>
              </div>
              <p className="text-muted text-[10px]">
                ✓ in the list marks a chunk that holds the whole 2026 rule. Italic chunks come from
                the superseded 2019 rules.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        The store holds the current <em>Kalpanagar Water Supply Rules, 2026</em> and the superseded
        2019 version, with similar wording and different numbers. Change the{" "}
        <Term id="chunk-size">chunk size</Term>, the <Term id="chunk-overlap">overlap</Term> and the
        splitting rule, and see what comes back for each question.
      </p>
      <p>
        Everything is real: the chunks were embedded with multilingual-e5-small, and the answers
        come from Phi-4-mini (3.8B parameters), given the top three chunks.
      </p>
      <p className="text-muted text-sm">
        Try fixed-size chunks first: they cut sentences mid-word, so a rule and its exception end up
        apart. Then try whole sentences, then chunking by heading, where each chunk also carries its
        document and section title.
      </p>
      <p className="text-muted text-sm">
        Watch the free-water question. Even when the 2026 chunk comes first, a 2019 chunk in the top
        three can look identical, and the model may repeat the old limit of 15 kilolitres. Only the
        titled chunks say which version they belong to.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Every setting at once ------------------------------------------------------------------ */

export function CompareAll() {
  const [s, set] = useSceneState<ChunkState>();
  const rows: [string, Pick<ChunkState, "method" | "size" | "overlap">][] = [];
  for (const m of ["fixed", "sentence"] as const)
    for (const sz of ["small", "medium", "large"] as const)
      for (const ov of [0, 25] as const)
        rows.push([
          `${METHOD_LABEL[m]} · ${sz} · ${ov ? "25%" : "no"} overlap`,
          { method: m, size: sz, overlap: ov },
        ]);
  rows.push(["By heading, with titles", { method: "heading", size: "medium", overlap: 0 }]);
  const current = configFor(s).id;
  return (
    <StepLayout
      eyebrow="Compare · real data"
      title="Every setting at once"
      stage={
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-muted grid grid-cols-[1fr_repeat(4,2rem)] gap-1 text-[10px]">
            <span>Setting</span>
            {QUESTIONS.map((_, i) => (
              <span key={i} className="text-center">
                Q{i + 1}
              </span>
            ))}
          </div>
          {rows.map(([label, cfg]) => {
            const c = configFor(cfg);
            return (
              <button
                key={label}
                type="button"
                onClick={() => set({ ...cfg })}
                className={cn(
                  "grid grid-cols-[1fr_repeat(4,2rem)] items-center gap-1 rounded-md px-1 py-0.5 text-left text-[11px]",
                  c.id === current ? "bg-accent-soft" : "hover:bg-surface-2",
                )}
              >
                <span>{label}</span>
                {c.results.map((r, i) => (
                  <span
                    key={i}
                    className={cn(
                      "mx-auto grid size-5 place-items-center rounded",
                      r.ok ? "bg-good/20 text-good" : "bg-bad/20 text-bad",
                    )}
                  >
                    {r.ok ? <Check className="size-3" /> : <X className="size-3" />}
                  </span>
                ))}
              </button>
            );
          })}
          <p className="text-muted text-[10px]">
            ✓ = the answer was correct. Q1 reconnection fee · Q2 free water · Q3 hospitals · Q4
            main-road leaks. Tap a row to load it in the lab.
          </p>
        </div>
      }
    >
      <p>
        Here are all thirteen settings, each tested on all four questions. No single size wins
        everything, and small changes flip individual answers.
      </p>
      <p>
        That matches the research. Chroma&apos;s 2024 report found chunking choices moved retrieval
        recall by up to 9%, and that popular defaults can perform poorly. A 2025 study (Qu et al.)
        found expensive &ldquo;semantic&rdquo; chunking wasn&apos;t consistently better than simple
        fixed-size chunks.
      </p>
      <p className="text-muted text-sm">
        The lesson isn&apos;t &ldquo;use size X&rdquo;. It&apos;s: build a small test set from your
        own documents and questions, and measure (module 18).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Search small, return big ------------------------------------------------------------------- */

const IDEAS: { title: string; text: string }[] = [
  {
    title: "Parent–child chunks",
    text: "Index small chunks for precise matching, but hand the model the larger section each one came from: search small, return big. LangChain's ParentDocumentRetriever and LlamaIndex's hierarchical parsers (defaults 2,048, 512 and 128 tokens) do this.",
  },
  {
    title: "Structure-aware splitting",
    text: "Split at headings and paragraphs rather than at a character count, and prefix each chunk with its document and section titles, as the “by heading” setting did.",
  },
  {
    title: "Semantic chunking",
    text: "Cut where the topic changes, measured by the distance between neighbouring sentences' embeddings (popularised by Greg Kamradt in 2024). It costs extra embedding work, and studies find it isn't reliably better. Fancy isn't automatically better.",
  },
  {
    title: "Late chunking",
    text: "Embed the whole document first with a long-context model, then cut the token vectors into chunks, so each chunk's vector 'knows' its surroundings (Jina AI, 2024). Small but consistent gains: about 2–4% relative.",
  },
];

export function BeyondBasics() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Search small, return big"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {IDEAS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{c.title}</p>
              <p className="text-muted mt-1 text-xs">{c.text}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Small chunks match precisely; big chunks carry context. Several techniques try to get both.
      </p>
      <p>
        The simplest, <Term id="parent-child-chunks">parent–child chunks</Term>, is widely used.
        Module 12 comes back to it, along with adding context to each chunk.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which fix? ----------------------------------------------------------------------------------- */

export function SymptomFix() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which fix?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="chunk-fix"
            prompt="Match each symptom to the change most likely to fix it."
            categories={[
              { id: "whole", label: "Keep sentences whole" },
              { id: "smaller", label: "Smaller chunks" },
              { id: "titles", label: "Add titles to chunks" },
            ]}
            items={[
              {
                id: "cut",
                label: "A rule's first half and its exception land in different chunks",
                category: "whole",
                why: "Fixed-size cuts ignore sentences. Split at sentence or section boundaries (overlap helps too).",
              },
              {
                id: "chapter",
                label: "Each chunk is a whole chapter, and answers mix up neighbouring rules",
                category: "smaller",
                why: "Too much in one chunk blurs its meaning and distracts the model.",
              },
              {
                id: "orphan",
                label: "A chunk says “The limit is 20 kilolitres” with no hint of which scheme",
                category: "titles",
                why: "Carry the section heading (and document title) into every chunk.",
              },
              {
                id: "version",
                label: "An old version's rule ranks first because the chunks look identical",
                category: "titles",
                why: "A document title with the year helps; module 5 adds proper version metadata.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Four symptoms from real projects. What would you change?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const DEFAULTS: [string, string][] = [
  ["Amazon Bedrock Knowledge Bases", "about 300 tokens, sentences kept whole"],
  ["Azure AI Search (guidance)", "512 tokens, 25% overlap"],
  ["OpenAI file search", "800 tokens, 400 overlap"],
  ["Google RAG Engine", "1,024 tokens, 256 overlap"],
  ["LangChain recursive splitter", "4,000 characters, 200 overlap"],
  ["LlamaIndex sentence splitter", "1,024 tokens, 200 overlap"],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Default chunk sizes (September 2026)</p>
            <ul className="mt-2 grid gap-1">
              {DEFAULTS.map(([k, v]) => (
                <li key={k} className="flex justify-between gap-3 text-xs">
                  <span>{k}</span>
                  <span className="text-muted text-right">{v}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted mt-2 text-[10px]">
              A token is roughly 4 characters of English; other languages differ by tokenizer.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The defaults span a factor of three or more. There&apos;s no magic number: keep ideas whole,
        keep headings with their text, and test on your own documents and questions.
      </p>
      <p>Next: keeping the index in step as documents change, with metadata and versions.</p>
    </StepLayout>
  );
}
