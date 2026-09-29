# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m11-facts.md`.

- Gao, Ma, Lin & Callan, "Precise Zero-Shot Dense Retrieval without Relevance Labels" (ACL 2023): the hypothetical document is "'fake' and may contain hallucinations"; the encoder's retrieval step grounds it; comparable to fine-tuned retrievers.
- Ma et al., "Query Rewriting for Retrieval-Augmented Large Language Models" (EMNLP 2023, Rewrite-Retrieve-Read).
- LangChain (langchain-classic): history-aware retriever, MultiQueryRetriever (unique union). LlamaIndex CondenseQuestionChatEngine and RouterQueryEngine. Adrian Raudaschl, RAG-Fusion (October 2023). OpenAI latency guide: small model for rewriting, example "How long does the return policy cover?".
- Zhou et al., Least-to-Most (ICLR 2023); Press et al., Self-Ask (Findings of EMNLP 2023); Zheng et al., Step-Back (ICLR 2024).
- AI4Bharat IndicXlit (21 languages, MIT); Gala et al., IndicTrans2 (TMLR 2023, 22 scheduled languages); Bhashini API terms (PoC use unless paid). Roy et al., Dakshina (LREC 2020): South Asian languages often typed in Latin script.
- Amazon Bedrock Knowledge Bases query decomposition; Azure AI Search query rewrite (preview; may drop exact codes).
- Questions and passages are made up; rewrites and rankings are real, unedited model output.
