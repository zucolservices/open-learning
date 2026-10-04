# Sources: Code-based checks (fact-checked 2026-10-05)

- Chen et al., "Evaluating Large Language Models Trained on Code" (Codex, 2021): HumanEval (164 problems, ~7.7 tests each); unbiased pass@k estimator; naive 1−(1−p)^k is biased. Kulal et al. (2019) introduced pass@k.
- Rajpurkar et al., SQuAD (2016) and the official evaluation script: exact match and token F1 with normalisation.
- Hugging Face Open LLM Leaderboard DROP analysis (Dec 2023): answers followed by a newline marked wrong.
- OpenAI, "Introducing Structured Outputs in the API" (6 Aug 2024): schema conformance with strict mode on OpenAI's evals.
- Jimenez et al., SWE-bench (2023): FAIL_TO_PASS and PASS_TO_PASS tests.

Answers and outputs are illustrative.
