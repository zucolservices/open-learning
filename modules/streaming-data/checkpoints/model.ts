import type { Saved } from "./state";

/**
 * A job counts 20 payments (offsets 0–19). Checkpoints are taken after offsets 4 and 9 (barriers at 5 and 10).
 * It crashes after processing offset 12. Each frame describes what the job holds and what downstream saw.
 */
export interface Frame {
  title: string;
  offset: number; // next offset to read
  count: number; // the job's running count
  emitted: number[]; // counts visible downstream so far
  snapshots: number[]; // completed checkpoint offsets
  crashed?: boolean;
  text: string;
}

const TOTAL = 20;

export function frames(saved: Saved, transactional: boolean): Frame[] {
  const vis = (upto: number, committedAt: number) =>
    transactional
      ? Array.from({ length: committedAt }, (_, i) => i + 1)
      : Array.from({ length: upto }, (_, i) => i + 1);
  const f: Frame[] = [
    {
      title: "1. Count and snapshot",
      offset: 5,
      count: 5,
      emitted: vis(5, 5),
      snapshots: [5],
      text: "Five payments counted. A barrier reaches the counter: it saves {position 5, count 5} as checkpoint 1.",
    },
    {
      title: "2. Another checkpoint",
      offset: 10,
      count: 10,
      emitted: vis(10, 10),
      snapshots: [5, 10],
      text: "Five more. Checkpoint 2 saves {position 10, count 10}.",
    },
    {
      title: "3. Keep counting",
      offset: 13,
      count: 13,
      emitted: vis(13, 10),
      snapshots: [5, 10],
      text: transactional
        ? "Payments 10–12 counted. Their results sit in an open Kafka transaction, invisible to read_committed readers until the next checkpoint."
        : "Payments 10–12 counted; results 11, 12 and 13 have already gone downstream.",
    },
    {
      title: "4. Crash",
      offset: 13,
      count: 13,
      emitted: vis(13, 10),
      snapshots: [5, 10],
      crashed: true,
      text: transactional
        ? "The machine dies. The open transaction is aborted, so results 11–13 never become visible."
        : "The machine dies mid-stream.",
    },
  ];
  let restoreCount: number;
  let restoreOffset: number;
  let note: string;
  if (saved === "together") {
    restoreCount = 10;
    restoreOffset = 10;
    note =
      "Restore checkpoint 2: count 10, and rewind the source to position 10. Payments 10–12 are read again, so the count is right.";
  } else if (saved === "separate") {
    restoreCount = 10;
    restoreOffset = 13;
    note =
      "The state comes back from checkpoint 2 (count 10), but the Kafka offset was committed separately, at 13. Payments 10–12 are never counted again.";
  } else {
    restoreCount = 0;
    restoreOffset = 13;
    note = "Nothing was saved but the committed offset (13). The count starts again at 0.";
  }
  const final = restoreCount + (TOTAL - restoreOffset);
  const after = Array.from({ length: final - restoreCount }, (_, i) => restoreCount + i + 1);
  f.push({
    title: "5. Restore",
    offset: restoreOffset,
    count: restoreCount,
    emitted: f[3].emitted,
    snapshots: [5, 10],
    text: note,
  });
  f.push({
    title: "6. Finish the stream",
    offset: TOTAL,
    count: final,
    emitted: [...f[3].emitted, ...after],
    snapshots: [5, 10, 15, 20],
    text:
      final === TOTAL
        ? transactional
          ? "Final count 20, and downstream saw each result exactly once: committed with each checkpoint."
          : "Final count 20. But downstream saw results 11–13 twice, once before the crash and again after the replay."
        : `Final count ${final}, not 20: ${TOTAL - final} payments were lost.`,
  });
  return f;
}

export function duplicates(emitted: number[]): number {
  const seen = new Set<number>();
  let d = 0;
  for (const e of emitted) {
    if (seen.has(e)) d++;
    seen.add(e);
  }
  return d;
}
