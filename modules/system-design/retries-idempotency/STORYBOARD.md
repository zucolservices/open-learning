# Retries, idempotency & delivery guarantees: storyboard

1. **Did it go through?** ⭐ Cheque-in-the-post analogy. Three indistinguishable timeout cases (request lost, reply lost, server slow) × never retry / retry / retry + deduplicate (at-most-once, at-least-once, effectively-once).
2. **The retry storm** ⭐ (simulation, `sim.ts`). Open-loop arrivals 800/s, server 1,000/s FIFO with no deadline awareness, 3% transient errors, 1 s client timeout, 3 attempts, stall 10–14 s. Policies none / immediate / backoff / backoff + full jitter, plus a token-bucket retry budget (0.1 token per new request, 1 per retry). Chart: sent load, useful answers, stale work, capacity. Lesson: retries fix glitches, unlimited retries cause a metastable collapse, backoff/jitter don't reduce retries in open-loop overload, the budget does.
3. **Spread them out**: 40 clients failing at once; retry histogram for fixed / exponential / exponential + full jitter vs a capacity line.
4. **Retries at every layer** (predict): 3⁵ = 243.
5. **Charged twice** ⭐ (fix-the-problem): pay, reply lost, retry → double charge; with an idempotency key the server replays the saved answer.
6. **Safe to repeat?** (sort): naturally idempotent vs needs a key.
7. **Where you'll meet this**: AWS SDKs, gRPC, Envoy, SRE book, Stripe, queues.
8. **What to remember**.
