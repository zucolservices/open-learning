# Sources: Errors, retries and limits (fact-checked 2026-10-04)

- Anthropic docs, "Handle tool calls" (tool_result `is_error`; instructive error messages, e.g. "Rate limit exceeded. Retry after 60 seconds.").
- M. Brooker, "Exponential Backoff And Jitter", AWS Architecture Blog (4 Mar 2015).
- Stripe API docs: idempotent requests; B. Leach, "Implementing Stripe-like Idempotency Keys in Postgres" (2017).
- OpenAI Agents SDK (`max_turns` default 10, `MaxTurnsExceeded`); LangGraph (`recursion_limit`, `GraphRecursionError`); Claude Agent SDK (`max_turns`, `max_budget_usd`).
- M. Cemri et al., "Why Do Multi-Agent LLM Systems Fail?" (MAST), NeurIPS 2025 Datasets and Benchmarks.
- Replit incident, July 2025: The Register (21 Jul), Business Insider (22 Jul), Fortune (23 Jul); Replit CEO statement.

The refund scenario, choices and turn counts are illustrative.
