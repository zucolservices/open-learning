/** Made-up daily café milk sales, simple forecasters, and a classical decomposition. */

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export const DAYS = 140; // 20 weeks
export const H = 14; // forecast horizon: the last two weeks are held out
const WEEK = [-14, -10, -6, -2, 8, 26, -2]; // Mon … Sun

export const SERIES = Array.from({ length: DAYS }, (_, t) =>
  Math.round(60 + 0.15 * t + WEEK[t % 7] + (rnd(t, 1) + rnd(t, 2) - 1) * 9),
);

export const TRAIN = SERIES.slice(0, DAYS - H);
export const ACTUAL = SERIES.slice(DAYS - H);

export type Method = "naive" | "mean" | "snaive" | "hw";

export const METHODS: { id: Method; name: string; how: string }[] = [
  { id: "naive", name: "Naïve", how: "Every future day = the last day seen." },
  {
    id: "mean",
    name: "Recent average",
    how: "Every future day = the average of the last four weeks.",
  },
  { id: "snaive", name: "Seasonal naïve", how: "Each future day = the same weekday last week." },
  {
    id: "hw",
    name: "Exponential smoothing",
    how: "Holt–Winters: smoothed level + trend + weekly pattern, recent days weighted more.",
  },
];

function holtWinters(y: number[], h: number, a = 0.3, b = 0.05, g = 0.2) {
  const m = 7;
  let level = y.slice(0, m).reduce((s, v) => s + v, 0) / m;
  let trend = (y.slice(m, 2 * m).reduce((s, v) => s + v, 0) / m - level) / m;
  const season = y.slice(0, m).map((v) => v - level);
  for (let t = m; t < y.length; t++) {
    const s = season[t % m];
    const prev = level;
    level = a * (y[t] - s) + (1 - a) * (level + trend);
    trend = b * (level - prev) + (1 - b) * trend;
    season[t % m] = g * (y[t] - level) + (1 - g) * s;
  }
  return Array.from({ length: h }, (_, i) => level + (i + 1) * trend + season[(y.length + i) % m]);
}

export function forecast(method: Method, y: number[] = TRAIN, h = H): number[] {
  const n = y.length;
  if (method === "naive") return Array(h).fill(y[n - 1]);
  if (method === "mean") {
    const last = y.slice(n - 28);
    return Array(h).fill(last.reduce((s, v) => s + v, 0) / last.length);
  }
  if (method === "snaive") return Array.from({ length: h }, (_, i) => y[n - 7 + (i % 7)]);
  return holtWinters(y, h);
}

export const mae = (f: number[], a: number[] = ACTUAL) =>
  Math.round((f.reduce((s, v, i) => s + Math.abs(v - a[i]), 0) / f.length) * 10) / 10;

/** Average MAE over several rolling origins (forecast one week ahead from each). */
export function rollingMae(method: Method, origins = 6) {
  let total = 0;
  for (let k = 0; k < origins; k++) {
    const end = DAYS - 7 * (origins - k);
    total += mae(forecast(method, SERIES.slice(0, end), 7), SERIES.slice(end, end + 7));
  }
  return Math.round((total / origins) * 10) / 10;
}

/* Classical additive decomposition: centred 7-day moving average, weekday averages, leftover ---- */

export const TREND = SERIES.map((_, t) =>
  t < 3 || t > DAYS - 4 ? null : SERIES.slice(t - 3, t + 4).reduce((s, v) => s + v, 0) / 7,
);

const weekday = Array.from({ length: 7 }, (_, d) => {
  const vals = SERIES.map((v, t) =>
    TREND[t] === null || t % 7 !== d ? null : v - (TREND[t] as number),
  ).filter((v): v is number => v !== null);
  return vals.reduce((s, v) => s + v, 0) / vals.length;
});

export const SEASON = SERIES.map((_, t) => weekday[t % 7]);
export const REMAINDER = SERIES.map((v, t) =>
  TREND[t] === null ? null : v - (TREND[t] as number) - SEASON[t],
);
