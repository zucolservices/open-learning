# Capstone: a scheme assistant: storyboard

1. **The brief**: two made-up KMC schemes (water help, schoolgirl cycle), each as an English and a Hindi page with the same facts, mixed with the 32 passages from earlier modules (the usual ₹3,000 deposit conflicts with the scheme's ₹500 on purpose). Test set: 8 questions (English, Hindi, romanised Hindi, one unanswerable). Real-world anchor: myScheme (over 5,000 schemes, Hindi and English chatbot).
2. **Make your choices** (branching): chunking (page / section with title / sentence), search (keyword BM25 / multilingual-e5 vector / hybrid RRF), reranker (none / bge-reranker-v2-m3 top 10 → 3), prompt (basic / strict). 36 designs.
3. **Run the test set** ⭐ (real output): score of 8, rank among 36, per question: found or not, passages sent, Phi-4-mini's answer and our note.
4. **All 36 designs** ⭐: every design ranked; average by choice (sections 6.7, pages 6.4, sentences 5.0; hybrid 6.6, vector 6.2, keyword 5.3; reranker 6.2 vs 5.9; strict 6.5 vs basic 5.6). Five designs scored 8/8.
5. **Ready to launch?** (choice): grow the test set from real questions, check by hand, launch small with logging.
6. **What to remember**.

Data: `scratchpad/rag/r22/` (`schemes.json`, `questions.json` written by us; `embed/r22.mjs` runs all 36 designs; 288 results, 194 unique prompts → 139 distinct answers). Grading: each question's required facts (regex), a loop detector, then every distinct answer read by hand; five overrides (German answer, garbled text, wrong actor for Form C-1, schemes mixed up, invented expansion of KMC) in `overrides.json`. Answers in German, Spanish or French (from "answer in the same language as the question") count as wrong.
