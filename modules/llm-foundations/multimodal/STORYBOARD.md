# Multimodal models: storyboard

1. **Pictures become tokens** ⭐ (step-through): a 224 × 224 bus drawing as pixel numbers → 14 × 14 grid of 16 px patches → patch 74 to a vector plus position → patches attend → projector → 64 image tokens then text tokens.
2. **Pictures and words in one space** (real CLIP): pick a drawing; cosine similarity with five captions (one decoy).
3. **A small model describes the picture** (real SmolVLM-256M): captions for four drawings; 64 vs 1,088 image tokens.
4. **What does an image cost?** (calculator): width/height and presets; Anthropic, OpenAI (before resizing), Gemini 3.
5. **Documents, speech and making images** (step-through): documents, speech in, speech out, diffusion strip.
6. **Put the pipeline in order** (order checkpoint).
7. **What to remember**.
