/** Back-of-the-envelope arithmetic, kept honest and simple. */

export const SECONDS_PER_DAY = 86_400;

export const INPUTS = {
  dau: [10_000, 100_000, 1_000_000, 10_000_000, 100_000_000],
  actions: [5, 20, 50, 200],
  writePct: [1, 10, 30, 50],
  peak: [2, 3, 5, 10],
  sizeKB: [0.5, 2, 10, 100, 2_000],
  years: [1, 3, 5, 10],
  perServer: [200, 1_000, 5_000],
};

export type Key = keyof typeof INPUTS;

export function estimate(idx: Record<string, number>) {
  const v = (k: Key) => INPUTS[k][Math.min(idx[k] ?? 0, INPUTS[k].length - 1)];
  const requestsPerDay = v("dau") * v("actions");
  const avgQps = requestsPerDay / SECONDS_PER_DAY;
  const peakQps = avgQps * v("peak");
  const writesPerDay = requestsPerDay * (v("writePct") / 100);
  const writeQps = writesPerDay / SECONDS_PER_DAY;
  const storagePerDayGB = (writesPerDay * v("sizeKB")) / 1e6;
  const storageTotalTB = (storagePerDayGB * 365 * v("years")) / 1000;
  // Bandwidth at peak: every request returns about one item of this size.
  const peakBandwidthMBs = (peakQps * v("sizeKB")) / 1000;
  const servers = Math.ceil(peakQps / v("perServer"));
  return {
    v,
    requestsPerDay,
    avgQps,
    peakQps,
    writeQps,
    storagePerDayGB,
    storageTotalTB,
    peakBandwidthMBs,
    servers,
  };
}

export function fmtNum(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(n >= 1e10 ? 0 : 1)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)} million`;
  if (n >= 1000) return Math.round(n).toLocaleString("en-US");
  if (n >= 10) return Math.round(n).toString();
  return n.toFixed(1);
}

export function fmtBytesGB(gb: number) {
  if (gb >= 1e9) return `${(gb / 1e9).toFixed(1)} EB`;
  if (gb >= 1e6) return `${(gb / 1e6).toFixed(1)} PB`;
  if (gb >= 1000) return `${(gb / 1000).toFixed(1)} TB`;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  return `${(gb * 1000).toFixed(0)} MB`;
}

/** Latency ladder: seconds (real) with the human-scale version (1 ns → 1 s). */
export const LADDER: { label: string; real: number; note: string }[] = [
  { label: "Read from the CPU's L1 cache", real: 1e-9, note: "A few CPU cycles." },
  {
    label: "Read from main memory (RAM)",
    real: 100e-9,
    note: "About 60–100 ns: roughly a hundred times L1.",
  },
  {
    label: "Random 4 KB read from an NVMe SSD",
    real: 75e-6,
    note: "A data-centre drive's spec at an idle moment; hundreds of µs under load.",
  },
  {
    label: "Round trip within one data centre",
    real: 0.5e-3,
    note: "Typically 0.1–0.5 ms (measured; no vendor promises a figure).",
  },
  {
    label: "Round trip between zones in one region",
    real: 2e-3,
    note: "“Single-digit milliseconds” (AWS); under about 2 ms (Azure's target).",
  },
  {
    label: "Round trip California ↔ Netherlands",
    real: 146e-3,
    note: "Azure's measured median, West US ↔ West Europe. Light in fibre alone needs ~90 ms.",
  },
];

/** Human scale: multiply by a billion (1 ns → 1 s). */
export function humanTime(realSeconds: number) {
  const s = realSeconds * 1e9;
  if (s < 90) return `${Math.round(s)} s`;
  if (s < 3600 * 1.5) return `${Math.round(s / 60)} min`;
  if (s < 86400 * 1.5) return `${Math.round(s / 3600)} hours`;
  if (s < 86400 * 365) return `${Math.round(s / 86400)} days`;
  return `${(s / (86400 * 365)).toFixed(1)} years`;
}

export function realTime(s: number) {
  if (s < 1e-6) return `${Math.round(s * 1e9)} ns`;
  if (s < 1e-3) return `${Math.round(s * 1e6)} µs`;
  return `${+(s * 1e3).toFixed(1)} ms`;
}
