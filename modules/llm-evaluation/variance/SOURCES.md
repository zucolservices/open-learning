# Sources: Non-determinism and reliability (fact-checked 2026-10-05)

- Horace He and Thinking Machines Lab, "Defeating Nondeterminism in LLM Inference" (Sep 2025): batch-size dependence; 1,000 temperature-0 requests, 80 unique completions, identical for 102 tokens (Queens, New York vs New York City); batch-invariant kernels give 1,000 identical, slower.
- OpenAI API reference: `seed` best effort, deprecated; not in the Responses API.
- Kulal et al. (2019) pass@k; Chen et al. (2021) unbiased estimator.
- Yao et al., "τ-bench" (2024): pass^k; GPT-4o retail ~61% pass^1, <25% pass^8 (June 2024 models).
- Evan Miller, "Adding Error Bars to Evals" (2024): resampling per question; don't lower temperature.

Task success chances and error-bar widths are illustrative.
