# Queues & streams: storyboard

1. **The ticket rail** ⭐ (scroll story). Café analogy: waiter waits for the cook (direct call) → lunch rush, customers give up → ticket rail (queue: producers, consumer, messages) → more cooks, backpressure → receipt roll read by kitchen, bar and accounts (event log, offsets).
2. **The ticket sale** ⭐ (simulation). One hour, ~150 orders/s with a spike to ~800/s at 10:10–10:25; each consumer handles 60/s. Choose 2–16 consumers, queue vs log with 8 partitions. Backlog area chart, capacity line, consumer chips (idle beyond partition count), stats: peak backlog, longest wait (Little's law), back-to-empty time, idle consumers.
3. **How many sit idle?** (predict). 6 partitions, 10 consumers in a group → 4 idle.
4. **Deposit before withdrawal** ⭐ (experiment). Nine interleaved account events on three consumers/partitions with random processing times: competing consumers, random partition, partition by account. Timeline lanes and per-account results; "Run again" re-seeds.
5. **The poison message** (step-through). Queue vs log × dead-letter queue on/off.
6. **Queue or log?** (sort checkpoint).
7. **Queues and logs you'll meet** (landscape table per cloud and open source).
8. **What to remember**.
