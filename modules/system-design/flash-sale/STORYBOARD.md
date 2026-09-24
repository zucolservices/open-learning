# Design a flash-sale booking system: storyboard

1. **The last ticket** ⭐ Bakery's last cake analogy. Step-through of two buyers reading stock = 1, both creating orders and both writing 0 (lost update).
2. **10:00:00** ⭐ (simulation, `model.ts`). 1,000 tickets, a million buyers in ten seconds. Approaches: read-then-write, row lock, conditional update, in-memory atomic counter, waiting room. Stats: sold (oversell), time to sell out, database peak load, errors, rest of site, who wins. Illustrative capacities (20k queries/s, 500 connections).
3. **Why can't it oversell?** (choice): the conditional update checks and changes atomically.
4. **Held, but never paid for** ⭐ (fix-the-problem): 100-seat grid (×10) from 10:00 to 10:20; 30% abandon; without hold expiry 300 seats stay held; with a 10-minute expiry they go to the next buyers.
5. **Why shuffle the queue?** (choice): randomised pre-queue for fairness.
6. **In the real world**: Ticketmaster 2022, IRCTC Tatkal, Alibaba 2020, waiting-room products, SKIP LOCKED and conditional writes.
7. **What to remember**.
