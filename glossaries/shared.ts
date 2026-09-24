import type { GlossaryEntry } from "./types";

/**
 * General terms used across many tracks (SQL, JSON, transactions…). Kept
 * small on purpose: anything specific to one track belongs in that track's
 * glossary, so each track can define words in its own context.
 */
export const shared = {
  atomic: {
    term: "Atomic",
    definition:
      "All or nothing. An atomic change either happens completely or not at all, and nobody ever sees it half done.",
    analogy:
      "Handing over a sealed envelope: the other person has it or doesn't. There's no half-handed envelope.",
    track: "data-lakehouse",
    module: "object-storage",
  },
  csv: {
    term: "CSV",
    definition:
      "Comma-separated values: plain text, one row per line. Easy to read, slow and large for analytics, and no schema.",
    track: "data-lakehouse",
    module: "file-formats",
  },
  json: {
    term: "JSON",
    definition:
      'A text format of nested key-value objects, like {"id": 7}. Common for app events and APIs, and used by Delta\'s transaction log.',
    track: "data-lakehouse",
    module: "file-formats",
  },
  schema: {
    term: "Schema",
    definition:
      "The structure of a table: its column names and types, such as order_id: long, amount: decimal.",
    track: "data-lakehouse",
    module: "schema-evolution",
  },
  metadata: {
    term: "Metadata",
    definition:
      "Data about data: which files exist, their schema, sizes and statistics. Engines read metadata first to plan work.",
    track: "data-lakehouse",
    module: "what-makes-a-table",
  },
  transaction: {
    term: "Transaction",
    definition: "A group of changes that succeeds or fails as one unit.",
    analogy: "A money transfer: debit one account and credit the other, or do neither.",
    track: "data-lakehouse",
    module: "acid-and-concurrency",
  },
  acid: {
    term: "ACID",
    definition:
      "Four guarantees for transactions: Atomic (all or nothing), Consistent (rules hold), Isolated (concurrent work doesn't interfere), Durable (once done, it stays done).",
    track: "data-lakehouse",
    module: "acid-and-concurrency",
  },
  batch: {
    term: "Batch processing",
    definition: "Processing data in scheduled chunks, such as every night or every hour.",
    track: "data-lakehouse",
    module: "ingestion",
  },
  streaming: {
    term: "Streaming",
    definition: "Processing data continuously as it arrives, within seconds or minutes.",
    track: "data-lakehouse",
    module: "ingestion",
  },
  idempotent: {
    term: "Idempotent",
    definition:
      "Safe to run twice: running the job again gives the same result instead of duplicating data.",
    track: "data-lakehouse",
    module: "medallion",
  },
  sql: {
    term: "SQL",
    definition: "The standard language for querying tables: SELECT … FROM … WHERE …",
    track: "data-lakehouse",
    module: "hands-on-sql",
  },
} satisfies Record<string, GlossaryEntry>;
