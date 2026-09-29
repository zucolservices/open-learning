# Parsing real documents: storyboard

1. **Ink on paper** (analogy): a PDF is printer instructions (letters at positions), not paragraphs; an animated reading band sweeps straight across a real two-column circular vs down each column.
2. **Three documents, three failures** ⭐ (fix the problem, real tool output): a two-column circular, a property-tax table and a tilted, noisy Hindi + English scan (all generated for this module, `scratchpad/rag/parse/`). For each: the page image, what a naive extractor produced, "what went wrong?" (three options with feedback), then "Apply the fix" with the better tool's real output and what it means for RAG. Two columns: word-sort interleaves; pdftotext default mode fixes the order (with visible debris). Table: pdftotext -raw separates numbers from headers; pdfplumber rows written as sentences with headers. Scan: no text layer; Tesseract 5.5 English-only (Hindi becomes gibberish) vs Hindi + English; the English line reads ₹200 as "2200" in both.
3. **The parsing toolbox** (explore): open-source libraries, managed services and vision-language models, each with a verified one-liner (licences as of September 2026); Hindi traps (legacy fonts, broken vowel signs).
4. **Which fix?** (sort into four): interleaved results, unlabelled numbers, an invisible circular, Latin gibberish from old Hindi files.
5. **What to remember**.
