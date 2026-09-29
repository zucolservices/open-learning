# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m19-facts.md`.

- Es et al., "RAGAS: Automated Evaluation of Retrieval Augmented Generation" (EACL 2024 demos): faithfulness (claims supported by context), answer relevance, context relevance; context precision/recall added later in the library (vibrantlabsai/ragas 0.4.x).
- Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" (NeurIPS 2023 D&B): GPT-4 vs humans 85% vs human-human 81% on non-tie votes (66% vs 63% with ties); GPT-4 consistent after swapping order 65% of the time; repetitive padding fooled Claude-v1 and GPT-3.5 91.3%, GPT-4 8.7%; self-preference evidence inconclusive; reference answers help.
- Bavaresco et al., JUDGE-BENCH (ACL 2025); Thakur et al., "Judging the Judges" (GEM² 2025).
- Tang et al., MiniCheck (EMNLP 2024): small fact-checkers match GPT-4 at ~400× lower cost. Vectara HHEM-2.1-Open (Apache-2.0).
- Google FACTS Grounding (Dec 2024; v2 in the FACTS Benchmark Suite, Dec 2025): multiple judge models, ineligible (evasive) answers disqualified first.
- Wu et al., ClashEval (NeurIPS 2024): models often adopt wrong retrieved content. TruLens RAG triad.
- Gao et al., ALCE (EMNLP 2023): citation recall and precision.
- Managed and tools: Amazon Bedrock RAG evaluation (correctness, completeness, helpfulness, logical coherence, faithfulness, citation precision and coverage); Microsoft Foundry groundedness/relevance evaluators; Google Gen AI evaluation; DeepEval (faithfulness checks contradiction), TruLens, Arize Phoenix, LangSmith, Promptfoo.
- Answers are real model output from earlier modules; judge outputs are real, unedited Phi-4-mini; the labels are ours.
