# Sources (fact-checked 2026-09-25)

- Bengio et al., "A Neural Probabilistic Language Model" (JMLR 2003): the design of the in-browser model (trained here with plain mini-batch gradient descent on cross-entropy loss).
- Kaplan et al., "Scaling Laws for Neural Language Models" (OpenAI, arXiv 2001.08361, 2020). Training compute C ≈ 6ND.
- Hoffmann et al., "Training Compute-Optimal Large Language Models" (arXiv 2203.15556, 2022): Chinchilla 70B on 1.4T tokens beat Gopher 280B at similar compute; their eq. 10 fit E = 1.69, A = 406.4, B = 410.7, α = 0.34, β = 0.28.
- Besiroglu, Erdil, Barnett & You, "Chinchilla Scaling: A replication attempt" (Epoch AI, arXiv 2404.10102, 2024): corrected fit L = 1.8172 + 482.01/N^0.3478 + 2085.43/D^0.3658, consistent with ~20 tokens per parameter. Used for the simulator.
- GPT-3: 175B parameters, 300B training tokens (Brown et al. 2020). Llama 3 paper (arXiv 2407.21783): ~15T tokens; 405B used 3.8 × 10²⁵ FLOPs. DeepSeek-V3 (arXiv 2412.19437): 14.8T tokens, 2.788M H800 GPU-hours ≈ $5.576M at $2/GPU-hour, excluding prior research and ablations. FineWeb (arXiv 2406.17557): 15T tokens from 96 Common Crawl snapshots.
