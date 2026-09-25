# Sources (fact-checked 2026-09-25)

- Kalai, Nachum, Vempala and Zhang, "Why Language Models Hallucinate" (arXiv 2509.04664, 4 Sep 2025; published in Nature, 2026, as "Evaluating large language models for accuracy incentivizes hallucinations"): binary grading rewards guessing over abstaining. OpenAI's write-up (openai.com/index/why-language-models-hallucinate): SimpleQA, gpt-5-thinking-mini 22% accuracy / 52% abstention / 26% error vs o4-mini 24% / 1% / 75%.
- SimpleQA (Wei et al., OpenAI, 2024): 4,326 short factual questions graded correct / incorrect / not attempted.
- Manakul, Liusie and Gales, "SelfCheckGPT" (EMNLP 2023): inconsistency across sampled answers signals hallucination.
- Facts used as ground truth: Jana Gana Mana written by Rabindranath Tagore and first sung in 1911, adopted as the national anthem on 24 Jan 1950; India won the 2025 ICC Champions Trophy (final 9 Mar 2025); previous edition 2017. Kirana Express, its founders and the novel "Monsoon Ledgers" are invented.
- Model outputs: onnx-community/Qwen2.5-1.5B-Instruct, 4-bit ONNX (Transformers.js v4); greedy decoding for the three modes, temperature 1.0 for the five samples; next-token probabilities are exact softmax values. Verdicts (correct / declined / wrong) were assigned by us by reading each answer.
