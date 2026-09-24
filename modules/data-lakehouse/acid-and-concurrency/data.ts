/**
 * The conflict lab: two writers start from the same version; A commits first,
 * B commits second and must check A's commit. Rules follow Delta Lake's
 * documented conflict detection (table partitioned by date, no row-level
 * concurrency, no deletion vectors).
 */

export type Level = "serializable" | "writeserializable";
export const PARTITIONS = ["09-22", "09-23", "09-24"];

export interface Op {
  id: string;
  label: string;
  sql: string;
  /** Partitions whose files the operation reads to decide what to change. */
  reads: string[];
  /** Partitions where it adds files. */
  adds: string[];
  /** Partitions where it removes (rewrites) files. */
  removes: string[];
  /** A blind append: writes without reading the table. */
  blind?: boolean;
  /** Changes data (false for compaction, which only rearranges it). */
  dataChange: boolean;
  metadata?: boolean;
}

export const OPS: Op[] = [
  {
    id: "insert",
    label: "INSERT today's orders",
    sql: "INSERT INTO orders SELECT * FROM new_orders  -- all dated 09-24",
    reads: [],
    adds: ["09-24"],
    removes: [],
    blind: true,
    dataChange: true,
  },
  {
    id: "update-24",
    label: "UPDATE 09-24",
    sql: "UPDATE orders SET status = 'paid' WHERE date = '2026-09-24' AND …",
    reads: ["09-24"],
    adds: ["09-24"],
    removes: ["09-24"],
    dataChange: true,
  },
  {
    id: "update-23",
    label: "UPDATE 09-23",
    sql: "UPDATE orders SET status = 'paid' WHERE date = '2026-09-23' AND …",
    reads: ["09-23"],
    adds: ["09-23"],
    removes: ["09-23"],
    dataChange: true,
  },
  {
    id: "delete-all",
    label: "DELETE a customer",
    sql: "DELETE FROM orders WHERE customer_id = 7  -- every date",
    reads: PARTITIONS,
    adds: PARTITIONS,
    removes: PARTITIONS,
    dataChange: true,
  },
  {
    id: "optimize",
    label: "OPTIMIZE",
    sql: "OPTIMIZE orders  -- compact small files",
    reads: PARTITIONS,
    adds: PARTITIONS,
    removes: PARTITIONS,
    dataChange: false,
  },
  {
    id: "alter",
    label: "ADD COLUMN",
    sql: "ALTER TABLE orders ADD COLUMN coupon STRING",
    reads: [],
    adds: [],
    removes: [],
    dataChange: false,
    metadata: true,
  },
];

export const opById = Object.fromEntries(OPS.map((o) => [o.id, o]));

export interface Verdict {
  ok: boolean;
  exception?: string;
  /** Partitions where A's changes overlap what B depends on. */
  overlap: string[];
  why: string;
}

const intersect = (a: string[], b: string[]) => a.filter((x) => b.includes(x));

/** Does B, committing after A, succeed? */
export function judge(a: Op, b: Op, level: Level): Verdict {
  if (a.metadata) {
    return {
      ok: false,
      exception: "MetadataChangedException",
      overlap: [],
      why: "A changed the table's metadata (its schema). Any concurrent write may be invalid against the new schema, so B fails and must re-run.",
    };
  }
  if (b.metadata) {
    return {
      ok: true,
      overlap: [],
      why: "A only changed data, and B only changes metadata. B retries as the next version.",
    };
  }
  if (b.blind) {
    return {
      ok: true,
      overlap: [],
      why: "B is a blind append: it read nothing from the table, so nothing A did can invalidate it. It simply retries as the next version.",
    };
  }
  // Files A added that B should have seen (only matters for data-changing B).
  const skipAppends = !b.dataChange || (a.blind && level === "writeserializable");
  const added = a.dataChange ? intersect(a.adds, b.reads) : [];
  if (!skipAppends && added.length) {
    return {
      ok: false,
      exception: "ConcurrentAppendException",
      overlap: added,
      why: `A added files in ${added.join(", ")}, which B read. B's decision might have been different had it seen them, so B fails.`,
    };
  }
  const removedRead = intersect(a.removes, b.reads);
  if (removedRead.length) {
    if (a.id === "optimize" && b.id === "optimize") {
      return {
        ok: false,
        exception: "ConcurrentDeleteDeleteException",
        overlap: removedRead,
        why: "Both compactions tried to replace the same files. Only one can; the second fails.",
      };
    }
    return {
      ok: false,
      exception: b.dataChange ? "ConcurrentDeleteReadException" : undefined,
      overlap: removedRead,
      why: `A removed files in ${removedRead.join(", ")} that B read${b.dataChange ? "" : " and planned to compact"}. B's work is based on files that no longer exist, so B fails.`,
    };
  }
  const notes: string[] = [];
  if (a.blind && level === "writeserializable" && intersect(a.adds, b.reads).length)
    notes.push(
      "A's appended rows landed in a partition B read, but WriteSerializable doesn't count blind appends as conflicts.",
    );
  if (!b.dataChange && intersect(a.adds, b.reads).length)
    notes.push("Compaction doesn't change data, so new appended files don't invalidate it.");
  return {
    ok: true,
    overlap: [],
    why: `No overlap between what A changed and what B read. ${notes.join(" ")} B retries as the next version and succeeds.`.trim(),
  };
}
