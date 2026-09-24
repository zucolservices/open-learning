# Capstone: the outage: storyboard

1. **Paged at 21:02** ⭐ Page banner (burn rate) and four clickable dashboards 20:50–21:02 (API requests incl. retries, error rate, cache hit ratio, DB CPU) with a 20:58 deploy marker; notes per panel.
2. **What moved first?** (choice): the cache hit ratio when cache node 3 restarted.
3. **Follow a failing request** (step-through): trace with three immediate retries; inside one attempt (cache miss, DB pool exhausted); repeated misses for the same key (stampede); the self-sustaining loop (metastable failure).
4. **Trigger, amplifier or symptom?** (sort).
5. **Stop the outage** ⭐ (simulation, `model.ts`): shed load (21:02), retry budget (21:03), restart all (21:05, harmful), replicas (21:12), coalescing (21:20). Success % over 21:00–21:30, DB saturation strip, recovery time.
6. **After the fire** (order): declare, mitigate, confirm, blameless postmortem, permanent fixes.
7. **What to remember** (track finale).
