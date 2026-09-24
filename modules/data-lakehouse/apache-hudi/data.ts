/** The Hudi `trips` table used across the module: one partition, three file groups. */

export type FgId = "A" | "B" | "C";
export const FILE_GROUPS: FgId[] = ["A", "B", "C"];

export interface Trip {
  id: string;
  fg: FgId;
  rider: string;
  fare: number;
}

export const TRIPS: Trip[] = [
  { id: "t-101", fg: "A", rider: "Asha", fare: 240 },
  { id: "t-102", fg: "A", rider: "Ravi", fare: 180 },
  { id: "t-103", fg: "A", rider: "Meera", fare: 310 },
  { id: "t-104", fg: "B", rider: "Kabir", fare: 150 },
  { id: "t-105", fg: "B", rider: "Zoya", fare: 420 },
  { id: "t-106", fg: "B", rider: "Dev", fare: 95 },
  { id: "t-107", fg: "C", rider: "Isha", fare: 340 },
  { id: "t-108", fg: "C", rider: "Arjun", fare: 205 },
  { id: "t-109", fg: "C", rider: "Nina", fare: 275 },
];

export const tripById = Object.fromEntries(TRIPS.map((t) => [t.id, t]));

/** Each upsert batch changes the fare of two trips in two file groups. */
export const BATCHES: { changes: Record<string, number>; why: string }[] = [
  { changes: { "t-102": 210, "t-107": 300 }, why: "fare corrected · promo applied" },
  { changes: { "t-102": 230, "t-105": 0 }, why: "tip added · trip cancelled" },
  { changes: { "t-101": 260, "t-108": 225 }, why: "tolls added" },
  { changes: { "t-104": 165, "t-109": 290 }, why: "waiting charges" },
];

/* Simulation ---------------------------------------------------------------- */

export type TableType = "cow" | "mor";
export type SimAction = "upsert" | "compact" | "clean";

/** Rough sizes, for comparing write cost. */
export const BASE_MB = 120;
export const LOG_MB = 1;

export interface Slice {
  base: string; // instant time of the base file
  logs: string[]; // instant times of log files (MoR)
  cleaned: boolean;
}

export interface Instant {
  time: string;
  /** As shown on a completed timeline: a compaction completes as a `commit`. */
  action: "commit" | "deltacommit" | "clean";
  label: string;
}

export interface SimResult {
  instants: Instant[];
  slices: Record<FgId, Slice[]>;
  mbWritten: number;
  upserts: number;
  /** Fare per trip in the latest data (what a snapshot query returns). */
  fares: Record<string, number>;
}

export const instantTime = (i: number) => {
  const m = 10 * 60 + i * 5;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

export function simulate(type: TableType, log: SimAction[]): SimResult {
  const slices: Record<FgId, Slice[]> = {
    A: [{ base: "10:00", logs: [], cleaned: false }],
    B: [{ base: "10:00", logs: [], cleaned: false }],
    C: [{ base: "10:00", logs: [], cleaned: false }],
  };
  const instants: Instant[] = [{ time: "10:00", action: "commit", label: "bulk insert" }];
  const fares = Object.fromEntries(TRIPS.map((t) => [t.id, t.fare]));
  let mbWritten = 0;
  let upserts = 0;

  // Compaction only exists for Merge-on-Read; ignore it for Copy-on-Write.
  const actions = type === "cow" ? log.filter((a) => a !== "compact") : log;
  actions.forEach((action, idx) => {
    const time = instantTime(idx + 1);
    const latest = (fg: FgId) => slices[fg].filter((s) => !s.cleaned).at(-1)!;
    if (action === "upsert") {
      const batch = BATCHES[upserts];
      upserts++;
      Object.assign(fares, batch.changes);
      const touched = new Set(Object.keys(batch.changes).map((id) => tripById[id].fg));
      for (const fg of touched) {
        if (type === "cow") {
          slices[fg].push({ base: time, logs: [], cleaned: false });
          mbWritten += BASE_MB;
        } else {
          latest(fg).logs.push(time);
          mbWritten += LOG_MB;
        }
      }
      instants.push({
        time,
        action: type === "cow" ? "commit" : "deltacommit",
        label: `upsert ${[...touched].join("+")}`,
      });
    } else if (action === "compact") {
      const withLogs = FILE_GROUPS.filter((fg) => latest(fg).logs.length > 0);
      for (const fg of withLogs) {
        slices[fg].push({ base: time, logs: [], cleaned: false });
        mbWritten += BASE_MB;
      }
      instants.push({ time, action: "commit", label: `compaction ${withLogs.join("+")}` });
    } else {
      for (const fg of FILE_GROUPS) {
        const live = slices[fg].filter((s) => !s.cleaned);
        live.slice(0, -1).forEach((s) => (s.cleaned = true));
      }
      instants.push({ time, action: "clean", label: "clean old slices" });
    }
  });

  return { instants, slices, mbWritten, upserts, fares };
}

/** Files a snapshot query opens: the latest slice of each file group, base + logs. */
export function snapshotFiles(r: SimResult) {
  return FILE_GROUPS.reduce((n, fg) => {
    const s = r.slices[fg].filter((x) => !x.cleaned).at(-1)!;
    return n + 1 + s.logs.length;
  }, 0);
}

/** Can the action run right now? */
export function canRun(type: TableType, log: SimAction[], action: SimAction) {
  const r = simulate(type, log);
  if (action === "upsert") return r.upserts < BATCHES.length;
  if (action === "compact")
    return (
      type === "mor" &&
      FILE_GROUPS.some((fg) => r.slices[fg].filter((s) => !s.cleaned).at(-1)!.logs.length > 0)
    );
  return FILE_GROUPS.some((fg) => r.slices[fg].filter((s) => !s.cleaned).length > 1);
}
