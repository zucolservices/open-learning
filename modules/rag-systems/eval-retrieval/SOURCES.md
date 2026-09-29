# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m18-facts.md`.

- Manning, Raghavan & Schütze, *Introduction to Information Retrieval* (2008), ch. 8: precision, recall, MAP, nDCG (2^rel − 1 gain). trec_eval / pytrec_eval / ranx: nDCG with linear gain and log2(i+1) discount; ranx `ndcg_burges` for the exponential gain. Järvelin & Kekäläinen, "Cumulated gain-based evaluation of IR techniques" (ACM TOIS 20(4), 2002).
- Voorhees, TREC-8 Question Answering Track (1999): mean reciprocal rank over 200 questions, 0 if no correct answer in the top 5.
- ir_measures: Success@k (hit rate) is sometimes mislabelled Recall@k.
- Voorhees & Buckley, "The effect of topic set size on retrieval experiment error" (SIGIR 2002): error rates "larger than anticipated". Smucker, Allan & Carterette (CIKM 2007): paired randomization, bootstrap or t-test; avoid Wilcoxon and sign tests.
- Thakur et al., BEIR (NeurIPS 2021 Datasets & Benchmarks): nDCG@10; TREC-COVID hole analysis (up to 31.8% unjudged in top 10; ANCE 0.654 → 0.735 after judging). MTEB: nDCG@10 main retrieval metric; "rarely measures what you care about" (MTEB blog).
- Chroma, "Evaluating Chunking Strategies for Retrieval" (July 2024): ID-based labels can't handle re-chunking.
- Tools: ranx, pytrec_eval-terrier, ir_measures, Ragas, Arize Phoenix (Elastic-2.0), LangSmith, Microsoft Foundry evaluators, Amazon Bedrock RAG evaluation (GA Mar 2025; context relevance and coverage), Google Agent Search search-quality evaluation (preview).
- Questions and labels are ours; rankings are real output of the models named in the storyboard.
