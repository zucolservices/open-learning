/**
 * Two transactions taking row locks on two accounts. Replays a list of actions and reports who
 * holds what, who waits for whom, and whether the deadlock detector had to step in. Simplified:
 * one exclusive lock per row, as an UPDATE takes.
 */

export type Tx = 1 | 2;
export type Row = "asha" | "ravi";
export type Action = `${Tx}:${Row | "commit"}`;

export const ROWS: Record<Row, string> = { asha: "Asha's account", ravi: "Ravi's account" };

export type Status = "running" | "waiting" | "committed" | "aborted";

export interface World {
  holder: Record<Row, Tx | null>;
  status: Record<Tx, Status>;
  waitsFor: Record<Tx, Row | null>;
  log: { tx: Tx | 0; text: string; bad?: boolean; good?: boolean }[];
  deadlock: boolean;
}

const other = (t: Tx): Tx => (t === 1 ? 2 : 1);

function release(w: World, t: Tx) {
  for (const r of Object.keys(w.holder) as Row[]) if (w.holder[r] === t) w.holder[r] = null;
  // A waiting transaction gets the row as soon as it's free.
  const o = other(t);
  const want = w.waitsFor[o];
  if (want && w.status[o] === "waiting" && w.holder[want] === null) {
    w.holder[want] = o;
    w.waitsFor[o] = null;
    w.status[o] = "running";
    w.log.push({ tx: o, text: `T${o} gets the lock on ${ROWS[want]} and carries on` });
  }
}

export function replay(actions: Action[]): World {
  const w: World = {
    holder: { asha: null, ravi: null },
    status: { 1: "running", 2: "running" },
    waitsFor: { 1: null, 2: null },
    log: [],
    deadlock: false,
  };
  for (const a of actions) {
    const [ts, what] = a.split(":") as [string, Row | "commit"];
    const t = Number(ts) as Tx;
    if (w.status[t] !== "running") continue;
    if (what === "commit") {
      w.status[t] = "committed";
      w.log.push({ tx: t, text: `T${t}: COMMIT, releasing its locks`, good: true });
      release(w, t);
      continue;
    }
    const h = w.holder[what];
    if (h === t) continue;
    if (h === null) {
      w.holder[what] = t;
      w.log.push({ tx: t, text: `T${t}: UPDATE ${ROWS[what]} (lock taken)` });
      continue;
    }
    w.status[t] = "waiting";
    w.waitsFor[t] = what;
    w.log.push({ tx: t, text: `T${t}: UPDATE ${ROWS[what]}, waits: T${h} holds it` });
    // A cycle: each waits for a row the other holds.
    const o = other(t);
    if (w.status[o] === "waiting" && w.holder[w.waitsFor[o]!] === t) {
      w.deadlock = true;
      w.log.push({
        tx: 0,
        text: "…1 second later (deadlock_timeout) the detector checks: a cycle",
      });
      w.status[t] = "aborted";
      w.waitsFor[t] = null;
      w.log.push({ tx: t, text: `ERROR: deadlock detected. T${t} is rolled back`, bad: true });
      release(w, t);
    }
  }
  return w;
}

export const DEADLOCK: Action[] = ["1:asha", "2:ravi", "1:ravi", "2:asha"];
