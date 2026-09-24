"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bot, Lock, ShieldAlert } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ServingState } from "./state";

/* 5 ─ An assistant on your documents ⭐ ----------------------------------------------------------- */

const PIPE = ["Documents", "Chunk", "Embed", "Vector index", "Retrieve", "LLM", "Answer"];

type Chunk = { id: string; doc: string; text: string; score: number; hr?: boolean; old?: boolean };

const CHUNKS: Record<ServingState["question"], Chunk[]> = {
  refund: [
    {
      id: "r-old",
      doc: "refund-policy.md (v1, last month)",
      text: "Customers can request a refund within 7 days of delivery.",
      score: 0.91,
      old: true,
    },
    {
      id: "r-new",
      doc: "refund-policy.md (v2, yesterday)",
      text: "Customers can request a refund within 14 days of delivery.",
      score: 0.91,
    },
    {
      id: "r-ticket",
      doc: "ticket #4412",
      text: "Agent approved a refund for a damaged grinder on day 5.",
      score: 0.74,
    },
  ],
  salary: [
    {
      id: "s-hr",
      doc: "hr/compensation-2026.xlsx",
      text: "Arjun Mehta, support lead: ₹18.4 lakh a year.",
      score: 0.88,
      hr: true,
    },
    {
      id: "s-org",
      doc: "team-directory.md",
      text: "Arjun Mehta leads the Bengaluru support team.",
      score: 0.71,
    },
  ],
};

export function RagLab() {
  const [s, set] = useSceneState<ServingState>();
  const allowed = (c: Chunk) => !c.hr || s.asker === "manager" || !s.acl;
  const current = (c: Chunk) => (s.sync ? c.id !== "r-old" : c.id !== "r-new");
  const hits = CHUNKS[s.question].filter(current).filter(allowed);
  const blocked = CHUNKS[s.question].filter(current).filter((c) => !allowed(c));

  let answer: string;
  let tone: "good" | "bad";
  if (s.question === "refund") {
    answer = s.sync
      ? "Customers have 14 days from delivery to request a refund."
      : "Customers have 7 days from delivery to request a refund.";
    tone = s.sync ? "good" : "bad";
  } else if (hits.some((c) => c.hr)) {
    answer = "Arjun Mehta earns ₹18.4 lakh a year.";
    tone = s.asker === "manager" ? "good" : "bad";
  } else {
    answer =
      "I can't find salary information in the documents you have access to. Arjun leads the Bengaluru support team.";
    tone = "good";
  }

  const problem =
    s.question === "refund" && !s.sync
      ? "Stale answer: the policy changed yesterday, but the index still holds last month's chunk. The embeddings were never recomputed."
      : s.question === "salary" && s.asker === "agent" && !s.acl
        ? "Leak: a support agent just read HR salary data. The files were locked down, but their chunks were copied into an index that doesn't know who may read them."
        : null;

  return (
    <StepLayout
      eyebrow="Serving AI"
      title="An assistant on your documents"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1">
            {PIPE.map((p, i) => (
              <span key={p} className="flex items-center gap-1">
                <span className="bg-surface-2 rounded-full px-2 py-0.5 text-[10px]">{p}</span>
                {i < PIPE.length - 1 && <span className="text-subtle text-[10px]">→</span>}
              </span>
            ))}
          </div>

          <div className="grid gap-2">
            <Segmented
              size="sm"
              value={s.question}
              options={[
                ["refund", "“How long do customers have for a refund?”"],
                ["salary", "“What does Arjun earn?”"],
              ]}
              onChange={(v) => set({ question: v as ServingState["question"] })}
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted text-xs">Asked by</span>
              <Segmented
                size="sm"
                value={s.asker}
                options={[
                  ["agent", "Support agent"],
                  ["manager", "HR manager"],
                ]}
                onChange={(v) => set({ asker: v as ServingState["asker"] })}
              />
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s.sync}
                  onChange={(e) => set({ sync: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                Re-embed changed documents (sync from a change feed)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s.acl}
                  onChange={(e) => set({ acl: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                Store who may read each chunk, and filter on it
              </label>
            </div>
          </div>

          <div>
            <p className="text-muted mb-1.5 text-xs">Retrieved chunks (most similar first)</p>
            <div className="grid gap-1.5">
              <AnimatePresence initial={false}>
                {hits.map((c) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs",
                      c.old || (c.hr && s.asker === "agent")
                        ? "border-bad/40 bg-bad/5"
                        : "border-line bg-surface",
                    )}
                  >
                    <span className="text-muted font-mono text-[10px]">
                      {c.doc} · similarity {c.score.toFixed(2)}
                    </span>
                    <p>{c.text}</p>
                  </motion.div>
                ))}
                {blocked.map((c) => (
                  <motion.p
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-subtle flex items-center gap-1.5 text-[11px]"
                  >
                    <Lock className="size-3" /> 1 matching chunk hidden: {c.doc} isn&apos;t shared
                    with support agents
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            key={answer + tone}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              tone === "good" ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            <p className="flex items-start gap-2 text-sm">
              <Bot className="text-accent mt-0.5 size-4 shrink-0" />
              {answer}
            </p>
            {problem && (
              <p className="text-bad mt-2 flex items-start gap-2 text-xs">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                {problem}
              </p>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Language models don&apos;t know your policies.{" "}
        <Term id="rag">Retrieval-augmented generation (RAG)</Term> fixes that: split documents into
        chunks, turn each into an <Term id="embedding">embedding</Term>, store them in a{" "}
        <Term id="vector-index">vector index</Term>, and at question time hand the most similar
        chunks to the model.
      </p>
      <p>
        The index is a copy of your data, so it inherits two classic data problems. Ask both
        questions, as both people, then switch the fixes on.
      </p>
      <p className="text-muted text-sm">
        Permissions don&apos;t follow data into an index by themselves. Databricks AI Search, for
        example, doesn&apos;t apply row filters or column masks: you store an access column with
        each chunk and filter on it for every query, or build one index per audience. Deleted
        documents need the same care, or their old chunks can still be retrieved.
      </p>
      <p className="text-muted text-sm">
        Illustrative: real similarity scores and answers vary by embedding model and LLM.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: route each consumer --------------------------------------------------------------- */

export function RouteCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Route each request"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="route"
            prompt="Which serving layer fits each request?"
            categories={[
              { id: "sql", label: "SQL + semantic layer" },
              { id: "tables", label: "Lakehouse tables" },
              { id: "online", label: "Online store" },
              { id: "vector", label: "Vector index" },
            ]}
            items={[
              {
                id: "cfo",
                label: "The CFO's daily revenue dashboard",
                category: "sql",
                why: "Governed metrics over gold tables, through a SQL engine.",
              },
              {
                id: "train",
                label: "Training a churn model on three years of customers",
                category: "tables",
                why: "Big historical scans with point-in-time joins: read the tables directly.",
              },
              {
                id: "checkout",
                label: "A discount decision at checkout, within 20 ms",
                category: "online",
                why: "One customer's features, looked up by key in milliseconds.",
              },
              {
                id: "bot",
                label: "A support bot answering from policy documents",
                category: "vector",
                why: "Finds the most relevant passages by meaning.",
              },
              {
                id: "adhoc",
                label: "An analyst asking “revenue by city last quarter” in plain English",
                category: "sql",
                why: "Text-to-SQL assistants (Genie, Cortex Analyst) work best grounded in semantic definitions plus curated examples.",
              },
            ]}
            explanation="Each layer is a copy or a view built from the same gold tables. Keep the tables the source of truth, and rebuild the layers from them."
          />
        </div>
      }
    >
      <p>Time to be the architect.</p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "One source, many layers",
    "Semantic layers, online stores and vector indexes are rebuilt from gold, never the source of truth.",
  ],
  ["Define metrics once", "A semantic layer stops every tool from inventing its own revenue."],
  [
    "Train on the past as it was",
    "Point-in-time joins prevent leakage; time travel makes training reproducible.",
  ],
  ["Milliseconds need a different store", "Copy features to an online store for live predictions."],
  [
    "Indexes are copies",
    "Keep embeddings fresh from change feeds, and carry permissions with them.",
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
      <p>That completes how data comes in, gets organised, and gets used.</p>
      <p>Next chapter: the same ideas on real platforms, starting with AWS.</p>
    </StepLayout>
  );
}
