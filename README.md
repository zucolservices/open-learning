# OpenLearning

Interactive learning tracks for the Zucol tech team. Phase 1 is a static Next.js site: no backend, and progress is saved in the browser.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # static site in out/
pnpm typecheck && pnpm lint
pnpm test:e2e     # Playwright smoke tests (first time: pnpm exec playwright install chromium)
```

See [docs/PLAN.md](docs/PLAN.md) for the design language, architecture, curriculum and roadmap.
