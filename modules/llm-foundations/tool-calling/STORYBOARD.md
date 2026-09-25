# Structured output & tool calling: storyboard

1. **Prose breaks code** (real outputs): four replies from the prompting module go through the browser's own JSON.parse; prose and even a fenced JSON reply crash the ticket software.
2. **Only valid words allowed** ⭐ (real probabilities): next-token distributions from Qwen2.5-1.5B-Instruct at a JSON slot for three emails; toggle "schema enforced" to strike invalid tokens and renormalise. Shape is guaranteed, judgement isn't.
3. **The tool-calling loop** ⭐ (step-through): four customer messages, real model replies: order status (tool call → result → answer), Sunday delivery (model skips the tool; force a tool call), refund (model requests money movement unprompted; held for approval), thanks (no tool). Actor strip: your app ⇄ model ⇄ your code.
4. **Break the schema** (sandbox): edit issue_refund arguments; three layers (JSON, schema, business rules) and what your code does at each failure.
5. **Put the loop in order** (order checkpoint).
6. **Run it, or ask first?** (sort checkpoint): reads run; money, cancellations and outbound messages wait for a person (MCP consent rule).
7. **Names you'll meet**: OpenAI / Anthropic / Gemini / open-model names for tools, tool_choice and guaranteed output; MCP.
8. **What to remember**.
