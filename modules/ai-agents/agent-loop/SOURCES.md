# Sources: The agent loop (fact-checked 2026-10-04)

- S. Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models", arXiv 6 Oct 2022, ICLR 2023 (ALFWorld +34 points, WebShop +10; lower than chain-of-thought on HotpotQA).
- E. Karpas et al., "MRKL Systems", AI21 Labs, May 2022; T. Schick et al., "Toolformer", Meta AI, Feb 2023.
- OpenAI docs: function calling ("also known as tool calling"); OpenAI Agents SDK (`max_turns` default 10, `MaxTurnsExceeded`).
- Anthropic docs: tool use (`stop_reason` "tool_use" / "end_turn"); "Building effective agents" (Dec 2024): stopping conditions such as a maximum number of iterations.

The delivery conversation and the ReAct-style trace are illustrative.
