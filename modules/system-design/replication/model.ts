/** Read-your-writes model: one leader, three replicas with different lag. Deterministic. */

export const LAGS_MS = [20, 300, 3000];
export const REFRESH_AT_MS = [100, 400, 800, 1500, 4000];
/** Replica lag multipliers: replicas are rarely equally behind. */
const REPLICA_FACTOR = [0.5, 1, 2.5];
/** Which replica a load balancer happens to pick for each refresh. */
const PICKS = [1, 0, 2, 0, 2];

export type Strategy = "any" | "sticky" | "leader" | "wait";

export interface Read {
  at: number;
  server: string;
  fresh: boolean;
  extraWaitMs: number;
}

export function reads(lagMs: number, strategy: Strategy): Read[] {
  return REFRESH_AT_MS.map((at, i) => {
    if (strategy === "leader" && at <= 10_000)
      return { at, server: "leader", fresh: true, extraWaitMs: 0 };
    const replica = strategy === "sticky" ? 2 : PICKS[i];
    const caughtUpAt = lagMs * REPLICA_FACTOR[replica];
    if (strategy === "wait") {
      const wait = Math.max(0, caughtUpAt - at);
      return { at, server: `replica ${replica + 1}`, fresh: true, extraWaitMs: Math.round(wait) };
    }
    return { at, server: `replica ${replica + 1}`, fresh: at >= caughtUpAt, extraWaitMs: 0 };
  });
}

/** Write latency and what a leader crash can lose, for each replication mode. */
export function commitModel(mode: "async" | "semi" | "sync", remote: boolean) {
  const localMs = 1; // flush to local disk
  const rttMs = remote ? 140 : 1.5; // round trip to the replica
  const latency = mode === "async" ? localMs : localMs + rttMs;
  const lost =
    mode === "async"
      ? "Writes not yet copied: the last moments of changes"
      : mode === "semi"
        ? "Nothing acknowledged: at least one replica received each write (it may not have applied it yet)"
        : "Nothing acknowledged: a replica has each write before the user sees 'saved'";
  return { latency, lost };
}
