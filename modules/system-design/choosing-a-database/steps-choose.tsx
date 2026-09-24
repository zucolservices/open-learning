"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PlatformBuilder, type ServiceOption, type Slot } from "@/toolkit/builders/slot-builder";
import { Term } from "@/toolkit/glossary/term";
import type { DbState } from "./state";

/* 2 ─ Match the workload ⭐ ----------------------------------------------------------------------- */

const SLOTS: Slot[] = [
  {
    id: "ledger",
    layer: "Payments ledger",
    need: "Money moves between accounts; every transfer all-or-nothing; monthly reports",
  },
  {
    id: "sessions",
    layer: "Sessions and carts",
    need: "Millions of reads a second, always by session ID",
  },
  {
    id: "catalogue",
    layer: "Product catalogue",
    need: "Each product has different attributes; read and written as a whole",
  },
  {
    id: "sensors",
    layer: "Coffee machine sensors",
    need: "10,000 machines report temperature every second; charts by hour and day",
  },
  {
    id: "fraud",
    layer: "Fraud rings",
    need: "Find accounts linked through shared phones, cards and devices, several hops deep",
  },
  { id: "search", layer: "Menu search", need: "Typo-tolerant, ranked search over the menu" },
  {
    id: "similar",
    layer: "“Coffees like this one”",
    need: "Recommend by similarity of taste descriptions",
  },
  {
    id: "inventory",
    layer: "Global stock",
    need: "Stock counts correct across three regions, even under concurrent orders",
  },
];

const OPTIONS: ServiceOption[] = [
  {
    id: "relational",
    name: "Relational (PostgreSQL, MySQL)",
    blurb: "ACID transactions and SQL across related tables.",
    fits: ["ledger"],
    whyNot: {
      inventory:
        "A single relational primary lives in one region; strong consistency across three regions needs distributed SQL.",
    },
  },
  {
    id: "kv",
    name: "Key-value (Redis/Valkey, DynamoDB)",
    blurb: "fast lookups by key at huge volume.",
    fits: ["sessions"],
    whyNot: {
      ledger: "No multi-account transactions or reporting queries worth the name.",
      catalogue: "Works, but you lose querying by attributes; a document store fits better.",
    },
  },
  {
    id: "document",
    name: "Document (MongoDB, Firestore)",
    blurb: "flexible, self-contained records.",
    fits: ["catalogue"],
    whyNot: {
      ledger:
        "Possible with multi-document transactions, but relational databases were built for exactly this.",
    },
  },
  {
    id: "timeseries",
    name: "Time-series (TimescaleDB, InfluxDB)",
    blurb: "timestamped measurements, windows and downsampling.",
    fits: ["sensors"],
  },
  {
    id: "wide",
    name: "Wide-column (Cassandra, Bigtable)",
    blurb: "massive writes on known access patterns.",
    fits: ["sensors"],
  },
  {
    id: "graph",
    name: "Graph (Neo4j, Neptune)",
    blurb: "relationships many hops deep.",
    fits: ["fraud"],
    whyNot: { sessions: "Graphs are for relationships, not simple lookups." },
  },
  {
    id: "search",
    name: "Search (OpenSearch, Elasticsearch)",
    blurb: "full-text search with ranking and typos.",
    fits: ["search"],
    whyNot: { ledger: "Search engines are copies for finding things, not the source of truth." },
  },
  {
    id: "vector",
    name: "Vector (pgvector, Pinecone, Qdrant)",
    blurb: "nearest neighbours by meaning.",
    fits: ["similar"],
    whyNot: {
      search:
        "Vector search finds meaning, but typo-tolerant keyword ranking is a search engine's job (many systems combine both).",
    },
  },
  {
    id: "dsql",
    name: "Distributed SQL (Spanner, CockroachDB)",
    blurb: "SQL transactions across machines and regions.",
    fits: ["inventory", "ledger"],
  },
];

export function MatchWorkload() {
  const [s, set] = useSceneState<DbState>();
  return (
    <StepLayout
      eyebrow="Build it"
      title="Match the workload"
      stage={
        <PlatformBuilder
          slots={SLOTS}
          options={OPTIONS}
          value={s.picks}
          active={s.active}
          onSelectSlot={(id) => set({ active: id })}
          onPick={(slot, option) => {
            const picks = { ...s.picks, [slot]: option };
            const right = OPTIONS.find((o) => o.id === option)?.fits.includes(slot);
            const nextEmpty = SLOTS.find((x) => !picks[x.id]);
            set({ picks, active: right && nextEmpty ? nextEmpty.id : slot });
          }}
          doneText="Eight workloads, several database families. Using more than one kind of database, each for what it's best at, is called polyglot persistence."
        />
      }
    >
      <p>Brewline has eight kinds of data. Pick the family that fits each job.</p>
      <p className="text-muted text-sm">
        Some jobs have more than one good answer: sensor readings suit time-series or wide-column
        stores; a ledger suits a relational or a distributed SQL database.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: where to start ------------------------------------------------------------------ */

export function StartCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where would you start?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="where-to-start"
            prompt="A five-person startup needs orders, product search and 'similar coffees' recommendations, for a few thousand users. What's a sensible starting point?"
            options={[
              {
                id: "postgres",
                label:
                  "One PostgreSQL database: tables for orders, JSON columns for varying attributes, built-in full-text search, and pgvector for similarity. Split out specialised stores when a real limit appears",
                correct: true,
                feedback:
                  "Right. One well-understood database covers a lot at this size, and every extra database is another system to run, back up and keep in sync.",
              },
              {
                id: "four",
                label:
                  "Four databases from day one: PostgreSQL, MongoDB, Elasticsearch and Pinecone",
                feedback:
                  "Each is good at its job, but five people would spend their time keeping four systems in sync.",
              },
              {
                id: "nosql",
                label: "A NoSQL database, because it scales better",
                feedback:
                  "Scaling isn't the problem at a few thousand users, and they'd lose transactions and flexible queries.",
              },
              {
                id: "vector",
                label: "A vector database for everything, since AI is central",
                feedback:
                  "Vector search handles one job; orders need transactions and exact queries.",
              },
            ]}
            explanation="Polyglot persistence is powerful at scale and expensive to run. Start simple; add a specialised store when you can name the limit it removes."
          />
        </div>
      }
    >
      <p>
        The opposite trap to choosing badly: choosing too many. Using several databases is called{" "}
        <Term id="polyglot-persistence">polyglot persistence</Term>.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Read the fine print ------------------------------------------------------------------------ */

const FINE: [string, string][] = [
  [
    "DynamoDB items: 400 KB",
    "Including attribute names. Store big things (images, documents) elsewhere and keep a pointer.",
  ],
  [
    "DynamoDB transactions: 100 items, 4 MB",
    "And ACID only within one Region, not across global-table replicas.",
  ],
  ["MongoDB documents: 16 MiB", "Larger files go in GridFS or object storage."],
  [
    "Cassandra writes are cheap, reads cost more",
    "Writes append to a log and memory (an LSM tree); reads may check several files until compaction merges them.",
  ],
  [
    "Search and vector stores are copies",
    "Feed them from the source of truth, and plan for them to lag behind it.",
  ],
  [
    "“Single-digit millisecond” is a typical, not a guarantee",
    "Latency depends on item size, consistency level and your access pattern.",
  ],
];

export function FinePrint() {
  return (
    <StepLayout
      eyebrow="Before you commit"
      title="Read the fine print"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {FINE.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="font-mono text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every database has limits that shape your design. Find them before you&apos;re committed.
      </p>
    </StepLayout>
  );
}
