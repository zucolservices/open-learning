# Sources (fact-checked 2026-09-25)

- Dosovitskiy et al., "An Image is Worth 16x16 Words" (ViT, ICLR 2021): images as sequences of 16 × 16 patches with position embeddings.
- Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (CLIP, arXiv 2103.00020, 2021): contrastive training on 400M image–text pairs.
- Image tokens (Sep 2026): Anthropic vision docs: 28 × 28 px patches, tokens = ⌈w/28⌉ × ⌈h/28⌉, standard models up to 1,568 px long edge and 1,568 tokens (newer models higher). OpenAI images-and-vision guide: patch-based models use ⌈w/32⌉ × ⌈h/32⌉ × 1.2 (gpt-5.2 and later), with images over a model's patch budget scaled down; tile-based models use 512 px tiles plus base tokens. Google Gemini 3 media_resolution: 280 / 560 / 1,120 (default) / 2,240 tokens per image; audio about 25 tokens per second.
- Our runs: Xenova/clip-vit-base-patch32 image and text embeddings on four simple drawings (224 × 224) and five captions; HuggingFaceTB/SmolVLM-256M-Instruct in Transformers.js v4, greedy, "Describe this picture in one sentence.": 64 image tokens for one 512 × 512 view, 1,088 with image splitting (16 tiles + overview).
- Diffusion image generation (Ho et al., DDPM, 2020) and autoregressive image-token generation are described in general terms.
