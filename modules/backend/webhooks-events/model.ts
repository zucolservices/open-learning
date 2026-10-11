/** Parts of a reliable webhook pipeline for a made-up café, and scenarios that test them. Attacks described in words. */

export const PARTS: { id: string; side: "Sender" | "Receiver"; label: string }[] = [
  { id: "outbox", side: "Sender", label: "Save the order and an outbox row in one transaction" },
  { id: "retry", side: "Sender", label: "Deliver with retries, backoff and jitter" },
  { id: "sign", side: "Sender", label: "Sign each delivery (HMAC with a timestamp)" },
  { id: "verify", side: "Receiver", label: "Verify the signature and reject old timestamps" },
  { id: "dedupe", side: "Receiver", label: "Ignore webhook IDs already processed" },
  { id: "fast", side: "Receiver", label: "Reply 2xx quickly; do the work on a queue" },
];

export const SCENARIOS: {
  id: string;
  label: string;
  needs: string[];
  pass: string;
  fail: string;
}[] = [
  {
    id: "crash",
    label: "The sender crashes right after saving an order",
    needs: ["outbox"],
    pass: "The outbox row was committed with the order; the relay sends it after restart.",
    fail: "The order exists, but the partner is never told.",
  },
  {
    id: "down",
    label: "The partner is down for an hour",
    needs: ["retry"],
    pass: "Retries spread out and succeed when they're back.",
    fail: "One failed attempt; the event is lost.",
  },
  {
    id: "fake",
    label: "Someone sends a forged “order paid” webhook (described)",
    needs: ["sign", "verify"],
    pass: "No valid signature: rejected.",
    fail: "Accepted: an unpaid order is marked paid.",
  },
  {
    id: "dup",
    label: "The same webhook arrives twice",
    needs: ["dedupe"],
    pass: "The second copy is recognised and skipped.",
    fail: "The order is fulfilled twice.",
  },
  {
    id: "replay",
    label: "A genuine old webhook is replayed a day later (described)",
    needs: ["sign", "verify"],
    pass: "The timestamp is outside the 5-minute window: rejected.",
    fail: "Processed again as if new.",
  },
  {
    id: "slow",
    label: "The receiver's processing takes 20 seconds",
    needs: ["fast"],
    pass: "It replies at once, so the sender doesn't time out and retry.",
    fail: "The sender times out (GitHub waits 10 s) and the delivery counts as failed.",
  },
];
