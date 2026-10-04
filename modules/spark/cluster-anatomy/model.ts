/**
 * A stage of 16 equal tasks scheduled onto executors' task slots, wave by wave. Optionally one
 * executor is lost during the first wave; its running tasks are retried elsewhere. Illustrative.
 */

export const TASKS = 16;
export const TASK_SECONDS = 10;

export interface Placement {
  task: number;
  executor: number;
  slot: number;
  wave: number;
  retried?: boolean;
  lost?: boolean;
}

export function schedule(executors: number, cores: number, lose: boolean) {
  const alive = Array.from({ length: executors }, (_, i) => i);
  const placements: Placement[] = [];
  const queue = Array.from({ length: TASKS }, (_, i) => i);
  let wave = 0;
  let lostDone = false;
  while (queue.length) {
    const live = lose && lostDone ? alive.filter((e) => e !== 1) : alive;
    const slots = live.flatMap((e) => Array.from({ length: cores }, (_, s) => ({ e, s })));
    const batch = queue.splice(0, slots.length);
    const retry: number[] = [];
    batch.forEach((task, i) => {
      const { e, s } = slots[i];
      const failed = lose && !lostDone && e === 1 && executors > 1;
      placements.push({
        task,
        executor: e,
        slot: s,
        wave,
        lost: failed,
        retried: placements.some((p) => p.task === task),
      });
      if (failed) retry.push(task);
    });
    if (lose && !lostDone) lostDone = true;
    queue.unshift(...retry);
    wave++;
  }
  return { placements, waves: wave, seconds: wave * TASK_SECONDS };
}
