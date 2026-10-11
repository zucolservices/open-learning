/** Placing an order with slow side jobs (email, invoice PDF), done inline or through a queue. Illustrative. */

export interface Opts {
  queue: boolean;
  retry: boolean;
  dlq: boolean;
  idem: boolean;
}

export function outcomes(o: Opts) {
  const response = o.queue
    ? { ok: true, text: "≈ 0.2 s: order saved, jobs queued, “Order placed” shown at once." }
    : { ok: false, text: "≈ 2.3 s: the customer waits while the email sends and the PDF renders." };
  const outage = !o.queue
    ? {
        ok: false,
        text: "The request fails mid-way: the customer sees an error even though the order may be saved.",
      }
    : o.retry
      ? {
          ok: true,
          text: "Jobs retry with growing, randomised waits and succeed once the provider recovers.",
        }
      : {
          ok: false,
          text: "The email job fails once and is dropped. No confirmation is ever sent.",
        };
  const poison = !o.queue
    ? { ok: false, text: "Every attempt to place that order errors." }
    : o.dlq
      ? {
          ok: true,
          text: "After 5 failed tries it moves to a dead-letter queue for a person to inspect; other jobs carry on.",
        }
      : o.retry
        ? { ok: false, text: "It's retried forever, wasting workers and filling the logs." }
        : { ok: false, text: "It fails once and vanishes silently." };
  const dup = !o.queue
    ? { ok: true, text: "No duplicates, but no resilience either." }
    : o.idem
      ? { ok: true, text: "The worker records “email sent for order 4182”; the repeat is skipped." }
      : {
          ok: false,
          text: "A worker crashed after sending but before confirming, so the job ran again: two emails.",
        };
  return { response, outage, poison, dup };
}
