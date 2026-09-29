# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m16-facts.md`.

- Yao et al., ReAct (ICLR 2023): interleaved reasoning and search; repetitive loops and unhelpful searches among its failure modes. Trivedi et al., IRCoT (ACL 2023); Jiang et al., FLARE (EMNLP 2023); Asai et al., Self-RAG (ICLR 2024); Jin et al., Search-R1 (COLM 2025); Singh et al., agentic RAG survey (arXiv, v4 2026).
- Xie et al. (EACL 2026): accuracy plateaus around seven searches while cost rises; more search reduced abstention. HiPRAG (ICLR 2026): over- and under-search.
- Framework limits: OpenAI Agents SDK `DEFAULT_MAX_TURNS = 10`; LlamaIndex agents 20 iterations; LangGraph recursion limit raised from 25 (thousands in 2026).
- Anthropic, "How we built our multi-agent research system" (13 June 2025): agents about 4× the tokens of chat, multi-agent about 15×. Deep research launches: Gemini (Dec 2024), OpenAI (Feb 2025, 5–30 min), Perplexity (Feb 2025, 2–4 min), Claude Research (Apr 2025).
- Model Context Protocol: introduced by Anthropic 25 Nov 2024; donated to the Agentic AI Foundation (Linux Foundation) 9 Dec 2025; specification 2026-07-28 (tools, resources, prompts; stdio and Streamable HTTP; roots and sampling deprecated). Simon Willison, "The lethal trifecta" (16 June 2025).
- Managed: Azure AI Search agentic retrieval (minimal retrieval GA in REST 2026-04-01; query planning preview); Amazon Bedrock managed knowledge base agentic retriever, AgentCore; OpenAI file_search in the Responses API.
- Phi-4-mini-instruct model card (3.8B, MIT): supports function calling; may hallucinate function names.
- The illustration in step 2 and the MCP server examples are written by us; the traces in step 3 are real, unedited Phi-4-mini output.
