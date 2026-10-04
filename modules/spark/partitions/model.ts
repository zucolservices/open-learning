/** 16 GB of data split into N partitions and run on S task slots. Rates and overheads illustrative. */

export const DATA_MB = 16384;
const MB_PER_SEC = 64;
const TASK_OVERHEAD = 0.6;

export function run(partitions: number, slots: number) {
  const mb = DATA_MB / partitions;
  const taskSec = mb / MB_PER_SEC + TASK_OVERHEAD;
  const waves = Math.ceil(partitions / slots);
  const total = Math.round(waves * taskSec);
  const busy = partitions * taskSec;
  const util = Math.min(100, Math.round((busy / (waves * taskSec * slots)) * 100));
  const perCore = partitions / slots;
  const overheadShare = TASK_OVERHEAD / taskSec;
  let verdict: string;
  let tone: "good" | "bad" | "neutral";
  if (partitions < slots) {
    verdict = `Only ${partitions} tasks for ${slots} slots: ${slots - partitions} cores sit idle the whole time.`;
    tone = "bad";
  } else if (overheadShare > 0.3) {
    verdict = `Each partition is only ${Math.round(mb)} MB, so ${Math.round(overheadShare * 100)}% of every task is scheduling overhead rather than work.`;
    tone = "bad";
  } else if (perCore >= 2 && perCore <= 4) {
    verdict = `About ${Math.round(perCore)} tasks per core in ${waves} waves: every core stays busy and overhead stays small.`;
    tone = "good";
  } else if (perCore < 2) {
    verdict =
      "One wave with every core busy, but a single slow task would hold everything up. A few more partitions give Spark room to balance.";
    tone = "neutral";
  } else {
    verdict = `${Math.round(perCore)} tasks per core. It works; overhead is ${Math.round(overheadShare * 100)}% of each task.`;
    tone = "neutral";
  }
  return { mb, taskSec, waves, total, util, verdict, tone };
}
