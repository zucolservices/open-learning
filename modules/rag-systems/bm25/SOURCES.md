# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m06-facts.md`.

- Karen Spärck Jones, "A statistical interpretation of term specificity and its application in retrieval", Journal of Documentation 28(1), 1972: the rarity weighting later called IDF.
- Robertson, Walker, S. Jones, Hancock-Beaulieu, Gatford, "Okapi at TREC-3" (City University London; TREC-3, November 1994): "we in effect combined BM11 and BM15 into a single function BM25". Robertson & Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond", Foundations and Trends in IR 3(4), 2009: saturation (k1) and length normalisation (b).
- Apache Lucene BM25Similarity: IDF = ln(1 + (N − n + 0.5)/(n + 0.5)); since 8.0 (LUCENE-8563) the (k1 + 1) factor is dropped, which "doesn't affect ordering"; defaults k1 = 1.2, b = 0.75. BM25 default in Lucene 6.0 (2016), Elasticsearch 5.0 (2016) and OpenSearch.
- Manning, Raghavan & Schütze, Introduction to Information Retrieval (2008), §1.1: inverted index, dictionary and postings.
- Thakur et al., BEIR (NeurIPS 2021 Datasets and Benchmarks): "BM25 remains a strong baseline for zero-shot text retrieval" (with a noted lexical bias in some datasets).
- Elasticsearch language analyzers include hindi and bengali; no transliteration. Anthropic, "Introducing Contextual Retrieval" (19 September 2024): BM25 for exact matches such as "Error code TS-999".
- The stemmer here is a deliberately simple suffix stripper, not Porter or a Hindi stemmer. The passages are the made-up Kalpanagar help pages.
