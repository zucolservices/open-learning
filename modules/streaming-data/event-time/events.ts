/**
 * An hour of made-up payments (event time 0–60 minutes) and when each reaches the processor.
 * Most arrive within seconds; some take a few minutes; a few come from phones that were offline.
 * A tiny seeded generator keeps the data identical on server and client.
 */
export interface Ev {
  t: number; // event time, minutes
  a: number; // arrival (processing) time, minutes
}

function rng(seed: number) {
  let x = seed >>> 0;
  return () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    return x / 2 ** 32;
  };
}

export const WINDOW = 5;
export const HOUR = 60;

export const EVENTS: Ev[] = (() => {
  const r = rng(42);
  const out: Ev[] = [];
  for (let i = 0; i < 360; i++) {
    const t = Math.round(r() * HOUR * 100) / 100;
    const k = r();
    const delay = k < 0.85 ? r() * 0.5 : k < 0.97 ? 1 + r() * 4 : 15 + r() * 25;
    out.push({ t, a: Math.round((t + delay) * 100) / 100 });
  }
  return out.sort((p, q) => p.a - q.a);
})();

export const WINDOWS = Array.from({ length: HOUR / WINDOW }, (_, i) => i * WINDOW);

/** True number of events per event-time window. */
export const TRUTH = WINDOWS.map((w) => EVENTS.filter((e) => e.t >= w && e.t < w + WINDOW).length);

/** Counts per window if you bucket by arrival time instead. */
export const BY_ARRIVAL = WINDOWS.map(
  (w) => EVENTS.filter((e) => e.a >= w && e.a < w + WINDOW).length,
);

/**
 * Event-time windows with a bounded-out-of-orderness watermark, observed at processing time `now`.
 * watermark = max event time seen so far − bound. A window's result is emitted when the watermark
 * passes its end; events for an emitted window that arrive afterwards are late and dropped.
 */
export function eventTime(bound: number, now: number) {
  const seen = EVENTS.filter((e) => e.a <= now);
  const counts = WINDOWS.map(() => 0);
  const emittedAt: (number | null)[] = WINDOWS.map(() => null);
  let maxT = -Infinity;
  let dropped = 0;
  for (const e of seen) {
    const wi = Math.floor(e.t / WINDOW);
    if (emittedAt[wi] !== null) dropped++;
    else counts[wi]++;
    maxT = Math.max(maxT, e.t);
    const wm = maxT - bound;
    WINDOWS.forEach((w, i) => {
      if (emittedAt[i] === null && wm >= w + WINDOW) emittedAt[i] = e.a;
    });
  }
  const watermark = maxT - bound;
  // How long after a window ends its result appears, averaged over emitted windows.
  const waits = emittedAt
    .map((at, i) => (at === null ? null : at - (WINDOWS[i] + WINDOW)))
    .filter((x): x is number => x !== null);
  const wait = waits.length ? waits.reduce((s, x) => s + x, 0) / waits.length : null;
  return { counts, emittedAt, watermark, dropped, wait };
}
