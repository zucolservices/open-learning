/**
 * The replay lab's model: CDC events applied to a table with a MERGE per batch.
 * Illustrative, but the rules follow Delta / Iceberg MERGE semantics:
 * unmatched source rows are inserted (one row each), and more than one source
 * row matching the same target row fails the whole MERGE.
 */

export type Op = "c" | "u" | "d";

export interface ChangeEvent {
  id: string; // e1…e8
  seq: number; // source position (e.g. Postgres LSN), always increasing
  op: Op;
  key: number; // customer_id
  name: string;
  city: string | null; // null for deletes
}

export const EVENTS: ChangeEvent[] = [
  { id: "e1", seq: 101, op: "c", key: 1, name: "Priya", city: "Pune" },
  { id: "e2", seq: 102, op: "c", key: 2, name: "Arjun", city: "Delhi" },
  { id: "e3", seq: 103, op: "u", key: 1, name: "Priya", city: "Mumbai" },
  { id: "e4", seq: 104, op: "c", key: 3, name: "Meera", city: "Chennai" },
  { id: "e5", seq: 105, op: "u", key: 3, name: "Meera", city: "Kochi" },
  { id: "e6", seq: 106, op: "d", key: 3, name: "Meera", city: null },
  { id: "e7", seq: 107, op: "u", key: 2, name: "Arjun", city: "Jaipur" },
  { id: "e8", seq: 108, op: "u", key: 1, name: "Priya", city: "Bengaluru" },
];

export type Arrival = "ordered" | "messy";

/** Which events arrive in which micro-batch. */
export const SCHEDULES: Record<Arrival, string[][]> = {
  ordered: [
    ["e1", "e2", "e3"],
    ["e4", "e5", "e6"],
    ["e7", "e8"],
  ],
  // e3 and e5 were stuck in a slow file; a retry delivers e7 a second time.
  messy: [
    ["e1", "e2", "e4"],
    ["e6", "e7", "e8"],
    ["e3", "e5", "e7", "e7"],
  ],
};

export interface Fixes {
  dedupe: boolean; // keep only the latest event per key in each batch
  guard: boolean; // only apply an event if it is newer than the row (s.seq > t.seq)
  soft: boolean; // keep deleted rows as tombstones instead of removing them
}

export interface Row {
  key: number;
  name: string;
  city: string | null;
  seq: number;
  deleted: boolean;
}

export interface BatchResult {
  events: ChangeEvent[]; // after dedupe
  dropped: number[]; // positions in the batch removed by dedupe
  actions: { event: string; action: string; tone: "good" | "bad" | "muted" }[];
  error?: string;
  table: Row[]; // after the batch (unchanged if it failed)
}

const byId = new Map(EVENTS.map((e) => [e.id, e]));

/** Positions of the events kept when only each key's latest event survives. */
export function dedupe(events: ChangeEvent[]): number[] {
  const latest = new Map<number, number>();
  events.forEach((e, i) => {
    const cur = latest.get(e.key);
    if (cur === undefined || e.seq > events[cur].seq) latest.set(e.key, i);
  });
  return [...latest.values()].sort((a, b) => a - b);
}

/** Apply one batch with MERGE semantics. */
export function mergeBatch(table: Row[], raw: ChangeEvent[], fx: Fixes): BatchResult {
  const keep = fx.dedupe ? dedupe(raw) : raw.map((_, i) => i);
  const events = keep.map((i) => raw[i]);
  const dropped = raw.map((_, i) => i).filter((i) => !keep.includes(i));

  // Multiple source rows matching one target row → the whole MERGE fails.
  for (const t of table) {
    const hits = events.filter((e) => e.key === t.key);
    if (hits.length > 1) {
      return {
        events,
        dropped,
        actions: [],
        error: `${hits.length} source rows (${hits.map((h) => `#${h.key}·${h.seq}`).join(", ")}) matched the target row for customer ${t.key}`,
        table,
      };
    }
  }

  const next = table.map((r) => ({ ...r }));
  const before = new Set(next); // MERGE matches against the table as it was before the batch
  const actions: BatchResult["actions"] = [];
  for (const e of events) {
    const targets = next.filter((r) => before.has(r) && r.key === e.key);
    if (targets.length > 0) {
      for (const t of targets) {
        if (fx.guard && !(e.seq > t.seq)) {
          actions.push({
            event: e.id,
            action: `skipped: older than the row (${e.seq} ≤ ${t.seq})`,
            tone: "good",
          });
          continue;
        }
        if (e.op === "d") {
          if (fx.soft) {
            Object.assign(t, { deleted: true, city: null, seq: e.seq });
            actions.push({ event: e.id, action: "marked deleted (tombstone kept)", tone: "muted" });
          } else {
            next.splice(next.indexOf(t), 1);
            actions.push({ event: e.id, action: "deleted the row", tone: "muted" });
          }
        } else {
          Object.assign(t, { name: e.name, city: e.city, seq: e.seq, deleted: false });
          actions.push({ event: e.id, action: `updated → ${e.city}`, tone: "muted" });
        }
      }
    } else if (e.op === "d") {
      if (fx.soft) {
        next.push({ key: e.key, name: e.name, city: null, seq: e.seq, deleted: true });
        actions.push({ event: e.id, action: "inserted a tombstone", tone: "muted" });
      } else {
        actions.push({ event: e.id, action: "no row to delete: ignored", tone: "muted" });
      }
    } else {
      next.push({ key: e.key, name: e.name, city: e.city, seq: e.seq, deleted: false });
      actions.push({ event: e.id, action: `inserted (${e.city})`, tone: "muted" });
    }
  }
  next.sort((a, b) => a.key - b.key || a.seq - b.seq);
  return { events, dropped, actions, table: next };
}

export function run(arrival: Arrival, fx: Fixes): BatchResult[] {
  let table: Row[] = [];
  const out: BatchResult[] = [];
  for (const ids of SCHEDULES[arrival]) {
    const r = mergeBatch(
      table,
      ids.map((id) => byId.get(id)!),
      fx,
    );
    out.push(r);
    if (r.error) break; // the job fails; later batches never run
    table = r.table;
  }
  return out;
}

/** What the source database really holds at the end. */
export const TRUTH: { key: number; name: string; city: string }[] = [
  { key: 1, name: "Priya", city: "Bengaluru" },
  { key: 2, name: "Arjun", city: "Jaipur" },
];

export type Problem = "duplicate" | "stale" | "resurrected" | "failed";

/** Compare what readers see (non-deleted rows) with the truth. */
export function diagnose(results: BatchResult[]): {
  visible: Row[];
  problems: Problem[];
  rowIssues: Map<Row, Problem>;
} {
  const last = results[results.length - 1];
  const visible = last.table.filter((r) => !r.deleted);
  const problems = new Set<Problem>();
  const rowIssues = new Map<Row, Problem>();
  if (last.error) problems.add("failed");
  const counts = new Map<number, number>();
  for (const r of visible) counts.set(r.key, (counts.get(r.key) ?? 0) + 1);
  for (const r of visible) {
    const t = TRUTH.find((x) => x.key === r.key);
    let p: Problem | undefined;
    if (!t) p = "resurrected";
    else if ((counts.get(r.key) ?? 0) > 1) p = "duplicate";
    else if (t.city !== r.city) p = "stale";
    if (p) {
      problems.add(p);
      rowIssues.set(r, p);
    }
  }
  return { visible, problems: [...problems], rowIssues };
}
