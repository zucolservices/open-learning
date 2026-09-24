# Transactions across services: storyboard

1. **One order, three databases** ⭐ (step-through). Holiday-booking analogy. Segmented 2PC / saga × failure (none, out of stock, coordinator crash). Four service boxes coloured by state; customer status line; captions per frame. 2PC coordinator crash leaves participants in doubt holding locks; the saga orchestrator resumes from its durable log.
2. **Compensation is not undo** (checkpoint). A sent email needs a correction email.
3. **Save it, and tell everyone** ⭐ (fix-the-problem). Dual write: crash after save / publish-then-save-fails / duplicate delivery × toggles outbox and idempotent consumer. Code block switches between naive and outbox versions.
4. **Exactly once?** (checkpoint). Outbox gives at-least-once; consumers deduplicate.
5. **Saga engines you'll meet**: Step Functions, Temporal, Durable Functions, Cloud Workflows, Camunda, Debezium outbox router.
6. **What to remember**.
