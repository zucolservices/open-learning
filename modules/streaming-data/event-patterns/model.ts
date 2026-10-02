import type { Fail } from "./state";

export interface AccountEvent {
  type: string;
  amount: number; // signed effect on balance
  day: string;
}

/** Priya's account, as a list of events (illustrative). */
export const EVENTS: AccountEvent[] = [
  { type: "AccountOpened", amount: 0, day: "1 Sep" },
  { type: "MoneyDeposited", amount: 5000, day: "1 Sep" },
  { type: "MoneyWithdrawn", amount: -1200, day: "4 Sep" },
  { type: "MoneyDeposited", amount: 300, day: "9 Sep" },
  { type: "MoneyWithdrawn", amount: -800, day: "12 Sep" },
  { type: "WithdrawalReversed", amount: 800, day: "13 Sep" },
  { type: "MoneyWithdrawn", amount: -450, day: "20 Sep" },
];

export const SNAPSHOT_AT = 4; // snapshot taken after the first 4 events

export function balance(upTo: number) {
  return EVENTS.slice(0, upTo + 1).reduce((s, e) => s + e.amount, 0);
}

/** Events read to rebuild state up to `upTo`, with or without a snapshot. */
export function replayed(upTo: number, snapshot: boolean) {
  if (snapshot && upTo >= SNAPSHOT_AT) return upTo + 1 - SNAPSHOT_AT;
  return upTo + 1;
}

export type StepKind = "compensable" | "pivot" | "retryable";

export const SAGA: {
  id: Exclude<Fail, "none"> | "confirm";
  name: string;
  service: string;
  undo: string;
  kind: StepKind;
}[] = [
  {
    id: "stock",
    name: "Reserve stock",
    service: "Inventory",
    undo: "Release stock",
    kind: "compensable",
  },
  {
    id: "payment",
    name: "Charge payment",
    service: "Payments",
    undo: "Refund payment",
    kind: "compensable",
  },
  { id: "confirm", name: "Confirm order", service: "Orders", undo: "", kind: "pivot" },
  { id: "delivery", name: "Book delivery", service: "Delivery", undo: "", kind: "retryable" },
];

export interface SagaFrame {
  title: string;
  text: string;
  states: ("todo" | "done" | "failed" | "undone" | "retrying")[];
  tone?: "good" | "bad";
}

/** Frames of the order saga when `fail` breaks. */
export function sagaFrames(fail: Fail): SagaFrame[] {
  const n = SAGA.length;
  const frames: SagaFrame[] = [];
  const st = Array<SagaFrame["states"][number]>(n).fill("todo");
  for (let i = 0; i < n; i++) {
    const s = SAGA[i];
    if (s.id === fail && s.kind === "retryable") {
      st[i] = "retrying";
      frames.push({
        title: `${s.name} fails`,
        text: "The courier API is down. This step comes after the point of no return, so it can't be undone: it is retried until it succeeds.",
        states: [...st],
      });
      st[i] = "done";
      frames.push({
        title: "Retry succeeds",
        text: "On a later attempt the booking works. Retries must be idempotent so a repeated request doesn't book two couriers.",
        states: [...st],
        tone: "good",
      });
      return frames;
    }
    if (s.id === fail) {
      st[i] = "failed";
      frames.push({
        title: `${s.name} fails`,
        text:
          s.id === "stock"
            ? "Out of stock. Nothing was done before this, so the saga simply ends: no compensation needed."
            : "The card is declined. Earlier steps already committed in their own databases; there is no rollback across services.",
        states: [...st],
        tone: s.id === "stock" ? "bad" : undefined,
      });
      for (let j = i - 1; j >= 0; j--) {
        st[j] = "undone";
        frames.push({
          title: SAGA[j].undo,
          text: `A compensating action semantically undoes "${SAGA[j].name}". It's a new action, not an erase: the reservation and its release both stay in history.`,
          states: [...st],
        });
      }
      if (i > 0)
        frames.push({
          title: "Saga ends, consistent",
          text: "Every committed step was compensated, in reverse order. For a while, other services could see the half-done state: sagas give up isolation.",
          states: [...st],
        });
      return frames;
    }
    st[i] = "done";
    frames.push({
      title: s.name,
      text:
        s.kind === "pivot"
          ? "The pivot: once the order is confirmed and the customer told, the saga will go forward no matter what."
          : `${s.service} commits its own local transaction. It can be undone later with "${s.undo}".`,
      states: [...st],
    });
  }
  frames[frames.length - 1] = {
    ...frames[frames.length - 1],
    title: "All steps done",
    tone: "good",
  };
  return frames;
}
