# Sources: State, pauses and resumption (fact-checked 2026-10-04)

- LangGraph docs: persistence (checkpointers, threads, durability modes, time travel) and human-in-the-loop (`interrupt()`, `Command(resume=...)`; the node re-runs from its start on resume, so earlier side effects must be idempotent).
- Temporal docs (activities should be idempotent); Temporal + OpenAI Agents SDK integration (public preview 30 Jul 2025, GA 23 Mar 2026).
- Restate, DBOS, Inngest docs; AWS Step Functions (Standard vs Express); AWS Lambda durable functions (2 Dec 2025).
- OpenAI Agents SDK sessions and RunState; OpenAI Conversations API; Claude Agent SDK sessions (continue, resume, fork).

The refund scenario and run counts are illustrative; the code is simplified.
