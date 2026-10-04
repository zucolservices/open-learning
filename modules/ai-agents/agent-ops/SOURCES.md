# Sources: Cost, latency and tracing (fact-checked 2026-10-04)

- OpenTelemetry GenAI semantic conventions (open-telemetry/semantic-conventions-genai; status Development; gen_ai.* attributes; invoke_agent, execute_tool spans).
- OpenAI Agents SDK tracing docs; LangSmith; Langfuse (ClickHouse acquisition, 16 Jan 2026; MIT core); Arize Phoenix (Elastic License 2.0); Braintrust; W&B Weave; Datadog.
- Anthropic and OpenAI pricing and prompt caching docs (cache reads ~0.1× input on most Anthropic models; OpenAI discounts vary by model, up to 95%); Batch APIs (50% discount, up to 24 h).
- Anthropic, "How we built our multi-agent research system" (13 Jun 2025): ~4× chat tokens; token usage explains 80% of variance on BrowseComp.

The trace, timings, costs and eval scores are illustrative.
