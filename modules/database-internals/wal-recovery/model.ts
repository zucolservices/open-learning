/** A ₹500 transfer, a power cut at three moments, with and without a write-ahead log (illustrative). */

export type Crash = "midway" | "afterCommit" | "done";
export type Mode = "nolog" | "wal";

export const CRASHES: Record<Crash, string> = {
  midway: "Halfway through writing the pages",
  afterCommit: "Just after the app was told “saved”",
  done: "Long after, once everything was written",
};

export interface Result {
  disk: { asha: number; ravi: number };
  log: string[];
  recovered: { asha: number; ravi: number };
  verdict: string;
  ok: boolean;
}

export function crash(mode: Mode, c: Crash): Result {
  const start = { asha: 2000, ravi: 1000 };
  const end = { asha: 1500, ravi: 1500 };
  if (mode === "nolog") {
    if (c === "midway")
      return {
        disk: { asha: 1500, ravi: 1000 },
        log: [],
        recovered: { asha: 1500, ravi: 1000 },
        verdict:
          "Asha's page was written, Ravi's wasn't. ₹500 has vanished, and nothing records what was happening.",
        ok: false,
      };
    if (c === "afterCommit")
      return {
        disk: start,
        log: [],
        recovered: start,
        verdict:
          "The app said “saved”, but the changed pages were still only in memory. The transfer is simply gone.",
        ok: false,
      };
    return {
      disk: end,
      log: [],
      recovered: end,
      verdict: "Everything had reached disk before the crash, so nothing was lost: this time.",
      ok: true,
    };
  }
  const log = [
    "LSN 101  T7 begin",
    "LSN 102  T7 Asha −500",
    "LSN 103  T7 Ravi +500",
    "LSN 104  T7 commit  (log flushed to disk)",
  ];
  if (c === "midway")
    return {
      disk: { asha: 1500, ravi: 1000 },
      log: log.slice(0, 3),
      recovered: start,
      verdict:
        "The log shows T7 never committed, so recovery undoes its half-written change. Both balances are as they were.",
      ok: true,
    };
  if (c === "afterCommit")
    return {
      disk: start,
      log,
      recovered: end,
      verdict:
        "Data pages were never written, but the commit record is in the log. Recovery replays it (redo): the transfer is there.",
      ok: true,
    };
  return {
    disk: end,
    log,
    recovered: end,
    verdict: "Pages and log agree; recovery has nothing to do after the last checkpoint.",
    ok: true,
  };
}
