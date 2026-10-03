/** Paying ₹500 over a flaky network, with and without an idempotency key (illustrative). */

export type Failure = "request" | "response" | "slow";

export const FAILURES: Record<Failure, { label: string; note: string }> = {
  request: {
    label: "Request lost on the way",
    note: "The network drops the request before it reaches the server.",
  },
  response: {
    label: "Reply lost on the way back",
    note: "The server charges the card; the reply never arrives.",
  },
  slow: {
    label: "Server slow, app gives up",
    note: "The bank takes 12 s; the app times out at 10 s and retries while the first is still running.",
  },
};

export interface Event {
  who: "app" | "server";
  text: string;
  bad?: boolean;
  good?: boolean;
}

export function run(f: Failure, key: boolean): { events: Event[]; charges: number } {
  const k = key ? " Idempotency-Key: 9f1c…" : "";
  const send = `POST /payments {₹500}${k}`;
  const ev: Event[] = [{ who: "app", text: send }];
  if (f === "request") {
    ev.push({ who: "server", text: "(nothing arrives)" });
    ev.push({ who: "app", text: "No reply. Retry: " + send });
    ev.push({ who: "server", text: "Charges ₹500 → 201 Created", good: true });
    return { events: ev, charges: 1 };
  }
  if (f === "response") {
    ev.push({ who: "server", text: "Charges ₹500 → 201 Created (reply lost)" });
    ev.push({ who: "app", text: "No reply. Retry: " + send });
    if (key) {
      ev.push({
        who: "server",
        text: "Seen this key: replays the saved 201, no new charge",
        good: true,
      });
      return { events: ev, charges: 1 };
    }
    ev.push({ who: "server", text: "A new payment! Charges ₹500 again → 201", bad: true });
    return { events: ev, charges: 2 };
  }
  ev.push({ who: "server", text: "Starts charging; waiting on the bank…" });
  ev.push({ who: "app", text: "Timed out at 10 s. Retry: " + send });
  if (key) {
    ev.push({
      who: "server",
      text: "Same key still in progress → 409 Conflict, try again shortly",
      good: true,
    });
    ev.push({ who: "server", text: "First request finishes: ₹500 charged once" });
    ev.push({ who: "app", text: "Retries again → gets the saved 201", good: true });
    return { events: ev, charges: 1 };
  }
  ev.push({ who: "server", text: "Starts a second charge in parallel", bad: true });
  ev.push({ who: "server", text: "Both finish: ₹500 charged twice", bad: true });
  return { events: ev, charges: 2 };
}
