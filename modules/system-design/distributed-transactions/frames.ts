/** Step-through frames for two-phase commit and sagas, with injected failures. */

export type Svc = "coordinator" | "payment" | "stock" | "shipping";
export type SvcState =
  "idle" | "working" | "prepared" | "done" | "failed" | "blocked" | "undone" | "down";

export interface TxFrame {
  title: string;
  text: string;
  states: Record<Svc, SvcState>;
  customer: string;
  tone?: "good" | "bad";
}

const S = (c: SvcState, p: SvcState, st: SvcState, sh: SvcState): Record<Svc, SvcState> => ({
  coordinator: c,
  payment: p,
  stock: st,
  shipping: sh,
});

export function frames(
  approach: "2pc" | "saga",
  failure: "none" | "stock" | "coordinator",
): TxFrame[] {
  if (approach === "2pc") {
    const prepare: TxFrame = {
      title: "Phase 1: prepare",
      text: "The coordinator asks every service: 'Can you commit?' Each does the work but holds it: payment places a hold, stock locks the item.",
      states: S("working", "prepared", failure === "stock" ? "failed" : "prepared", "prepared"),
      customer: "Waiting…",
    };
    if (failure === "stock")
      return [
        prepare,
        {
          title: "Stock votes no",
          text: "The last latte machine sold a second ago. One 'no' is enough: the coordinator tells everyone to abort, and the payment hold is released.",
          states: S("done", "undone", "failed", "undone"),
          customer: "Sorry, out of stock",
          tone: "good",
        },
      ];
    if (failure === "coordinator")
      return [
        prepare,
        {
          title: "The coordinator crashes",
          text: "Everyone voted yes, then the coordinator died before announcing the decision. Each service has promised to commit if told to, so it can't decide on its own.",
          states: S("down", "blocked", "blocked", "blocked"),
          customer: "Spinning…",
          tone: "bad",
        },
        {
          title: "Everyone waits, holding locks",
          text: "Until the coordinator recovers, the payment hold and the stock lock stay put. Other customers can't buy that machine. This is two-phase commit's blocking problem.",
          states: S("down", "blocked", "blocked", "blocked"),
          customer: "Spinning…",
          tone: "bad",
        },
      ];
    return [
      prepare,
      {
        title: "Phase 2: commit",
        text: "Everyone said yes, so the coordinator says 'commit'. All three make their changes permanent together.",
        states: S("done", "done", "done", "done"),
        customer: "Order confirmed",
        tone: "good",
      },
    ];
  }
  // Saga
  const f: TxFrame[] = [
    {
      title: "Step 1: take the payment",
      text: "Each step is its own local transaction, committed immediately. The payment service charges ₹12,000.",
      states: S("working", "done", "idle", "idle"),
      customer: "Payment taken…",
    },
  ];
  if (failure === "stock")
    return [
      ...f,
      {
        title: "Step 2: reserve stock fails",
        text: "No machines left. There's nothing to roll back automatically: the payment already committed.",
        states: S("working", "done", "failed", "idle"),
        customer: "Payment taken…",
        tone: "bad",
      },
      {
        title: "Compensate: refund",
        text: "The saga runs the compensating action for each step that succeeded, in reverse: refund the ₹12,000. The customer briefly saw a charge; compensation is a new action, not an undo.",
        states: S("done", "undone", "failed", "idle"),
        customer: "Refunded: out of stock",
        tone: "good",
      },
    ];
  if (failure === "coordinator")
    return [
      ...f,
      {
        title: "The orchestrator crashes",
        text: "The process running the saga dies after step 1. But it recorded each step durably before moving on.",
        states: S("down", "done", "idle", "idle"),
        customer: "Payment taken…",
        tone: "bad",
      },
      {
        title: "It resumes where it stopped",
        text: "A new instance reads the saga's log and continues with step 2. No locks were held meanwhile. Workflow engines built for this call it 'durable execution'.",
        states: S("working", "done", "done", "idle"),
        customer: "Payment taken…",
      },
      {
        title: "Step 3: book the courier",
        text: "Shipping is booked and the order confirmed.",
        states: S("done", "done", "done", "done"),
        customer: "Order confirmed",
        tone: "good",
      },
    ];
  return [
    ...f,
    {
      title: "Step 2: reserve stock",
      text: "Stock is reserved in the inventory service's own database.",
      states: S("working", "done", "done", "idle"),
      customer: "Payment taken…",
    },
    {
      title: "Step 3: book the courier",
      text: "Shipping books a pickup. Every step committed on its own; the order is complete.",
      states: S("done", "done", "done", "done"),
      customer: "Order confirmed",
      tone: "good",
    },
  ];
}
