# The scheduler (Kubernetes, module 14)

1. **Seating wedding guests** (analogy): rule out, rank, seat = filter, score, bind.
2. **Be the scheduler** ⭐ (simulation): five nodes (zones, disks, free CPU, a GPU taint, existing api pods); toggle node affinity, toleration, anti-affinity, zone preference, bigger request; per-node filter reasons and scores; toleration trap; Pending when nothing fits.
3. **Spread across zones** (simulation): six replicas with and without a zone spread constraint; zone b failure.
4. **More levers** (explore): priority and preemption, MostAllocated, DRA, gang scheduling, affinity at scale.
5. **Which tool?** (sort checkpoint).
6. **Wrap**.
