/** How a phone learns about new messages: requests made and delivery delays over one minute. */

export type Transport = "poll" | "long" | "sse" | "ws";
export const WINDOW = 60; // s
export const ARRIVALS = [4.2, 11.8, 12.4, 27.5, 41.0, 52.6]; // messages for this user (s)
const POLL_EVERY = 5;
const LONG_TIMEOUT = 25;

export interface TransportResult {
  requests: { at: number; end: number }[]; // HTTP requests or the one connection
  delivered: { sent: number; got: number }[];
  avgDelay: number;
  requestCount: number;
  twoWay: boolean;
}

export function simulate(t: Transport): TransportResult {
  const requests: { at: number; end: number }[] = [];
  const delivered: { sent: number; got: number }[] = [];
  if (t === "poll") {
    for (let at = 0; at < WINDOW; at += POLL_EVERY) requests.push({ at, end: at + 0.3 });
    for (const a of ARRIVALS)
      delivered.push({ sent: a, got: Math.ceil(a / POLL_EVERY) * POLL_EVERY + 0.3 });
  } else if (t === "long") {
    let at = 0;
    let i = 0;
    while (at < WINDOW) {
      const next = ARRIVALS[i];
      const end =
        next !== undefined && next < at + LONG_TIMEOUT
          ? next + 0.05
          : Math.min(WINDOW, at + LONG_TIMEOUT);
      requests.push({ at, end });
      // everything that arrived before this answer is returned in it
      while (ARRIVALS[i] !== undefined && ARRIVALS[i] <= end) {
        delivered.push({ sent: ARRIVALS[i], got: Math.max(end, ARRIVALS[i] + 0.05) });
        i += 1;
      }
      at = end + 0.1; // reconnect
    }
  } else {
    requests.push({ at: 0, end: WINDOW });
    for (const a of ARRIVALS) delivered.push({ sent: a, got: a + 0.05 });
  }
  const avgDelay = delivered.reduce((s, d) => s + (d.got - d.sent), 0) / delivered.length;
  return { requests, delivered, avgDelay, requestCount: requests.length, twoWay: t === "ws" };
}
