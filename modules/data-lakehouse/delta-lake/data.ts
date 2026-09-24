/**
 * The one table this module follows: `orders`, through six commits.
 * Every visual (explorer, slider, history, VACUUM) is derived from here,
 * so the story stays consistent from step to step.
 */

export interface Row {
  order_id: number;
  customer: string;
  amount: number;
  status: "paid" | "open";
}

export interface DataFile {
  id: string;
  path: string;
  rows: Row[];
  /** Version whose commit created the file. */
  createdIn: number;
}

export interface Commit {
  version: number;
  operation: string;
  /** Short human description of the predicate or parameters. */
  params?: string;
  /** operationParameters as written in commitInfo. */
  opParams?: Record<string, string>;
  user: string;
  /** ISO timestamp, displayed in history. */
  at: string;
  /** Day number since the table was created (used by the VACUUM simulation). */
  day: number;
  add: string[];
  remove: string[];
  /** false for OPTIMIZE: files changed, data did not. */
  dataChange: boolean;
  /** One-line narration of what the commit did. */
  story: string;
}

const r = (order_id: number, customer: string, amount: number, status: Row["status"]): Row => ({
  order_id,
  customer,
  amount,
  status,
});

export const FILES: Record<string, DataFile> = {
  f1: {
    id: "f1",
    path: "part-00000-1a2b7c3d-c000.snappy.parquet",
    rows: [r(1001, "Asha", 420, "paid"), r(1002, "Ben", 95, "paid")],
    createdIn: 0,
  },
  f2: {
    id: "f2",
    path: "part-00001-4e5f6a7b-c000.snappy.parquet",
    rows: [r(1003, "Chen", 310, "open"), r(1004, "Dev", 780, "paid")],
    createdIn: 0,
  },
  f3: {
    id: "f3",
    path: "part-00000-8c9d0e1f-c000.snappy.parquet",
    rows: [r(1005, "Elif", 150, "open"), r(1006, "Farah", 260, "paid")],
    createdIn: 1,
  },
  f4: {
    id: "f4",
    path: "part-00000-2b3c4d5e-c000.snappy.parquet",
    rows: [r(1003, "Chen", 310, "paid"), r(1004, "Dev", 780, "paid")],
    createdIn: 2,
  },
  f5: {
    id: "f5",
    path: "part-00000-6f7a8b9c-c000.snappy.parquet",
    rows: [r(1001, "Asha", 420, "paid")],
    createdIn: 3,
  },
  f6: {
    id: "f6",
    path: "part-00000-0d1e2f3a-c000.snappy.parquet",
    rows: [r(1001, "Asha", 0, "paid"), r(1003, "Chen", 0, "paid"), r(1004, "Dev", 0, "paid")],
    createdIn: 4,
  },
  f7: {
    id: "f7",
    path: "part-00001-4b5c6d7e-c000.snappy.parquet",
    rows: [r(1005, "Elif", 0, "open"), r(1006, "Farah", 0, "paid")],
    createdIn: 4,
  },
  f8: {
    id: "f8",
    path: "part-00000-9f0a1b2c-c000.snappy.parquet",
    rows: [
      r(1001, "Asha", 0, "paid"),
      r(1003, "Chen", 0, "paid"),
      r(1004, "Dev", 0, "paid"),
      r(1005, "Elif", 0, "open"),
      r(1006, "Farah", 0, "paid"),
    ],
    createdIn: 5,
  },
};

export const FILE_IDS = Object.keys(FILES);

export const COMMITS: Commit[] = [
  {
    version: 0,
    operation: "CREATE TABLE AS SELECT",
    user: "etl_job",
    at: "2026-09-14T09:00:00Z",
    day: 0,
    add: ["f1", "f2"],
    remove: [],
    dataChange: true,
    story: "The table is created with four orders in two files.",
  },
  {
    version: 1,
    operation: "WRITE",
    params: "mode: Append",
    opParams: { mode: "Append", partitionBy: "[]" },
    user: "etl_job",
    at: "2026-09-15T09:00:00Z",
    day: 1,
    add: ["f3"],
    remove: [],
    dataChange: true,
    story: "Two new orders arrive and are appended as a new file.",
  },
  {
    version: 2,
    operation: "UPDATE",
    params: "predicate: order_id = 1003",
    opParams: { predicate: '["(order_id = 1003)"]' },
    user: "analyst_1",
    at: "2026-09-16T11:30:00Z",
    day: 2,
    add: ["f4"],
    remove: ["f2"],
    dataChange: true,
    story:
      "Order 1003 is marked paid. Its whole file is rewritten; the old file is removed from the table.",
  },
  {
    version: 3,
    operation: "DELETE",
    params: "predicate: order_id = 1002",
    opParams: { predicate: '["(order_id = 1002)"]' },
    user: "analyst_2",
    at: "2026-09-17T10:15:00Z",
    day: 3,
    add: ["f5"],
    remove: ["f1"],
    dataChange: true,
    story: "Order 1002 is deleted. The file that held it is rewritten without it.",
  },
  {
    version: 4,
    operation: "UPDATE",
    params: "predicate: (none) · set amount = 0",
    opParams: { predicate: "[]" },
    user: "intern_dev",
    at: "2026-09-24T14:02:00Z",
    day: 10,
    add: ["f6", "f7"],
    remove: ["f3", "f4", "f5"],
    dataChange: true,
    story: "An UPDATE without a WHERE clause sets every amount to 0. Every file is rewritten.",
  },
  {
    version: 5,
    operation: "OPTIMIZE",
    params: "compaction",
    opParams: { predicate: "[]" },
    user: "maintenance_job",
    at: "2026-09-24T14:30:00Z",
    day: 10,
    add: ["f8"],
    remove: ["f6", "f7"],
    dataChange: false,
    story:
      "Scheduled maintenance compacts two small files into one. The (broken) data is unchanged.",
  },
];

/** The commit the learner creates in the "fix the incident" step. */
export const RESTORE_COMMIT: Commit = {
  version: 6,
  operation: "RESTORE",
  params: "version: 3",
  opParams: { version: "3" },
  user: "you",
  at: "2026-09-24T15:10:00Z",
  day: 10,
  add: ["f3", "f4", "f5"],
  remove: ["f8"],
  dataChange: true,
  story:
    "RESTORE writes a new commit that brings back the files of version 3. History is kept, not rewritten.",
};

export type FileState = "live" | "added" | "removed" | "storage" | "future";

/** Replay commits 0..version: which files make up the table. */
export function liveFiles(version: number, commits: Commit[] = COMMITS): Set<string> {
  const live = new Set<string>();
  for (const c of commits.slice(0, version + 1)) {
    c.remove.forEach((f) => live.delete(f));
    c.add.forEach((f) => live.add(f));
  }
  return live;
}

/** State of every file at a version, relative to that version's commit. */
export function fileStates(
  version: number,
  commits: Commit[] = COMMITS,
): Record<string, FileState> {
  const live = liveFiles(version, commits);
  const commit = commits[version];
  const out: Record<string, FileState> = {};
  for (const id of FILE_IDS) {
    if (FILES[id].createdIn > version) out[id] = "future";
    else if (commit.add.includes(id) && live.has(id)) out[id] = "added";
    else if (live.has(id)) out[id] = "live";
    else if (commit.remove.includes(id)) out[id] = "removed";
    else out[id] = "storage";
  }
  return out;
}

export function rowsAt(version: number, commits: Commit[] = COMMITS): Row[] {
  return [...liveFiles(version, commits)]
    .flatMap((f) => FILES[f].rows)
    .sort((a, b) => a.order_id - b.order_id);
}

export const logName = (v: number) => `${String(v).padStart(20, "0")}.json`;
export const shortLog = (v: number) => `…${String(v).padStart(5, "0")}.json`;

/* ------------------------------------------------------------------ */
/* Commit JSON, shaped like the real _delta_log actions               */
/* ------------------------------------------------------------------ */

export type ActionType = "commitInfo" | "protocol" | "metaData" | "add" | "remove";

export interface Action {
  type: ActionType;
  body: Record<string, unknown>;
}

const ms = (iso: string) => Date.parse(iso);

function stats(rows: Row[]) {
  const ids = rows.map((x) => x.order_id);
  const amounts = rows.map((x) => x.amount);
  return JSON.stringify({
    numRecords: rows.length,
    minValues: { order_id: Math.min(...ids), amount: Math.min(...amounts) },
    maxValues: { order_id: Math.max(...ids), amount: Math.max(...amounts) },
    nullCount: { order_id: 0, customer: 0, amount: 0, status: 0 },
  });
}

const SCHEMA =
  '{"type":"struct","fields":[{"name":"order_id","type":"long",…},{"name":"customer","type":"string",…},{"name":"amount","type":"long",…},{"name":"status","type":"string",…}]}';

export function commitActions(c: Commit): Action[] {
  const actions: Action[] = [
    {
      type: "commitInfo",
      body: {
        timestamp: ms(c.at),
        operation: c.operation,
        ...(c.opParams ? { operationParameters: c.opParams } : {}),
        ...(c.version > 0 ? { readVersion: c.version - 1 } : {}),
        isBlindAppend: c.remove.length === 0,
      },
    },
  ];
  if (c.version === 0) {
    actions.push(
      { type: "protocol", body: { minReaderVersion: 1, minWriterVersion: 2 } },
      {
        type: "metaData",
        body: {
          id: "5f1c9a8e-3b2d-4c6e-9f10-a1b2c3d4e5f6",
          format: { provider: "parquet", options: {} },
          schemaString: SCHEMA,
          partitionColumns: [],
          configuration: {},
          createdTime: ms(c.at),
        },
      },
    );
  }
  for (const f of c.remove) {
    actions.push({
      type: "remove",
      body: { path: FILES[f].path, deletionTimestamp: ms(c.at), dataChange: c.dataChange },
    });
  }
  for (const f of c.add) {
    actions.push({
      type: "add",
      body: {
        path: FILES[f].path,
        partitionValues: {},
        size: 900 + FILES[f].rows.length * 120,
        modificationTime: ms(c.at),
        dataChange: c.dataChange,
        stats: stats(FILES[f].rows),
      },
    });
  }
  return actions;
}

export const actionMeaning: Record<ActionType, string> = {
  commitInfo:
    "Provenance: when, which operation, and which version the writer started from. It doesn't change the table; tools like DESCRIBE HISTORY read it.",
  protocol:
    "The minimum reader and writer versions needed to understand this table. An engine that is too old must refuse to read or write it.",
  metaData:
    "The table's identity: its id, schema, partition columns and configuration. The latest metaData action wins.",
  add: "This Parquet file is now part of the table. It carries statistics (row count, min/max per column) that engines use to skip files.",
  remove:
    "This file is no longer part of the table. It is NOT deleted from storage, so older versions can still read it until VACUUM.",
};
