/** A toy skewed join stage: 16 shuffle partitions on 8 cores. Sizes and timings are illustrative. */

export const PARTS = 16;
export const CORES = 8;
const TOTAL_MB = 16_000;
const HOT_PART = 5;
const S_PER_MB = 0.05;
const OVERHEAD_S = 0.3;

export const SHARES = [0, 0.1, 0.3, 0.6];
export type Fix = "none" | "aqe" | "salt";
export const SALTS = [4, 8, 16];

export interface Stage {
  tasks: number[]; // MB per task
  times: number[];
  stage: number;
  q: [number, number, number, number, number]; // min, 25th, median, 75th, max (seconds)
  note: string;
}

const quant = (xs: number[]): Stage["q"] => {
  const s = [...xs].sort((a, b) => a - b);
  const at = (p: number) => s[Math.min(s.length - 1, Math.round(p * (s.length - 1)))];
  return [s[0], at(0.25), at(0.5), at(0.75), s[s.length - 1]];
};

function makespan(times: number[]) {
  const cores = Array<number>(CORES).fill(0);
  for (const t of [...times].sort((a, b) => b - a)) {
    const k = cores.indexOf(Math.min(...cores));
    cores[k] += t;
  }
  return Math.max(...cores);
}

export function run(share: number, fix: Fix, salt: number): Stage {
  const hot = TOTAL_MB * share;
  const rest = TOTAL_MB - hot;
  let tasks = Array.from(
    { length: PARTS },
    (_, i) => (rest / PARTS) * (0.85 + ((i * 7) % 5) * 0.075),
  );
  let note =
    share === 0
      ? "Keys are evenly spread: every task does about the same work."
      : `One key holds ${share * 100}% of the rows, and every row with that key hashes to partition ${HOT_PART + 1}.`;
  if (fix === "salt" && share > 0) {
    for (let k = 0; k < salt; k++) tasks[(HOT_PART + k) % PARTS] += hot / salt;
    note = `The hot key gets a random suffix 0–${salt - 1}, so its rows spread over ${salt} partitions. The small side's matching rows are copied ${salt} times.`;
  } else {
    tasks[HOT_PART] += hot;
  }
  if (fix === "aqe" && share > 0) {
    const med = [...tasks].sort((a, b) => a - b)[PARTS / 2];
    const out: number[] = [];
    for (const mb of tasks) {
      if (mb > 5 * med && mb > 256) {
        const n = Math.ceil(mb / Math.max(64, med));
        for (let k = 0; k < n; k++) out.push(mb / n);
        note = `AQE sees partition ${HOT_PART + 1} is over 5× the median and over 256 MB, and splits it into ${n} tasks, copying the other side's matching rows to each.`;
      } else out.push(mb);
    }
    if (out.length === tasks.length)
      note = "No partition is over 5× the median and 256 MB, so AQE leaves the stage alone.";
    tasks = out;
  }
  const times = tasks.map((mb) => OVERHEAD_S + mb * S_PER_MB);
  return { tasks, times, stage: makespan(times), q: quant(times), note };
}

export const fmtS = (s: number) => (s >= 60 ? `${(s / 60).toFixed(1)} min` : `${s.toFixed(0)} s`);

export const HOT_KEYS: [string, string][] = [
  ["NULL", "61,204,118"],
  ["marketplace_01", "9,880,412"],
  ["c_88213", "41,027"],
  ["c_10477", "39,915"],
  ["c_55120", "39,602"],
];
