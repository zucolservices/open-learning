# Multimodal RAG: storyboard

1. **Reading a report aloud** (analogy): a colleague reads the words but can only say "there's a bar chart".
2. **Three ways to read a page** (cards): extract text, describe images, look at the page.
3. **What the index holds** ⭐ (comparison, real output): four made-up report pages (`public/rag/multimodal/`, drawn with matplotlib: summary text, pie with printed labels, bar chart with no value labels, table). Tesseract 5.5 OCR vs Qwen2-VL-2B (q4, Transformers.js, pages resized to 448×560) descriptions, with hand-written notes on each (chart values lost; "1004"; 11 → "; Water 54% for 34%; invented "Financial Statements" section; "Lake Flood").
4. **Ask the report** ⭐ (comparison, real output): three questions × four pipelines: OCR + e5 + Phi-4-mini; description + e5 + Phi-4-mini; Qwen2-VL-2B on the page image; SmolVLM-500M on the page image. Lowest ward (only in bar heights): W4 (invented), "I don't know" (wrong page), W9 ✓, W1. Garbage share and average: all right.
5. **Searching page images** (explore, illustration): patch grid over the chart page; ColPali numbers; ViDoRe V3 mixed evidence.
6. **Where to start** (choice): layered text extraction + vision model on chart pages.
7. **What to remember** (+ managed options).

Data: `scratchpad/rag/r17/pages.py`, OCR `*.ocr.txt`, `embed/r17a.mjs` (SmolVLM-500M-Instruct), `embed/r17b.mjs` (Qwen2-VL-2B-Instruct, q4; q4f16 crashed on CPU), `embed/r17c.mjs` (e5 retrieval + Phi-4-mini answers). Direct image questions add "Answer briefly."; the page is given, not retrieved.
