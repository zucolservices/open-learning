/** One afternoon's log lines, as free text and as structured records (illustrative). */

export interface Rec {
  time: string;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  msg: string;
  order_id?: string;
  bank?: string;
  trace_id?: string;
  /** How a developer happened to write it in free text. */
  text: string;
}

export const RECS: Rec[] = [
  {
    time: "14:08:59",
    level: "INFO",
    service: "checkout",
    msg: "order created",
    order_id: "8810",
    bank: "Bank A",
    trace_id: "1c2e",
    text: "Created order 8810 for Bank A customer",
  },
  {
    time: "14:09:01",
    level: "INFO",
    service: "checkout",
    msg: "order created",
    order_id: "8812",
    bank: "Bank C",
    trace_id: "4bf9",
    text: "new order #8812 placed",
  },
  {
    time: "14:09:01",
    level: "INFO",
    service: "payments",
    msg: "payment started",
    order_id: "8812",
    bank: "Bank C",
    trace_id: "4bf9",
    text: "Starting payment (ord=8812) via BANK-C",
  },
  {
    time: "14:09:02",
    level: "INFO",
    service: "payments",
    msg: "payment started",
    order_id: "8810",
    bank: "Bank A",
    trace_id: "1c2e",
    text: "Starting payment for order 8810",
  },
  {
    time: "14:09:02",
    level: "WARN",
    service: "payments",
    msg: "bank slow",
    bank: "Bank C",
    trace_id: "4bf9",
    text: "bank c is slow again, retrying",
  },
  {
    time: "14:09:03",
    level: "INFO",
    service: "payments",
    msg: "payment completed",
    order_id: "8810",
    bank: "Bank A",
    trace_id: "1c2e",
    text: "Payment OK: 8810",
  },
  {
    time: "14:09:04",
    level: "ERROR",
    service: "payments",
    msg: "payment failed",
    order_id: "8812",
    bank: "Bank C",
    trace_id: "4bf9",
    text: "ERROR!!! could not pay, upstream timeout",
  },
  {
    time: "14:09:04",
    level: "ERROR",
    service: "checkout",
    msg: "order failed",
    order_id: "8812",
    bank: "Bank C",
    trace_id: "4bf9",
    text: "Order 8812 failed :(",
  },
  {
    time: "14:09:05",
    level: "ERROR",
    service: "payments",
    msg: "payment failed",
    order_id: "8815",
    bank: "Bank C",
    trace_id: "77d0",
    text: "payment failure order=8815 bank=c",
  },
  {
    time: "14:09:06",
    level: "INFO",
    service: "checkout",
    msg: "order created",
    order_id: "8816",
    bank: "Bank B",
    trace_id: "9a41",
    text: "Created order 8816",
  },
];

export type Query = "order" | "bybank" | "trace";

export const QUERIES: Record<Query, { label: string; structured: string; text: string }> = {
  order: {
    label: "Everything about order 8812",
    structured: 'order_id = "8812"',
    text: 'grep "order 8812"',
  },
  bybank: {
    label: "Errors, counted by bank",
    structured: "level = ERROR | count by bank",
    text: "grep ERROR … then read and tally by hand",
  },
  trace: {
    label: "All lines from trace 4bf9",
    structured: 'trace_id = "4bf9"',
    text: "(no trace ID in the text)",
  },
};

export function run(q: Query, structured: boolean): { lines: Rec[]; note: string } {
  if (q === "order") {
    if (structured)
      return {
        lines: RECS.filter((r) => r.order_id === "8812"),
        note: "4 lines, from both services.",
      };
    const lines = RECS.filter(
      (r) => r.text.includes("order 8812") || r.text.includes("Order 8812"),
    );
    return {
      lines,
      note: '1 line. The others say "#8812" or "ord=8812", and the failure doesn\'t mention the order at all.',
    };
  }
  if (q === "bybank") {
    if (structured)
      return {
        lines: RECS.filter((r) => r.level === "ERROR"),
        note: "Bank C: 3 errors, every other bank: 0.",
      };
    return {
      lines: RECS.filter((r) => r.text.includes("ERROR")),
      note: '1 line matches "ERROR"; the rest spell failure differently, and only one names a bank.',
    };
  }
  if (structured)
    return {
      lines: RECS.filter((r) => r.trace_id === "4bf9"),
      note: "5 lines across two services, ready to line up with the trace.",
    };
  return { lines: [], note: "Impossible: the text never recorded the trace ID." };
}
