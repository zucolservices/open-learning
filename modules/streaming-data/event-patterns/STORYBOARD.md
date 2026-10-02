# Event-driven patterns (Streaming Data Systems, module 22)

1. **The passbook** (analogy): every line kept; balance is the sum; corrections are new lines.
2. **Rebuild the balance** ⭐ (step-through): replay an account's events up to any date; snapshot cuts events replayed.
3. **Separate the reads** ⭐ (simulation): deposit; event store updates at once, three read models catch up after a delay (eventual consistency); CQRS caution.
4. **A saga that undoes itself** ⭐ (step-through): reserve stock, charge payment, confirm (pivot), book delivery (retryable); choose the failing step; compensations in reverse; orchestration vs choreography.
5. **Tools and traps** (explore): event stores, Kafka caveat, orchestrators, LMAX, crypto-shredding, Fowler's four meanings.
6. **Which pattern?** (sort checkpoint).
7. **Wrap**.
