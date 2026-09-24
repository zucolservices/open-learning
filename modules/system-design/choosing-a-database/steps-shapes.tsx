"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Code } from "@/toolkit/controls/stepper";
import { cn } from "@/lib/cn";
import type { DbState } from "./state";

/* 1 ─ One business, eight shapes of data ⭐ ------------------------------------------------------- */

const FAMILIES: {
  id: string;
  name: string;
  like: string;
  sample: string;
  great: string;
  weak: string;
}[] = [
  {
    id: "relational",
    name: "Relational",
    like: "A filing cabinet of tidy tables, cross-referenced",
    sample:
      "orders(id, customer_id, total)\ncustomers(id, name, city)\n\nSELECT c.city, SUM(o.total)\nFROM orders o JOIN customers c ON c.id = o.customer_id\nGROUP BY c.city;",
    great: "Transactions across many rows, joins, any question you think of later.",
    weak: "Scaling writes beyond one big machine takes work (or distributed SQL).",
  },
  {
    id: "kv",
    name: "Key-value",
    like: "A coat check: hand over a ticket, get the coat",
    sample: 'GET session:7f3a  →  {"user": 88, "cart": [12, 40]}\nSET session:7f3a ... EX 1800',
    great: "Enormous volumes of lookups by key, in milliseconds or less.",
    weak: "Anything that isn't 'fetch by key': no ad-hoc queries.",
  },
  {
    id: "document",
    name: "Document",
    like: "A folder per order, everything about it inside",
    sample:
      '{ "_id": "A-10492", "customer": { "id": 88, "city": "Pune" },\n  "items": [ { "sku": "latte", "qty": 2 } ], "total": 360 }',
    great: "Records read and written whole; fields that vary between records.",
    weak: "Joins across documents and multi-document transactions are harder.",
  },
  {
    id: "wide",
    name: "Wide-column",
    like: "A ledger per store, rows sorted by time",
    sample:
      "PRIMARY KEY ((store_id), order_time)\n-- all of one store's orders together, newest first",
    great: "Huge write volumes spread across many machines; known access patterns.",
    weak: "You design tables around your queries up front; new questions need new tables.",
  },
  {
    id: "graph",
    name: "Graph",
    like: "A map of who knows whom",
    sample:
      "(:Customer {id: 88})-[:BOUGHT]->(:Coffee {name: 'Latte'})\n  <-[:BOUGHT]-(:Customer)-[:BOUGHT]->(recommendation)",
    great: "Questions about relationships many hops deep: recommendations, fraud rings.",
    weak: "Bulk aggregation over everything; fewer people know the query languages.",
  },
  {
    id: "timeseries",
    name: "Time-series",
    like: "A logbook: one reading after another",
    sample:
      "machine_temp,store=pune-3 value=92.4 1790000000\n-- then: average per minute, last 24 hours",
    great: "Streams of timestamped measurements; downsampling and time windows.",
    weak: "General-purpose records and updates.",
  },
  {
    id: "search",
    name: "Search",
    like: "The index at the back of a book",
    sample:
      'match: { name: { query: "caramel lattte", fuzziness: "AUTO" } }\n-- finds "Caramel Latte" despite the typo, ranked',
    great: "Full-text search, typo tolerance, ranking, facets.",
    weak: "Not a source of truth: usually a copy fed from the main database.",
  },
  {
    id: "vector",
    name: "Vector",
    like: "A map where similar things sit close together",
    sample:
      "SELECT name FROM coffees\nORDER BY embedding <-> embed('smooth, nutty, not too bitter')\nLIMIT 5;  -- pgvector",
    great: "Finding things similar in meaning: semantic search, recommendations, RAG.",
    weak: "Exact filtering and transactions; results are approximate by design.",
  },
];

export function EightShapes() {
  const [s, set] = useSceneState<DbState>();
  const f = FAMILIES.find((x) => x.id === s.family) ?? FAMILIES[0];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="One business, eight shapes of data"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {FAMILIES.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ family: x.id })}
                className={cn(
                  "rounded-xl border px-2.5 py-1.5 text-xs font-medium transition",
                  s.family === x.id
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-3"
            >
              <p className="text-muted text-sm">Think of it as: {f.like}.</p>
              <Code>{f.sample}</Code>
              <p className="border-good/40 bg-good/10 rounded-xl border px-3 py-2 text-sm">
                Great at: {f.great}
              </p>
              <p className="border-bad/40 bg-bad/10 rounded-xl border px-3 py-2 text-sm">
                Struggles with: {f.weak}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        A kitchen has knives, a blender and an oven. None is &ldquo;the best tool&rdquo;; each is
        best at something. Databases are the same: each family is shaped around certain questions.
      </p>
      <p>Click through the families and see Brewline&apos;s data in each shape.</p>
      <p className="text-muted text-sm">
        Many products span several families (DynamoDB is key-value and document; Spanner is
        relational, graph and vector). Learn the shapes; products mix them.
      </p>
    </StepLayout>
  );
}
