# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m04-facts.md`.

- intfloat/multilingual-e5-small model card: 512 tokens; "Long texts will be truncated".
- LangChain RecursiveCharacterTextSplitter: separators ["\n\n", "\n", " ", ""]; defaults 4000 / 200 characters. ParentDocumentRetriever (now in langchain_classic).
- LlamaIndex: SentenceSplitter 1024 tokens / 200 overlap; HierarchicalNodeParser [2048, 512, 128]; AutoMergingRetriever.
- Amazon Bedrock Knowledge Bases: default about 300 tokens, sentences kept whole; fixed, hierarchical, semantic, none. Azure AI Search guidance: 512 tokens, 25% overlap. OpenAI file search: 800 tokens / 400 overlap. Google RAG Engine (Gemini Enterprise Agent Platform): 1,024 / 256.
- Smith & Troynikov (Chroma), "Evaluating Chunking Strategies for Retrieval" (3 July 2024): recall moved by up to 9%; default settings "can lead to relatively poor performance". Vendor report.
- Qu et al., "Is Semantic Chunking Worth the Computational Cost?" (Findings of NAACL 2025): cost "not justified by consistent performance gains".
- Greg Kamradt, "5 Levels Of Text Splitting" (2024); LangChain SemanticChunker.
- Günther et al. (Jina AI), "Late Chunking" (arXiv 2409.04701): about 2.7–3.6% relative nDCG@10 gains; needs a long-context, mean-pooling embedding model.
- OpenAI help: 1 token ≈ 4 characters of English; other languages differ.
- The rules documents and questions are made up. Retrieval and answers are real model output, unedited.
