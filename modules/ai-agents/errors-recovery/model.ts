/** Four failures during a refund, each with possible recoveries. Illustrative. */

export interface Option {
  id: string;
  label: string;
  tone: "good" | "ok" | "bad";
  result: string;
  turns: number;
}

export interface Incident {
  id: string;
  title: string;
  error: string;
  options: Option[];
}

export const INCIDENTS: Incident[] = [
  {
    id: "timeout",
    title: "The payments service times out",
    error: "Error: payments service timed out (temporary). Safe to retry.",
    options: [
      {
        id: "backoff",
        label: "Retry after 1 s, then 2 s, then 4 s, with a little randomness",
        tone: "good",
        result: "Second retry succeeds. Waiting longer each time gave the service room to recover.",
        turns: 3,
      },
      {
        id: "hammer",
        label: "Retry immediately, as many times as it takes",
        tone: "bad",
        result: "Forty instant retries pile onto a struggling service, and the turn limit is hit.",
        turns: 12,
      },
      {
        id: "quit",
        label: "Give up and tell the customer it can't be done",
        tone: "ok",
        result: "Safe, but a one-second hiccup became a failed request.",
        turns: 1,
      },
    ],
  },
  {
    id: "badinput",
    title: "The order id is rejected",
    error: "Error: order_id must look like 'A-1234'. You sent '1234'. Did you mean 'A-1234'?",
    options: [
      {
        id: "fix",
        label: "Read the message and correct the call",
        tone: "good",
        result: "The corrected call works first time. The error explained exactly what to change.",
        turns: 1,
      },
      {
        id: "retry",
        label: "Retry the same call with backoff",
        tone: "bad",
        result: "Waiting doesn't fix a wrong input; the same error comes back three times.",
        turns: 3,
      },
      {
        id: "ask",
        label: "Ask the customer for their order id again",
        tone: "ok",
        result: "Works, but annoys a customer who already gave it.",
        turns: 2,
      },
    ],
  },
  {
    id: "unknown",
    title: "The refund call times out after sending",
    error: "Error: no response from refunds service. The refund may or may not have been made.",
    options: [
      {
        id: "key",
        label: "Retry with the same idempotency key",
        tone: "good",
        result:
          "The service recognises the key and replies 'already refunded'. One refund, not two.",
        turns: 1,
      },
      {
        id: "blind",
        label: "Just call refund again",
        tone: "bad",
        result: "The first call had gone through. The customer is refunded twice.",
        turns: 1,
      },
      {
        id: "human",
        label: "Stop and ask a person to check",
        tone: "ok",
        result:
          "Safe, though a person spends five minutes on something the system could have handled.",
        turns: 1,
      },
    ],
  },
  {
    id: "deadend",
    title: "A dead end",
    error: "The order is in an old archive system that none of the agent's tools can reach.",
    options: [
      {
        id: "escalate",
        label: "Stop, summarise what's known and hand over to a person",
        tone: "good",
        result: "A person picks it up with the full story; the customer waits minutes, not days.",
        turns: 1,
      },
      {
        id: "flail",
        label: "Keep trying every other tool until something works",
        tone: "bad",
        result:
          "It searches unrelated systems until the turn limit, costing money and finding nothing.",
        turns: 10,
      },
      {
        id: "invent",
        label: "Answer from what seems likely",
        tone: "bad",
        result: "It tells the customer a refund date it made up.",
        turns: 1,
      },
    ],
  },
];
