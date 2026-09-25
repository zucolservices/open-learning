# Alignment: RLHF, DPO & friends: storyboard

1. **You are the rater** ⭐ Tasting-contest analogy. Four answer pairs (chai steeping, flat Earth, killing a Python process, an unknown novel) testing correctness, flattery, over-refusal and fabrication.
2. **Learn a reward, then chase it** ⭐ (simulation, `reward.ts`). A Bradley–Terry reward model fitted by gradient descent to 400 simulated crowd comparisons plus the learner's (×5). Learned feature weights (correct, answers the question, length, flattery, refusal) and the answer an optimised assistant would pick for "selling ice in Antarctica". Quick-judgement crowd → sycophantic answer; guideline crowd → honest answer. GPT-4o April 2025 rollback; Sharma et al. 2023.
3. **How preference training works** (step-through): SFT model → preferences → reward model → RL (PPO with a leash) → DPO → AI feedback (Constitutional AI).
4. **“I can't help with killing”** (choice): over-refusal.
5. **What to remember**.
