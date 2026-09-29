import type { GlossaryEntry } from "./types";

/** RAG Systems track glossary. `module` slugs refer to this track. */
export const ragSystems = {
  rag: {
    term: "Retrieval-augmented generation (RAG)",
    definition:
      "Searching a collection of documents for passages relevant to a question, then giving those passages to a language model with the question so it answers from them. Named by Lewis et al. (2020).",
    module: "why-rag",
  },
  "parametric-memory": {
    term: "Parametric memory",
    definition:
      "What a model knows from training, stored in its weights (parameters). Lewis et al. (2020) contrast it with a searchable document index.",
    module: "why-rag",
  },
  "non-parametric-memory": {
    term: "Non-parametric memory",
    definition:
      "Knowledge kept outside the model, in a searchable collection of documents, and looked up when needed. It can be updated without retraining.",
    module: "why-rag",
  },
  "knowledge-cutoff": {
    term: "Knowledge cutoff",
    definition:
      "The point after which a model's training data stops. The model knows nothing that happened, or was written, after it.",
    module: "why-rag",
  },
  "fine-tuning": {
    term: "Fine-tuning",
    definition:
      "Training an existing model further on your own examples, which changes its weights. Good for tone, format and behaviour; a slow and unreliable way to add new facts.",
    module: "why-rag",
  },
  ingestion: {
    term: "Ingestion",
    definition:
      "The half of a RAG system that runs ahead of time: parsing documents, splitting them into chunks, embedding the chunks and storing them in an index. It runs again when documents change.",
    module: "rag-end-to-end",
  },
  chunk: {
    term: "Chunk",
    definition:
      "One piece of a document (often a paragraph or a few hundred tokens) that is embedded and retrieved as a unit.",
    module: "rag-end-to-end",
  },
  "vector-index": {
    term: "Vector index",
    definition:
      "A store of embedding vectors organised so that the vectors closest to a query can be found quickly.",
    module: "rag-end-to-end",
  },
  "top-k-retrieval": {
    term: "Top-k retrieval",
    definition:
      "Returning the k passages that score highest for a question (for example the top 3) and passing only those to the model.",
    module: "rag-end-to-end",
  },
  parsing: {
    term: "Parsing (documents)",
    definition:
      "Extracting clean, correctly ordered text and structure (headings, tables) from files such as PDFs, scans and Office documents, before chunking.",
    module: "parsing",
  },
  ocr: {
    term: "OCR",
    definition:
      "Optical character recognition: reading letters from an image of a page. Needed for scans and photos, which contain no text layer. Numbers and symbols such as ₹ are easily misread.",
    module: "parsing",
  },
  "text-layer": {
    term: "Text layer",
    definition:
      "The machine-readable characters inside a PDF. Scanned PDFs usually have none, only a picture of each page, until OCR adds one.",
    module: "parsing",
  },
  "legacy-font": {
    term: "Legacy (non-Unicode) font",
    definition:
      "Fonts such as Kruti Dev that draw Devanagari shapes over Latin character codes. Text typed in them copies out as Latin gibberish and needs conversion to Unicode.",
    module: "parsing",
  },
  "chunk-overlap": {
    term: "Chunk overlap",
    definition:
      "Repeating the end of one chunk at the start of the next, so a sentence cut at a boundary still appears whole somewhere. Often 10–25% of the chunk size.",
    module: "chunking",
  },
  "chunk-size": {
    term: "Chunk size",
    definition:
      "How much text goes into each chunk, counted in characters or tokens. Too small loses context; too big blurs meaning and distracts the model.",
    module: "chunking",
  },
  "parent-child-chunks": {
    term: "Parent–child chunks",
    definition:
      "Indexing small chunks for precise search but returning the larger section each came from: 'search small, return big'.",
    module: "chunking",
  },
  "index-freshness": {
    term: "Index freshness",
    definition:
      "How closely the search index matches the current documents. A stale index keeps retrieving old, replaced or withdrawn text.",
    module: "metadata-freshness",
  },
  "metadata-filter": {
    term: "Metadata filter",
    definition:
      "A condition on chunk metadata (such as status = current, department or language) applied during search, so only matching chunks can be retrieved.",
    module: "metadata-freshness",
  },
  "chunk-metadata": {
    term: "Chunk metadata",
    definition:
      "Fields stored alongside each chunk's text and vector: document ID, title, dates, status, language, access rights. Used for filtering, citations and updates.",
    module: "metadata-freshness",
  },
  "inverted-index": {
    term: "Inverted index",
    definition:
      "For every word in a collection, the list of documents that contain it (and how often). It lets keyword search look up only the query's words instead of reading every document.",
    module: "bm25",
  },
  bm25: {
    term: "BM25",
    definition:
      "The standard keyword-ranking formula (Okapi BM25, from City University London in the 1990s). It adds up each query word's weight: rarer words count more, repeats saturate, and long documents are discounted.",
    module: "bm25",
  },
  idf: {
    term: "IDF (inverse document frequency)",
    definition:
      "How rare a word is across the collection. Words found in few documents get a high IDF and count for more. The idea comes from Karen Spärck Jones (1972).",
    module: "bm25",
  },
  stemming: {
    term: "Stemming",
    definition:
      "Cutting words down to a common stem (days → day, renewed → renew) so different forms match in keyword search. Language-specific.",
    module: "bm25",
  },
  "stop-words": {
    term: "Stop words",
    definition:
      "Very common words such as the, for and to, often dropped before keyword indexing because they say little about which document is relevant.",
    module: "bm25",
  },
  "dense-retrieval": {
    term: "Dense retrieval",
    definition:
      "Search by meaning: questions and passages are turned into embedding vectors by the same model, and the passages whose vectors are most similar to the question's are returned.",
    module: "embeddings-retrieval",
  },
  mteb: {
    term: "MTEB",
    definition:
      "The Massive Text Embedding Benchmark (2023), and its multilingual successor MMTEB: public leaderboards comparing embedding models on many tasks. Useful for shortlisting, not a substitute for testing on your own data.",
    module: "embeddings-retrieval",
  },
  "romanised-hindi": {
    term: "Romanised Hindi",
    definition:
      "Hindi written in Latin letters (“sukha kachra”), common in chats and search boxes. Many models handle it much worse than Hindi in Devanagari.",
    module: "embeddings-retrieval",
  },
  matryoshka: {
    term: "Matryoshka embeddings",
    definition:
      "Embeddings trained (Kusupati et al., 2022) so that the first part of each vector is useful on its own, like nested dolls: you can cut 3072 numbers down to 256 to save storage, with a modest loss in quality. Only works for models trained this way.",
    module: "embeddings-retrieval",
  },
  ann: {
    term: "Approximate nearest-neighbour (ANN) search",
    definition:
      "Finding vectors close to a query without comparing it with every stored vector. Much faster than exact search, occasionally missing the true nearest one.",
    module: "vector-indexes",
  },
  hnsw: {
    term: "HNSW",
    definition:
      "Hierarchical Navigable Small World: a layered graph index for vectors (Malkov & Yashunin). Search starts on a sparse top layer and hops greedily down to the dense bottom layer. The most widely used vector index.",
    module: "vector-indexes",
  },
  ivf: {
    term: "IVF (inverted file index)",
    definition:
      "A vector index that groups vectors into clusters ahead of time and, at query time, searches only the few clusters nearest the query (the nprobe setting).",
    module: "vector-indexes",
  },
  "recall-at-k": {
    term: "Recall@k (for vector indexes)",
    definition:
      "The share of the true k nearest neighbours that an approximate index returns. 99% recall@10 means it misses about one in a hundred.",
    module: "vector-indexes",
  },
  "quantization-vectors": {
    term: "Vector quantization",
    definition:
      "Storing each number in a vector with fewer bits (float32 → int8 → 1 bit, or product quantization codes) to save memory, trading a little accuracy. Often paired with an exact re-check of the top results.",
    module: "vector-indexes",
  },
  "hybrid-search": {
    term: "Hybrid search",
    definition:
      "Running keyword search (such as BM25) and vector search on the same question and merging the two ranked lists, so each covers the other's blind spots.",
    module: "hybrid-search",
  },
  rrf: {
    term: "Reciprocal rank fusion (RRF)",
    definition:
      "Merging ranked lists by giving each item 1/(k + its rank) from every list and adding them up (Cormack, Clarke & Büttcher, 2009; k = 60 is the usual default, though some engines use other values). Uses only positions, so scores on different scales don't matter.",
    module: "hybrid-search",
  },
  "learned-sparse": {
    term: "Learned sparse retrieval",
    definition:
      "A model (such as SPLADE, or bge-m3's sparse mode) that turns text into keyword-style weights, including related words that don't appear in it, so it can be searched like an inverted index.",
    module: "hybrid-search",
  },
  reranker: {
    term: "Reranker",
    definition:
      "A second, more careful model that re-scores a shortlist of retrieved passages against the question, then reorders them. Usually a cross-encoder; sometimes an LLM.",
    module: "reranking",
  },
  "cross-encoder": {
    term: "Cross-encoder",
    definition:
      "A model that reads the question and a passage together and outputs one relevance score. More accurate than comparing separate embeddings (a bi-encoder), but it must run once per pair, so it's used only on a shortlist.",
    module: "reranking",
  },
  "relevance-threshold": {
    term: "Relevance threshold",
    definition:
      "A cut-off on reranker scores below which passages are dropped before the model sees them. Must be chosen per model by testing on labelled questions.",
    module: "reranking",
  },
  "query-rewriting": {
    term: "Query rewriting",
    definition:
      "Using a language model to turn a user's question into a better search query before retrieval: making a follow-up standalone, fixing wording, translating. Costs an extra model call and can go wrong.",
    module: "query-understanding",
  },
  hyde: {
    term: "HyDE (hypothetical document embeddings)",
    definition:
      "Asking a model to draft an answer to the question, then searching with the draft's embedding instead of the question's (Gao et al., 2023). The draft may contain invented details, so it's used only for search.",
    module: "query-understanding",
  },
  "multi-query": {
    term: "Multi-query retrieval",
    definition:
      "Searching with several versions of a question (the original plus rewrites) and merging the results, often with reciprocal rank fusion.",
    module: "query-understanding",
  },
  "query-decomposition": {
    term: "Query decomposition",
    definition:
      "Splitting a complex or multi-part question into simpler sub-questions and searching for each separately.",
    module: "query-understanding",
  },
  "contextual-retrieval": {
    term: "Contextual retrieval",
    definition:
      "Before indexing, asking a model to write a sentence or two that places each chunk in its document, and sticking that note on the front of the chunk for both vector and keyword search (Anthropic, 2024). The chunk's own words stay unchanged.",
    module: "contextual-retrieval",
  },
  "late-chunking": {
    term: "Late chunking",
    definition:
      "Embedding a whole document's tokens in one go and only then cutting the result into chunk vectors, so each vector carries some of the document's context without any model-written notes (Günther et al., 2024). Needs a long-context embedding model.",
    module: "contextual-retrieval",
  },
  abstention: {
    term: "Abstention",
    definition:
      "A model declining to answer, for example \"I don't know; the passages don't cover this\", instead of guessing. A RAG prompt should say exactly when and how to abstain, though models don't always follow it.",
    module: "prompt-assembly",
  },
  "grounded-citation": {
    term: "Citation (in RAG)",
    definition:
      "A marker in an answer, such as [2], pointing to the passage a statement came from, so a reader can check it. Many providers return citations as structured data. A citation points; it doesn't prove the passage supports the claim.",
    module: "prompt-assembly",
  },
  "lost-in-the-middle": {
    term: "Lost in the middle",
    definition:
      "The finding (Liu et al., 2023) that language models used information at the start or end of a long prompt better than information in the middle. Newer models show less of this on simple lookups, but long, noisy prompts still hurt.",
    module: "prompt-assembly",
  },
} satisfies Record<string, GlossaryEntry>;
