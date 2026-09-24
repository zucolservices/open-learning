# Timeouts, circuit breakers & rate limiting: storyboard

1. **One slow service** ⭐ (simulation, `sim.ts`). Call-centre-on-hold analogy. 200 pages/s, 40 threads; Recommendations goes from ~50 ms to ~4 s between 10 s and 30 s; visitors give up after 2 s in the queue. Toggles: 300 ms timeout, circuit breaker (>50% of last 20 failed → open 5 s → one probe), bulkhead (30 concurrent recs calls). Stacked bars: full page / page without recs / gave up; breaker-open strip. Lessons: nothing → site down; timeout alone still fails (330 ms per page); breaker alone never trips; timeout + breaker or bulkhead → no failures.
2. **Inside a circuit breaker** (step-through): closed → failures → open → half-open → closed.
3. **Why didn't the breaker trip?** (choice).
4. **Rate limiting** ⭐ (`limiter.ts`): token bucket (rate, bucket size, level line), fixed window (boundary double burst), sliding window, over a scripted trickle + bursts; 429s.
5. **What to drop first** (order checkpoint): load shedding priorities.
6. **Where these live**: deadlines, Resilience4j/Polly, Envoy/Istio, API gateways, SRE load shedding, 429 + Retry-After.
7. **What to remember**.
