# Building container images (CI/CD, module 9)

1. **A stack of transparent sheets** (analogy): layers and the cache rule.
2. **Slim it down** ⭐ (simulation): order, multi-stage, runtime base, .dockerignore; a code change vs a dependency change; which steps run, rebuild time, final size.
3. **Tags move, digests don't** (step-through): a re-pushed tag; pull by digest.
4. **Order the Dockerfile** (order checkpoint).
5. **Wrap**: BuildKit cache, other builders, hardened bases, scanning.
