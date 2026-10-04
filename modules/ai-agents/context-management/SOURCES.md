# Sources: Managing long tasks (fact-checked 2026-10-04)

- N. F. Liu et al., "Lost in the Middle: How Language Models Use Long Contexts", arXiv 2023; TACL vol. 12 (2024), pp. 157–173.
- K. Hong, A. Troynikov, J. Huber, "Context Rot", Chroma technical report (14 Jul 2025; 18 models; not peer-reviewed).
- Anthropic engineering, "Effective context engineering for AI agents" (29 Sep 2025): compaction, structured note-taking, sub-agents returning "often 1,000-2,000 tokens", just-in-time retrieval, "smallest possible set of high-signal tokens".
- Anthropic, "How we built our multi-agent research system" (13 Jun 2025): ~4× and ~15× chat tokens.
- Anthropic, "Effective harnesses for long-running agents" (26 Nov 2025): progress file plus git history.
- Claude Code docs (/compact, auto-compaction); Claude API compaction (beta); OpenAI Responses API compaction.

The 200-step task, quality curve and token counts are illustrative; the middle chart shows the shape of the effect only.
