# Sources (fact-checked 2026-09-25)

- Simon Willison coined "prompt injection" (Sep 2022) and named the "lethal trifecta" — access to private data + exposure to untrusted content + a way to exfiltrate — on 16 Jun 2025 (simonwillison.net/2025/Jun/16/the-lethal-trifecta/).
- Greshake et al., "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection" (arXiv 2302.12173, 2023).
- OWASP Top 10 for LLM Applications (2025): LLM01 Prompt Injection at #1; a 2026 edition (3 Aug 2026) keeps prompt injection at #1 (genai.owasp.org/llm-top-10/).
- Mitigations: Microsoft "spotlighting" (arXiv 2403.14720); Google DeepMind CaMeL, separating control flow from data (arXiv 2503.18813); the dual-LLM / least-privilege patterns. The classic "confused deputy" framing is from capability-security literature.
- This module uses a rules-based simulation, not a live model or a working attack. Compliance rates are illustrative, chosen to reflect the documented finding that undefended assistants comply with many injections and that filtering only reduces the rate, while removing the capability or requiring human approval prevents the harm.
