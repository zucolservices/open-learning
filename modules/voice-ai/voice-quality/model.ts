/** Simulated callers hitting two versions of a clinic voice agent. All numbers are illustrative. */

export type PersonaId = "calm" | "noisy" | "fast" | "accent" | "changes" | "human";
export type Outcome = "done" | "transfer" | "hangup";

interface Profile {
  done: number; // chance the task completes
  transfer: number; // chance of a handover (rest are hang-ups)
  latency: number; // typical voice-to-voice ms
  spread: number;
  wer: number; // word error rate, %
}

export const PERSONAS: {
  id: PersonaId;
  name: string;
  detail: string;
  fail: string;
  v1: Profile;
  v2: Profile;
}[] = [
  {
    id: "calm",
    name: "Calm caller",
    detail: "Clear speech, quiet room",
    fail: "",
    v1: { done: 0.95, transfer: 0.03, latency: 850, spread: 150, wer: 4 },
    v2: { done: 0.96, transfer: 0.03, latency: 800, spread: 120, wer: 4 },
  },
  {
    id: "noisy",
    name: "Busy street",
    detail: "Traffic and wind",
    fail: "Agent hears “Thursday” as “Tuesday” over the traffic; caller gives up.",
    v1: { done: 0.55, transfer: 0.1, latency: 1300, spread: 500, wer: 19 },
    v2: { done: 0.82, transfer: 0.1, latency: 950, spread: 250, wer: 9 },
  },
  {
    id: "fast",
    name: "Fast talker",
    detail: "Pauses mid-sentence",
    fail: "Agent jumps in at the first pause and cuts the caller off, twice.",
    v1: { done: 0.7, transfer: 0.1, latency: 900, spread: 300, wer: 8 },
    v2: { done: 0.88, transfer: 0.06, latency: 950, spread: 200, wer: 7 },
  },
  {
    id: "accent",
    name: "Regional accent",
    detail: "Accent under-represented in training data",
    fail: "The surname is misheard three times; no spelling fallback.",
    v1: { done: 0.68, transfer: 0.2, latency: 950, spread: 250, wer: 15 },
    v2: { done: 0.8, transfer: 0.14, latency: 950, spread: 250, wer: 12 },
  },
  {
    id: "changes",
    name: "Changes their mind",
    detail: "“Actually, make it Friday”",
    fail: "Agent books Tuesday anyway: the correction wasn't applied.",
    v1: { done: 0.6, transfer: 0.1, latency: 1000, spread: 300, wer: 6 },
    v2: { done: 0.9, transfer: 0.05, latency: 1000, spread: 250, wer: 6 },
  },
  {
    id: "human",
    name: "Wants a person",
    detail: "Asks for a human straight away",
    fail: "",
    v1: { done: 0.05, transfer: 0.9, latency: 900, spread: 200, wer: 5 },
    v2: { done: 0.05, transfer: 0.93, latency: 850, spread: 150, wer: 5 },
  },
];

export const CALLS_EACH = 25;

function rnd(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export interface Call {
  persona: PersonaId;
  outcome: Outcome;
  latency: number;
  wer: number;
}

export function runCalls(personas: PersonaId[], v2: boolean): Call[] {
  const calls: Call[] = [];
  PERSONAS.forEach((p, pi) => {
    if (!personas.includes(p.id)) return;
    const f = v2 ? p.v2 : p.v1;
    for (let i = 0; i < CALLS_EACH; i++) {
      const s = pi * 100 + i;
      const r = rnd(s);
      const outcome: Outcome =
        r < f.done ? "done" : r < f.done + f.transfer ? "transfer" : "hangup";
      // Skewed latency: most calls near typical, a few slow.
      const z = rnd(s + 7);
      const latency = Math.round(f.latency + f.spread * (z < 0.85 ? z - 0.5 : 1 + (z - 0.85) * 12));
      calls.push({ persona: p.id, outcome, latency, wer: f.wer });
    }
  });
  return calls;
}

function pct(sorted: number[], q: number) {
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
}

export function dashboard(calls: Call[], hangupsContained: boolean) {
  const n = calls.length || 1;
  const lat = calls.map((c) => c.latency).sort((a, b) => a - b);
  const count = (o: Outcome) => calls.filter((c) => c.outcome === o).length;
  const done = count("done");
  const transfer = count("transfer");
  const hangup = count("hangup");
  return {
    n: calls.length,
    completion: Math.round((done / n) * 100),
    containment: Math.round(((done + (hangupsContained ? hangup : 0)) / n) * 100),
    transfer: Math.round((transfer / n) * 100),
    hangup: Math.round((hangup / n) * 100),
    mean: Math.round(lat.reduce((a, b) => a + b, 0) / n),
    p50: pct(lat, 0.5),
    p95: pct(lat, 0.95),
    wer: Math.round(calls.reduce((a, c) => a + c.wer, 0) / n),
  };
}
