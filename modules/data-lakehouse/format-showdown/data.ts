/** What each format writes for the same three operations (file names shortened). */

export type FormatId = "delta" | "iceberg" | "hudi";
export type FileKind = "data" | "log" | "meta" | "delete" | "pointer";

export const FORMATS: { id: FormatId; name: string }[] = [
  { id: "delta", name: "Delta" },
  { id: "iceberg", name: "Iceberg" },
  { id: "hudi", name: "Hudi" },
];

export interface SimFile {
  path: string;
  kind: FileKind;
  /** Operation index that wrote it (-1 = table creation). */
  op: number;
  /** Still in storage, but no longer part of the current table. */
  gone?: boolean;
  /** Shown instead of the file name (the catalog pointer). */
  label?: string;
  note?: string;
}

export interface SimOptions {
  deltaDv: boolean;
  icebergMode: "cow" | "mor";
  hudiType: "cow" | "mor";
}

export const OPS = [
  {
    id: "insert",
    label: "INSERT",
    sql: "INSERT INTO orders SELECT * FROM new_orders;   -- 100 rows",
    takeaway:
      "All three wrote one Parquet data file, much the same in each. Then each recorded it in its own way: Delta appended a log entry; Iceberg wrote a manifest, a manifest list and a metadata file, then swapped the catalog pointer; Hudi completed a commit on its timeline.",
  },
  {
    id: "update",
    label: "UPDATE",
    sql: "UPDATE orders SET status = 'refunded' WHERE order_id = 1042;",
    takeaway:
      "No format edited a file. Rewriting the whole file (copy-on-write) is the default in all three. Deletion vectors, Iceberg merge-on-read and Hudi log files record the change separately instead: less writing now, a little more work for readers. Struck-through files stay in storage for time travel until clean-up.",
  },
  {
    id: "alter",
    label: "ADD COLUMN",
    sql: "ALTER TABLE orders ADD COLUMN coupon STRING;",
    takeaway:
      "A schema change writes no data at all: a new Delta log entry with a metaData action, a new Iceberg metadata file (with no new snapshot), and an empty Hudi commit carrying the new schema. Old files simply read the new column as null.",
  },
];

function delta(ops: number, o: SimOptions): SimFile[] {
  const f: SimFile[] = [
    {
      path: "_delta_log/000…0000.json",
      kind: "meta",
      op: -1,
      note: "protocol + metaData: table created",
    },
  ];
  if (ops >= 1) {
    f.push(
      { path: "part-00000-a1f3.snappy.parquet", kind: "data", op: 0 },
      { path: "_delta_log/000…0001.json", kind: "meta", op: 0, note: "commitInfo + add" },
    );
  }
  if (ops >= 2) {
    if (o.deltaDv) {
      f.push(
        {
          path: "deletion_vector_4b9e.bin",
          kind: "delete",
          op: 1,
          note: "marks row 41 of part-00000 as deleted",
        },
        {
          path: "part-00001-7c2e.snappy.parquet",
          kind: "data",
          op: 1,
          note: "just the updated row",
        },
      );
    } else {
      f[1].gone = true;
      f.push({
        path: "part-00001-7c2e.snappy.parquet",
        kind: "data",
        op: 1,
        note: "all 100 rows, rewritten",
      });
    }
    f.push({ path: "_delta_log/000…0002.json", kind: "meta", op: 1, note: "remove + add" });
  }
  if (ops >= 3)
    f.push({ path: "_delta_log/000…0003.json", kind: "meta", op: 2, note: "metaData: new schema" });
  return f;
}

function iceberg(ops: number, o: SimOptions): SimFile[] {
  const version = ops === 0 ? 0 : ops;
  const f: SimFile[] = [
    { path: "metadata/00000-5e1d.metadata.json", kind: "meta", op: -1, note: "table created" },
  ];
  if (ops >= 1) {
    f.push(
      { path: "data/00000-0-a1f3.parquet", kind: "data", op: 0 },
      { path: "metadata/a1f3-m0.avro", kind: "meta", op: 0, note: "manifest" },
      { path: "metadata/snap-4127-a1f3.avro", kind: "meta", op: 0, note: "manifest list" },
      { path: "metadata/00001-9c0b.metadata.json", kind: "meta", op: 0 },
    );
  }
  if (ops >= 2) {
    if (o.icebergMode === "cow") {
      f[1].gone = true;
      f.push(
        { path: "data/00001-0-7c2e.parquet", kind: "data", op: 1, note: "all 100 rows, rewritten" },
        {
          path: "metadata/7c2e-m0.avro",
          kind: "meta",
          op: 1,
          note: "manifest: old file DELETED, new ADDED",
        },
      );
    } else {
      f.push(
        { path: "data/00001-0-7c2e.parquet", kind: "data", op: 1, note: "just the updated row" },
        {
          path: "data/7c2e-dv.puffin",
          kind: "delete",
          op: 1,
          note: "v3 deletion vector for 00000-0-a1f3",
        },
        { path: "metadata/7c2e-m0.avro", kind: "meta", op: 1, note: "data manifest" },
        { path: "metadata/7c2e-m1.avro", kind: "meta", op: 1, note: "delete manifest" },
      );
    }
    f.push(
      { path: "metadata/snap-6582-7c2e.avro", kind: "meta", op: 1, note: "manifest list" },
      { path: "metadata/00002-41aa.metadata.json", kind: "meta", op: 1 },
    );
  }
  if (ops >= 3) {
    f.push({
      path: "metadata/00003-d07f.metadata.json",
      kind: "meta",
      op: 2,
      note: "new schema, same snapshot",
    });
  }
  f.push({
    path: "(catalog pointer)",
    kind: "pointer",
    op: ops === 0 ? -1 : ops - 1,
    label: `catalog: orders → 0000${version}`,
  });
  return f;
}

function hudi(ops: number, o: SimOptions): SimFile[] {
  const action = o.hudiType === "cow" ? "commit" : "deltacommit";
  const f: SimFile[] = [
    { path: ".hoodie/hoodie.properties", kind: "meta", op: -1, note: "table config" },
  ];
  if (ops >= 1) {
    f.push(
      {
        path: "a41f_0-1-0_100000.parquet",
        kind: "data",
        op: 0,
        note: "base file of a new file group",
      },
      { path: `.hoodie/timeline/100000_100004.${action}`, kind: "meta", op: 0 },
    );
  }
  if (ops >= 2) {
    if (o.hudiType === "cow") {
      f[1].gone = true;
      f.push({
        path: "a41f_0-2-0_100500.parquet",
        kind: "data",
        op: 1,
        note: "new version of the same file group, all rows",
      });
    } else {
      f.push({
        path: ".a41f_100500.log.1_0-2-0",
        kind: "log",
        op: 1,
        note: "log file with the changed record",
      });
    }
    f.push({ path: `.hoodie/timeline/100500_100503.${action}`, kind: "meta", op: 1 });
  }
  if (ops >= 3) {
    f.push({
      path: `.hoodie/timeline/101000_101001.${action}`,
      kind: "meta",
      op: 2,
      note: "empty commit, operation ALTER_SCHEMA, new schema in its metadata",
    });
  }
  return f;
}

export function filesFor(format: FormatId, ops: number, o: SimOptions): SimFile[] {
  return format === "delta" ? delta(ops, o) : format === "iceberg" ? iceberg(ops, o) : hudi(ops, o);
}
