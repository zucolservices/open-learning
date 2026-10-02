# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m22-facts.md` (raw pages in `m22/`).

- Martin Fowler, "Event Sourcing" (12 Dec 2005): "The fundamental idea of Event Sourcing is that of ensuring every change to the state of an application is captured in an event object"; replay and snapshots. https://martinfowler.com/eaaDev/EventSourcing.html
- Microsoft Azure Architecture Center, Event Sourcing pattern (revised 27 Mar 2026): immutable events, compensating events, versioning and upcasting. https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing
- Greg Young, "CQRS Documents" (c. 2010): CQRS "originated with Bertrand Meyer's Command and Query Separation Principle". Martin Fowler, "CQRS" (14 Jul 2011): "beware that for most systems CQRS adds risky complexity". https://martinfowler.com/bliki/CQRS.html
- Hector Garcia-Molina and Kenneth Salem, "Sagas", SIGMOD 1987: a sequence of transactions with compensating transactions that undo "from a semantic point of view". Chris Richardson, microservices.io saga pattern: choreography vs orchestration; sagas lack isolation. https://microservices.io/patterns/data/saga.html
- Azure Saga pattern: compensable, pivot and retryable transactions; idempotent steps. https://learn.microsoft.com/en-us/azure/architecture/patterns/saga . AWS Prescriptive Guidance: saga orchestration with Step Functions.
- Kurrent (formerly Event Store; EventStoreDB → KurrentDB, announced 18 Dec 2024). Oskar Dudycz on Kafka as an event store: "You don't have basic guarantees for optimistic concurrency checks." Temporal ("Durable Execution"; Cadence co-created at Uber in 2015). Netflix archived Conductor on 13 Dec 2023; conductor-oss continues.
- Martin Fowler, "The LMAX Architecture" (12 Jul 2011): "6 million orders per second on a single thread". Martin Fowler, "What do you mean by 'Event-Driven'?" (7 Feb 2017): event notification, event-carried state transfer, event sourcing, CQRS. Michiel Rook (2017) on crypto-shredding for GDPR erasure.
- Priya's account, the order saga and all amounts are illustrative.
