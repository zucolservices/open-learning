# Sources: Similarity metrics (fact-checked 2026-10-05)

- Papineni et al., "BLEU" (ACL 2002): clipped n-gram precision (1–4), geometric mean, brevity penalty.
- Lin, "ROUGE" (2004): ROUGE-N recall, ROUGE-L longest common subsequence.
- Banerjee & Lavie, "METEOR" (2005).
- Zhang et al., "BERTScore" (ICLR 2020).
- Ragas docs: Semantic Similarity (formerly answer similarity).
- Liu et al., "How NOT To Evaluate Your Dialogue System" (EMNLP 2016).
- Reiter, "A Structured Review of the Validity of BLEU" (Computational Linguistics, 2018): 284 correlations.
- Chen et al., Codex paper (2021): BLEU vs functional correctness.

The live BLEU here is simplified to 1- and 2-grams for short answers; embedding scores and the meaning map are illustrative.
