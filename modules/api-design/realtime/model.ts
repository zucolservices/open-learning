/** One minute of a cricket match, delivered four ways (illustrative). */

export type Method = "poll" | "long" | "sse" | "ws";

export const EVENTS: { t: number; label: string }[] = [
  { t: 7, label: "FOUR" },
  { t: 13, label: "1 run" },
  { t: 21, label: "WICKET" },
  { t: 33, label: "SIX" },
  { t: 47, label: "2 runs" },
  { t: 56, label: "FOUR" },
];

export const METHODS: Record<Method, { name: string; idea: string }> = {
  poll: { name: "Polling", idea: "Ask every few seconds: anything new?" },
  long: {
    name: "Long polling",
    idea: "Ask, and the server holds the request open until there's news.",
  },
  sse: {
    name: "Server-sent events",
    idea: "One response that stays open; the server writes events into it.",
  },
  ws: { name: "WebSocket", idea: "One two-way connection; either side can send at any time." },
};

export function simulate(m: Method, interval: number) {
  if (m === "poll") {
    const requests = Math.floor(60 / interval);
    const ticks = Array.from({ length: requests }, (_, i) => (i + 1) * interval);
    const learned = EVENTS.map((e) => Math.ceil(e.t / interval) * interval);
    const delays = EVENTS.map((e, i) => learned[i] - e.t);
    const useful = new Set(learned).size;
    return {
      requests,
      empty: requests - useful,
      ticks,
      learned,
      avgDelay: delays.reduce((a, b) => a + b, 0) / delays.length,
      open: "none between requests",
    };
  }
  if (m === "long") {
    const learned = EVENTS.map((e) => e.t);
    return {
      requests: EVENTS.length + 1,
      empty: 0,
      ticks: [0, ...learned],
      learned,
      avgDelay: 0.1,
      open: "one, re-opened after every event",
    };
  }
  const learned = EVENTS.map((e) => e.t);
  return {
    requests: 1,
    empty: 0,
    ticks: [0],
    learned,
    avgDelay: 0,
    open: m === "sse" ? "one stream, server → client" : "one socket, both directions",
  };
}
