/**
 * Someone types "chai" into a search box. Each keystroke can send a request; replies take
 * different times. Timings are illustrative.
 */

export interface Req {
  q: string;
  sent: number;
  arrives: number;
  aborted?: number;
  failed?: boolean;
}

const KEYS = [
  { q: "c", t: 0, dur: 300 },
  { q: "ch", t: 150, dur: 900 },
  { q: "cha", t: 300, dur: 250 },
  { q: "chai", t: 450, dur: 300 },
];

export interface Fixes {
  abort: boolean;
  debounce: boolean;
  loading: boolean;
  errors: boolean;
  flaky: boolean;
}

export function run(f: Fixes) {
  let reqs: Req[];
  if (f.debounce) reqs = [{ q: "chai", sent: 750, arrives: 1050 }];
  else
    reqs = KEYS.map((k, i) => ({
      q: k.q,
      sent: k.t,
      arrives: k.t + k.dur,
      aborted: f.abort && i < KEYS.length - 1 ? KEYS[i + 1].t : undefined,
    }));
  if (f.flaky) reqs = reqs.map((r) => (r.q === "chai" ? { ...r, failed: true } : r));
  const landed = reqs.filter((r) => r.aborted === undefined).sort((a, b) => a.arrives - b.arrives);
  const last = landed[landed.length - 1];
  const shown = last?.failed ? null : last?.q;
  return { reqs, shown, failed: !!last?.failed };
}

export const FIX_LIST: { id: keyof Fixes; label: string; note: string }[] = [
  {
    id: "abort",
    label: "Cancel old requests",
    note: "AbortController cancels the previous request when a new one starts, so a slow old reply can't overwrite a newer one.",
  },
  {
    id: "debounce",
    label: "Wait for a pause in typing",
    note: "Debouncing sends one request after the user stops typing for a moment, instead of one per keystroke.",
  },
  {
    id: "loading",
    label: "Show a loading state",
    note: "People see something is happening instead of stale or blank results.",
  },
  {
    id: "errors",
    label: "Show an error with a retry",
    note: "Failures are explained, not silently empty.",
  },
];
