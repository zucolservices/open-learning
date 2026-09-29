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
} satisfies Record<string, GlossaryEntry>;
