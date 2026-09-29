"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { GraphState } from "./state";

const NOTES = data.notes;
const NODE = Object.fromEntries(data.nodes.map((n) => [n.id, n]));
const DEGREE: Record<string, number> = {};
for (const r of data.rels) {
  DEGREE[r.a] = (DEGREE[r.a] ?? 0) + 1;
  DEGREE[r.b] = (DEGREE[r.b] ?? 0) + 1;
}
const SUMMARY = Object.fromEntries(data.summaries.map((s) => [s.c, s.summary]));
const titleOf = (c: number) =>
  (SUMMARY[c] ?? "").split("\n")[0].replace(/^Title:\s*/, "") || `Group ${c + 1}`;

/** Answers were capped in length; mark the ones that were cut off. */
const ended = (t: string) => (/[.!?)\]]$/.test(t.trim()) ? t : `${t}…`);

/* The graph, drawn from precomputed positions ------------------------------------------------- */

function GraphView({ lit, labels }: { lit: Set<string>; labels: Set<string> }) {
  const X = (x: number) => 2 + x * 96;
  const Y = (y: number) => 3 + y * 60;
  return (
    <svg viewBox="0 0 100 64" className="border-line bg-surface w-full rounded-xl border">
      {data.rels.map((r, i) => {
        const a = NODE[r.a];
        const b = NODE[r.b];
        const on = lit.has(r.a) && lit.has(r.b);
        return (
          <line
            key={i}
            x1={X(a.x)}
            y1={Y(a.y)}
            x2={X(b.x)}
            y2={Y(b.y)}
            className={on ? "stroke-accent" : "stroke-line"}
            strokeWidth={on ? 0.35 : 0.2}
          />
        );
      })}
      {data.nodes.map((n) => (
        <circle
          key={n.id}
          cx={X(n.x)}
          cy={Y(n.y)}
          r={0.7 + Math.min(DEGREE[n.id] ?? 0, 6) * 0.18}
          className={lit.has(n.id) ? "fill-accent" : "fill-viz-idle"}
        />
      ))}
      {data.nodes
        .filter((n) => labels.has(n.id))
        .map((n) => (
          <text
            key={n.id}
            x={X(n.x)}
            y={Y(n.y) - 1.6}
            textAnchor="middle"
            className="fill-fg"
            style={{ fontSize: 1.7 }}
          >
            {n.label}
          </text>
        ))}
    </svg>
  );
}

/* 1 ─ Two kinds of question --------------------------------------------------------------------- */

export function LocalGlobal() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Two kinds of question"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Local",
              "“Which contractor maintains the Temple Street streetlights?”",
              "The answer sits in one or two notes. Fetch them and read.",
            ],
            [
              "Global",
              "“What were the main problems residents complained about in July?”",
              "The answer is spread across every note. No five notes contain it.",
            ],
          ].map(([k, q, d], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <span className="bg-accent-soft rounded-full px-2.5 py-0.5 text-[11px]">{k}</span>
              <p className="mt-2 text-sm font-medium">{q}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Ask a librarian for the book on Mughal architecture and they fetch it. Ask &ldquo;what is
        this library strong in?&rdquo; and fetching five books won&apos;t do. They need a map of the
        whole collection, built beforehand.
      </p>
      <p>
        RAG so far is the fetching librarian. It is excellent at <em>local</em> questions.{" "}
        <Term id="graphrag">GraphRAG</Term> builds the map, so it can take on <em>global</em>{" "}
        questions about the whole collection. Our collection: 28 made-up complaint notes from
        Kalpanagar&apos;s wards in July 2026.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Plain RAG on a big question ⭐ ------------------------------------------------------------- */

const COVER: Record<string, string> = {
  yes: "border-good/50 bg-good/10",
  partly: "border-line bg-surface-2",
  no: "border-bad/50 bg-bad/10",
};

function Coverage({ who }: { who: "rag" | "graph" }) {
  return (
    <ul className="flex flex-col gap-1">
      {data.themes.map((t, i) => {
        const v = data.coverage[who][i];
        return (
          <li key={t} className={cn("rounded border px-2 py-0.5 text-[11px]", COVER[v])}>
            <span className="font-mono">{v === "yes" ? "✓" : v === "partly" ? "~" : "✗"}</span> {t}
          </li>
        );
      })}
    </ul>
  );
}

export function BigQuestion() {
  const q = data.questions[0];
  return (
    <StepLayout
      eyebrow="Simulation · real output"
      title="Plain RAG on a big question"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
            {q.q}
          </p>
          <div>
            <p className="text-muted mb-1 text-[11px]">The 5 notes retrieved, of 28</p>
            <ol className="flex flex-col gap-0.5">
              {q.top.map((id, i) => (
                <li
                  key={id}
                  className="border-line bg-surface flex gap-1.5 rounded border px-2 py-0.5 text-[10.5px]"
                >
                  <span className="font-mono">{i + 1}</span>
                  <span className="line-clamp-1">{NOTES.find((n) => n.id === id)!.text}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted text-[10px] tracking-wide uppercase">Phi-4-mini answered</p>
            <p className="whitespace-pre-line">{q.rag}</p>
          </div>
          <div>
            <p className="text-muted mb-1 text-[11px]">
              The five real themes in the notes (we wrote them, so we know)
            </p>
            <Coverage who="rag" />
          </div>
        </div>
      }
    >
      <p>
        Plain RAG does what it always does: finds the five notes most like the question and answers
        from them. The answer is fluent and every point in it is true.
      </p>
      <p>
        But it covers only what those five notes happened to say. The pipeline works, the biggest
        cluster of complaints, never appear. Nothing in the answer hints that anything is missing. A
        &ldquo;main problems&rdquo; question needs every note, not the five most similar ones.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Build the map ⭐ (real extraction, real communities, real summaries) ----------------------- */

export function BuildGraph() {
  const [s, set] = useSceneState<GraphState>();
  const note = NOTES.find((n) => n.id === s.note)!;
  const noteNodes = useMemo(
    () => new Set(data.nodes.filter((n) => n.notes.includes(s.note)).map((n) => n.id)),
    [s.note],
  );
  const hubs = useMemo(
    () => new Set(data.nodes.filter((n) => (DEGREE[n.id] ?? 0) >= 4).map((n) => n.id)),
    [],
  );
  const comm = new Set(data.communities[s.comm]);
  const lit = s.tab === "extract" ? noteNodes : s.tab === "group" ? comm : new Set<string>();
  const labels = s.tab === "extract" ? noteNodes : s.tab === "group" ? comm : hubs;
  return (
    <StepLayout
      eyebrow="Step-through · real output"
      title="Build the map"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.tab}
            options={[
              ["extract", "1 · Extract"],
              ["connect", "2 · Connect"],
              ["group", "3 · Group & summarise"],
            ]}
            onChange={(v) => set({ tab: v })}
          />
          {s.tab === "extract" && (
            <div className="flex flex-col gap-2">
              <select
                aria-label="Complaint note"
                value={s.note}
                onChange={(e) => set({ note: e.target.value })}
                className="border-line bg-surface rounded-lg border px-2 py-1 text-xs"
              >
                {NOTES.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.id} · {n.text.slice(0, 60)}…
                  </option>
                ))}
              </select>
              <p className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                {note.text}
              </p>
              <Code className="max-h-36 text-[10px] whitespace-pre-wrap">
                {data.extract[s.note as keyof typeof data.extract]}
              </Code>
            </div>
          )}
          {s.tab === "group" && (
            <div className="flex flex-wrap gap-1.5">
              {data.summaries.map((x) => (
                <button
                  key={x.c}
                  type="button"
                  aria-pressed={s.comm === x.c}
                  onClick={() => set({ comm: x.c })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px]",
                    s.comm === x.c
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {titleOf(x.c)}
                </button>
              ))}
            </div>
          )}
          <GraphView lit={lit} labels={labels} />
          {s.tab === "group" && (
            <motion.div
              key={s.comm}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-muted text-[10px] tracking-wide uppercase">
                Phi-4-mini&apos;s community report
              </p>
              <p className="whitespace-pre-line">{ended(SUMMARY[s.comm])}</p>
            </motion.div>
          )}
        </div>
      }
    >
      {s.tab === "extract" && (
        <p>
          <strong>Extract.</strong> Before any question arrives, a model reads every note and lists
          its <Term id="entity">entities</Term> (places, organisations, problems) and the
          relationships between them. This is Phi-4-mini&apos;s real output, unedited. It&apos;s
          useful and messy: it calls stray dogs &ldquo;people&rdquo;, a pipeline a
          &ldquo;document&rdquo;, and sometimes links to things it forgot to list.
        </p>
      )}
      {s.tab === "connect" && (
        <p>
          <strong>Connect.</strong> Join every note&apos;s entities into one{" "}
          <Term id="knowledge-graph">knowledge graph</Term>: 85 entities, 86 relationships. The same
          name in two notes becomes one dot, which is how &ldquo;Sagar Infra&rdquo; links Ward 3 to
          Ward 9. Different names for the same thing stay apart: &ldquo;Portal&rdquo; and
          &ldquo;citizen portal&rdquo; are two dots here. Merging them is called entity resolution,
          and it matters.
        </p>
      )}
      {s.tab === "group" && (
        <p>
          <strong>Group &amp; summarise.</strong> A community-detection algorithm (we used Louvain;
          Microsoft&apos;s GraphRAG uses its successor, Leiden) finds clusters of densely connected
          entities. A model then writes a short report on each{" "}
          <Term id="graph-community">community</Term>. Some groups are tidy (the pipeline works, the
          streetlights); one mixes a school&apos;s mosquito problem with the portal outage, because
          both mention &ldquo;the corporation&rdquo;.
        </p>
      )}
      <p className="text-muted text-sm">
        All of this is done once, at indexing time, with a model call per note and per community.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Answer from the map ⭐ (real map-reduce) --------------------------------------------------- */

export function AnswerFromMap() {
  const [s, set] = useSceneState<GraphState>();
  const q = data.questions.find((x) => x.id === s.q)!;
  return (
    <StepLayout
      eyebrow="Comparison · real output"
      title="Answer from the map"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.q}
            options={[
              ["global", "Global question"],
              ["local", "Local question"],
            ]}
            onChange={(v) => set({ q: v })}
          />
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
            {q.q}
          </p>
          <div>
            <p className="text-muted mb-1 text-[11px]">
              Map: each community report offers scored points ({q.pts.length} in all)
            </p>
            <ul className="flex max-h-28 flex-col gap-0.5 overflow-y-auto">
              {q.pts.map((p, i) => (
                <li
                  key={i}
                  className="border-line bg-surface flex gap-1.5 rounded border px-2 py-0.5 text-[10.5px]"
                >
                  <span className="w-6 shrink-0 font-mono">{p.score}</span>
                  <span className="line-clamp-1">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px] tracking-wide uppercase">Plain RAG</p>
              <p className="line-clamp-[12] whitespace-pre-line">{q.rag}</p>
            </div>
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px] tracking-wide uppercase">Reduce: from the map</p>
              <p className="line-clamp-[12] whitespace-pre-line">{ended(q.reduce)}</p>
            </div>
          </div>
          {s.q === "global" && (
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-muted mb-1 text-[10px]">Plain RAG covered</p>
                <Coverage who="rag" />
              </div>
              <div>
                <p className="text-muted mb-1 text-[10px]">From the map covered</p>
                <Coverage who="graph" />
              </div>
            </div>
          )}
        </div>
      }
    >
      <p>
        For a global question, every community report is asked for its relevant points with an
        importance score (<em>map</em>); then the highest-scoring points are combined into one
        answer (<em>reduce</em>). All real Phi-4-mini output.
      </p>
      {s.q === "global" ? (
        <p>
          From the map, four of the five themes appear, including the pipeline works plain RAG
          missed. It&apos;s also repetitive and ran out of room: a small model struggles with the
          reduce step. The portal outage never surfaced, because its community report mixed it with
          mosquitoes. One honest caveat: our first map prompt was too literal (&ldquo;this report
          doesn&apos;t cover the whole city&rdquo;), and we rewrote it once, as GraphRAG&apos;s own
          prompts do.
        </p>
      ) : (
        <p>
          For a local question the map is the wrong tool. Plain RAG finds the note and answers
          cleanly. The map-reduce answer lists &ldquo;Ward Corporation&rdquo; and
          &ldquo;Citizens&rdquo; before the actual contractor.
        </p>
      )}
    </StepLayout>
  );
}

/* 5 ─ Is it worth it? --------------------------------------------------------------------------- */

const WORTH: [string, string][] = [
  [
    "What the paper found",
    "Microsoft (2024, preprint): on two collections of 1–1.7 million tokens, an AI judge preferred GraphRAG-style answers to plain RAG for comprehensiveness 72–83% of the time. Plain RAG gave the most direct answers.",
  ],
  [
    "What others found",
    "Independent studies: plain RAG usually wins on single-fact lookups; graphs help on connect-the-dots and whole-collection questions. AI judges favour longer answers and whichever comes first; correcting for that shrank some reported wins to almost nothing.",
  ],
  [
    "What it costs",
    "A model call for every chunk and every community, before the first question. Microsoft's README: “GraphRAG indexing can be an expensive operation … start small.” Cheaper variants skip or defer the model work (FastGraphRAG, LazyGraphRAG).",
  ],
  [
    "Where to get it",
    "Open source: Microsoft graphrag (MIT, now in maintenance mode), LightRAG, HippoRAG, Neo4j GraphRAG, LlamaIndex PropertyGraphIndex. Managed: Bedrock Knowledge Bases with Neptune Analytics; Spanner Graph on Google Cloud. The cloud versions expand a vector search along graph links; they don't write community reports.",
  ],
];

export function WorthIt() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Is it worth it?"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {WORTH.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
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
        Consider GraphRAG when people keep asking big-picture or connect-the-dots questions over a
        fairly stable collection, and the answers are worth a bigger indexing bill. For fact
        lookups, hybrid search with a reranker is cheaper and usually better.
      </p>
      <p>
        Many systems route: local questions to normal RAG, global ones to the map (module 14&apos;s
        router idea again).
      </p>
    </StepLayout>
  );
}

/* 6 ─ Which tool? ------------------------------------------------------------------------------- */

export function WhichTool() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tool?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="graph-or-rag"
            prompt="Send each question to plain RAG or to a graph approach."
            categories={[
              { id: "rag", label: "Plain RAG" },
              { id: "graph", label: "Graph" },
            ]}
            items={[
              {
                id: "fee",
                label: "“What is the trade licence renewal fee?”",
                category: "rag",
                why: "One fact on one page: a local question.",
              },
              {
                id: "themes",
                label: "“What themes keep coming back in five years of grievances?”",
                category: "graph",
                why: "About the whole collection. No handful of passages holds the answer.",
              },
              {
                id: "contractors",
                label: "“Which contractors appear in complaints from more than one ward?”",
                category: "graph",
                why: "Connecting the dots across notes: exactly what shared entities in a graph show.",
              },
              {
                id: "drain",
                label: "“When was the Station Road drain first reported blocked?”",
                category: "rag",
                why: "A specific fact in one note.",
              },
            ]}
            explanation="Graph approaches earn their cost on whole-collection and connect-the-dots questions. For single facts, plain RAG is cheaper and usually more accurate."
          />
        </div>
      }
    >
      <p>Four questions a corporation officer might ask of the grievance archive.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Local vs global", "RAG fetches passages; big-picture questions need the whole collection."],
  ["Build a map first", "Entities, relationships, communities, reports: all before any question."],
  ["Map, then reduce", "Each report offers points; the best are combined into one answer."],
  ["Pay only when needed", "Indexing is expensive; route fact lookups to plain RAG."],
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
        Next: letting the model decide for itself what to search for, and when it has found enough,
        with agentic RAG.
      </p>
    </StepLayout>
  );
}
