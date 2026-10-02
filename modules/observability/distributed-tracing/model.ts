/** One slow checkout across six services, as a trace (illustrative timings in ms). */

export interface Span {
  id: string;
  name: string;
  service: string;
  parent?: string;
  start: number;
  dur: number;
  kind: "SERVER" | "CLIENT" | "INTERNAL" | "PRODUCER";
  /** Frame (0-based) at which this span appears in the step-through. */
  at: number;
}

export const TOTAL = 2600;

export const SPANS: Span[] = [
  {
    id: "a",
    name: "POST /checkout",
    service: "gateway",
    start: 0,
    dur: 2600,
    kind: "SERVER",
    at: 0,
  },
  {
    id: "b",
    name: "POST /orders",
    service: "orders",
    parent: "a",
    start: 15,
    dur: 2560,
    kind: "SERVER",
    at: 1,
  },
  {
    id: "c",
    name: "GET /cart",
    service: "cart",
    parent: "b",
    start: 25,
    dur: 60,
    kind: "SERVER",
    at: 2,
  },
  {
    id: "d",
    name: "POST /reserve",
    service: "inventory",
    parent: "b",
    start: 95,
    dur: 1900,
    kind: "SERVER",
    at: 3,
  },
  {
    id: "e",
    name: "SELECT … FOR UPDATE",
    service: "inventory",
    parent: "d",
    start: 110,
    dur: 1860,
    kind: "CLIENT",
    at: 3,
  },
  {
    id: "f",
    name: "POST /authorise",
    service: "payments",
    parent: "b",
    start: 2005,
    dur: 420,
    kind: "SERVER",
    at: 4,
  },
  {
    id: "g",
    name: "POST bank /collect",
    service: "payments",
    parent: "f",
    start: 2030,
    dur: 370,
    kind: "CLIENT",
    at: 4,
  },
  {
    id: "h",
    name: "publish order.placed",
    service: "orders",
    parent: "b",
    start: 2440,
    dur: 20,
    kind: "PRODUCER",
    at: 5,
  },
];

export const FRAMES: { title: string; text: string; header: string }[] = [
  {
    title: "The request arrives",
    text: "The gateway starts a trace: a new trace ID, and a first span for POST /checkout.",
    header: "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  },
  {
    title: "Context travels with the call",
    text: "Calling the orders service, the gateway adds a traceparent header carrying the trace ID and its own span ID. The orders service continues the same trace with a child span.",
    header: "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-3a1f7c2e9b4d0a61-01",
  },
  {
    title: "Fast calls",
    text: "Orders fetches the cart: 60 ms. Each service that receives the header adds its own spans to the same tree.",
    header: "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-8c24e1d0f5a6b937-01",
  },
  {
    title: "Something waits",
    text: "Reserving stock takes 1.9 s, and inside it a single database query takes 1.86 s. A SELECT … FOR UPDATE waits for a lock another order holds.",
    header: "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-c0d9a8e7f6b5a4c3-01",
  },
  {
    title: "Payment, then the bank",
    text: "Only after the stock is reserved can payment start: 420 ms, most of it the bank's API.",
    header: "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-5e6f7a8b9c0d1e2f-01",
  },
  {
    title: "The whole picture",
    text: "An event is published for other services to handle later. Now read the waterfall: which span made this checkout slow? Click it.",
    header: "",
  },
];

export const CULPRIT = "e";
