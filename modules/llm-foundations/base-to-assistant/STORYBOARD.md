# From base model to assistant: storyboard

1. **Same prompt, two models** ⭐ (real models). Qwen2.5-0.5B base vs Qwen2.5-0.5B-Instruct on three prompts (capital of India, masala chai tips, translate to Hindi), real greedy outputs with annotations: the base model continues a document; the tuned one answers helpfully but still gets facts and Hindi wrong.
2. **From mimic to assistant** (step-through): base model → demonstrations → Qwen's real chat template → train on answer tokens → assistant (InstructGPT 1.3B preferred over GPT-3 175B).
3. **What did tuning change?** (choice): behaviour, not knowledge.
4. **Fine-tuning on a budget**: LoRA rank vs trainable parameters for a 4,096 × 4,096 matrix.
5. **Prompt, fine-tune or pretrain?** (sort).
6. **What to remember**.
