# Sources: Contamination and gaming (fact-checked 2026-10-05)

- Zhang et al. (Scale AI), "A Careful Examination of Large Language Model Performance on Grade School Arithmetic" (GSM1k, 2024): drops up to 8% in the final version; frontier models showed little overfitting.
- Brown et al., GPT-3 paper (2020): 13-gram overlap; OpenAI GPT-4 Technical Report (2023): 50-character substring matching.
- Golchin & Surdeanu, "Time Travel in LLMs: Tracing Data Contamination" (2023); Shi et al., Min-K% Prob (2023).
- BIG-bench canary string; LiveBench (monthly questions); LiveCodeBench (problems dated after model cutoff).
- SWE-bench Verified `git log --all` environment leak reports (2025); OpenAI decision to stop reporting SWE-bench Verified (Feb 2026).
- Singh et al., "The Leaderboard Illusion" (2025) and LMArena's response.

Items 1, 3, 5, 7 and 9 are adapted from public GSM8K problems (MIT licence), reworded; the model continuations and scores are illustrative.
