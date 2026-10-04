"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DOC, KV, PATTERNS, REL, RELS, RESULTS, type Pattern, type Shape } from "./model";
import type { NoState } from "./state";

/* 1 ─ Pack for the trip you're taking ------------------------------------------------------------- */

export function Lunchbox() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Pack for the trip you're taking"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "The well-organised house",
              "Every kind of thing in its own cupboard. Whatever you need, you can find it, but a picnic means visiting six cupboards.",
            ],
            [
              "The picnic basket",
              "Packed for one trip: everything for lunch in one place. Perfect for the picnic; useless for fixing the boiler.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-4"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A relational model is the well-organised house: each fact in its place, ready for any
        question. Many NoSQL databases ask you to pack the basket instead, shaped around the trips
        you know you&apos;ll take.
      </p>
      <p>
        AWS says it plainly: you shouldn&apos;t start designing a DynamoDB schema &ldquo;until you
        know the questions it will need to answer&rdquo;. That&apos;s{" "}
        <Term id="access-pattern">access-pattern</Term>
        -first design.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One dataset, three shapes ⭐ ---------------------------------------------------------------- */

export function ThreeShapes() {
  const [s, set] = useSceneState<NoState>();
  const shapes: [Shape, string][] = [
    ["rel", "Relational"],
    ["doc", "Document (MongoDB)"],
    ["kv", "Key-value (DynamoDB)"],
  ];
  const r = RESULTS[s.shape][s.pattern];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One dataset, three shapes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {shapes.map(([k, l]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.shape === k}
                onClick={() => set({ shape: k })}
                className={cn(
                  "rounded-md border px-3 py-1 text-xs",
                  s.shape === k ? "border-accent bg-accent-soft font-semibold" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <motion.div key={s.shape} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {s.shape === "kv" ? (
              <div className="border-line overflow-x-auto rounded-lg border font-mono text-[10px]">
                <div className="bg-surface-2 grid min-w-[38rem] grid-cols-[7rem_11rem_1fr] gap-2 px-2 py-1 font-semibold">
                  <span>PK</span>
                  <span>SK</span>
                  <span>attributes</span>
                </div>
                {KV.map(([pk, sk, a]) => {
                  const hit =
                    (s.pattern === "order" && pk === "ORDER#O-1") ||
                    (s.pattern === "history" && pk === "CUST#C-17" && sk.startsWith("ORDER#")) ||
                    (s.pattern === "menu" && pk === "REST#R-5");
                  return (
                    <div
                      key={pk + sk}
                      className={cn(
                        "border-line grid min-w-[38rem] grid-cols-[7rem_11rem_1fr] gap-2 border-t px-2 py-0.5",
                        hit && "bg-accent-soft",
                      )}
                    >
                      <span>{pk}</span>
                      <span>{sk}</span>
                      <span className="text-muted whitespace-nowrap">{a}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Code>{s.shape === "rel" ? REL : DOC}</Code>
            )}
          </motion.div>
          <div className="flex flex-col gap-1">
            {(Object.keys(PATTERNS) as Pattern[]).map((p) => {
              const x = RESULTS[s.shape][p];
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={s.pattern === p}
                  onClick={() => set({ pattern: p })}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                    s.pattern === p ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  )}
                >
                  <span>{PATTERNS[p]}</span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[11px]",
                      x.ok === "good" ? "text-good" : x.ok === "ok" ? "text-accent" : "text-bad",
                    )}
                  >
                    {x.cost}
                  </span>
                </button>
              );
            })}
          </div>
          <motion.p
            key={s.shape + s.pattern}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted text-xs"
          >
            {r.how}
          </motion.p>
        </div>
      }
    >
      <p>
        The same food-delivery data, shaped three ways. Try each access pattern against each shape,
        especially the last one, which nobody planned for.
      </p>
      <p>
        The key-value design answers every planned question in one request, because related items
        share a partition key. But an unplanned question has no key to use. The relational model
        handles anything, at the cost of joins.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Embed or reference? ------------------------------------------------------------------------- */

export function EmbedOrRef() {
  const [s, set] = useSceneState<NoState>();
  const r = RELS.find((x) => x.id === s.rel) ?? RELS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Embed or reference?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            {RELS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.rel === x.id}
                onClick={() => set({ rel: x.id })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.rel === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-xs",
              r.embed ? "border-viz-data bg-viz-data/10" : "border-viz-meta bg-viz-meta/10",
            )}
          >
            <p className="text-sm font-semibold">{r.embed ? "Embed it" : "Reference it"}</p>
            <p className="text-muted mt-0.5">{r.why}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        MongoDB&apos;s core principle: &ldquo;data that&apos;s accessed together should be stored
        together.&rdquo; <Term id="embedding">Embedding</Term> puts related data inside one document
        (a denormalised model, read in one operation). <Term id="referencing">Referencing</Term>{" "}
        stores an id and keeps the data in another collection (normalised).
      </p>
      <p>
        Embed what&apos;s contained, bounded and read together; reference what grows without limit,
        is many-to-many, or is looked up on its own.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Single-table design ------------------------------------------------------------------------- */

export function SingleTable() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Single-table design"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [
                "Why",
                "Items with the same partition key (an item collection) live together, so one request fetches a customer and their orders.",
              ],
              [
                "How",
                "List every access pattern first, then design partition and sort keys (and secondary indexes) so each is one query.",
              ],
              [
                "The catch",
                "AWS warns the learning curve is steep, because the design runs against relational habits.",
              ],
              [
                "Not compulsory",
                "AWS also calls multiple tables “good and sufficient” when entities aren't queried together.",
              ],
            ].map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted mt-0.5">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        <Term id="single-table-design">Single-table design</Term> stores several entity types
        (customers, orders, items) in one DynamoDB table, with keys like <code>CUST#C-17</code> and{" "}
        <code>ORDER#2026-09-02#O-1</code> chosen so sort order does the work.
      </p>
      <p>
        NoSQL doesn&apos;t mean no model. It means the model is built around the queries rather than
        the data alone.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Embed or reference: you decide -------------------------------------------------------------- */

export function EmbedSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Embed or reference: you decide"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="embed-or-ref"
            prompt="In a document database, embed or reference?"
            categories={[
              { id: "embed", label: "Embed" },
              { id: "ref", label: "Reference" },
            ]}
            items={[
              {
                id: "items",
                label: "A shopping cart's items",
                category: "embed",
                why: "Contained and read together.",
              },
              {
                id: "comments",
                label: "Every comment ever on a viral post",
                category: "ref",
                why: "Unbounded growth.",
              },
              {
                id: "author",
                label: "The author of a blog post, who has a profile of their own",
                category: "ref",
                why: "Exists and is queried independently.",
              },
              {
                id: "phones",
                label: "A contact's two or three phone numbers",
                category: "embed",
                why: "Small, bounded, read with the contact.",
              },
              {
                id: "courses",
                label: "Students and the courses they take",
                category: "ref",
                why: "Many-to-many.",
              },
            ]}
            explanation="Embed bounded data you read together; reference unbounded, many-to-many or independently queried data."
          />
        </div>
      }
    >
      <p>Sort the relationships.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Questions first", "List access patterns before designing keys."],
  ["Together if read together", "Embed or share a partition key."],
  ["Reference the unbounded", "And the many-to-many and the independent."],
  ["Single-table is optional", "Powerful, but steep; multi-table is fine too."],
  ["Unplanned questions cost", "Add an index, or keep a relational copy for analysis."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: graph models, where the relationships themselves are the data.</p>
    </StepLayout>
  );
}
