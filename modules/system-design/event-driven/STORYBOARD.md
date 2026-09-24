# Event-driven architecture: storyboard

1. **Rewire the checkout** ⭐ (build & connect). Engagement-news analogy (phone each relative vs post in the family group). Checkout wired by direct calls to Stock, Email, Loyalty; learner adds Analytics / Fraud review / Recommendations and can take Email down. Switch to publishing OrderPlaced on an event bus. Stats: checkout wait (sum of calls vs publish), checkout changes needed, effect of Email outage.
2. **Command or event?** (sort checkpoint).
3. **Four things called "event-driven"** (Fowler 2017): notification, event-carried state transfer, event sourcing (replay slider over a ledger), CQRS; pros and cons for each.
4. **Change the event, break the consumers** ⭐ (fix-the-problem). Add optional / remove / rename / change type vs Email, Loyalty, Analytics consumers; a schema registry (FULL compatibility) blocks breaking changes.
5. **Event or call?** (choice checkpoint): the payment result the customer waits for is a request.
6. **Event plumbing you'll meet**: EventBridge / SNS→SQS, Event Grid, Eventarc, Kafka + registry, CloudEvents, AsyncAPI.
7. **What to remember**.
