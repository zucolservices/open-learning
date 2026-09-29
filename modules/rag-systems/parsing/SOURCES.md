# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m03-facts.md`. All extraction output in this module is real, produced on 29 September 2026 from PDFs and a scan generated for it (`scratchpad/rag/parse/`: gen.mjs, degrade.py, extract.py).

- ISO 32000-1 (PDF): pages are content streams placing glyphs; logical structure only in tagged PDF (§14.8); text extraction depends on ToUnicode maps.
- Poppler pdftotext man page: default mode outputs "text in reading order"; -layout keeps the physical layout; -raw uses content-stream order and is "no longer recommended".
- Tesseract 5.5 (Apache-2.0): LSTM engine since 4.0; hin and script/Devanagari models; -l hin+eng; 300 DPI or more recommended.
- OmniDocBench (CVPR 2025): accuracy drops on multi-column and complex layouts.
- Tools and licences: Docling (MIT; IBM Research, now LF AI & Data), Unstructured (Apache-2.0 + platform), Marker (Apache-2.0 code since July 2026; OpenRAIL-M-based weights), MinerU (Apache-2.0 with additional terms, since April 2026), pdfplumber (MIT), PyMuPDF (AGPL or commercial), Poppler (GPL); Azure Document Intelligence in Foundry Tools (printed Hindi only), Amazon Textract (no Hindi: English, Spanish, Italian, Portuguese, French, German), Google Document AI (Hindi listed; Gemini layout parser preview), LlamaParse (hosted), Mistral OCR (March 2025; OCR 3 December 2025), olmOCR (AI2; English-only training data).
- Legacy Hindi fonts (Kruti Dev, Chanakya) produce Latin gibberish when copied: secondary sources (Wikipedia; Digital Orientalist, December 2025). Unicode Hindi mis-extraction: PyMuPDF issue #4805.
- The documents, the city and their contents are made up.
