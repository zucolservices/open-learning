@AGENTS.md

# Zucol OpenLearning

Plan, design language and curriculum: `docs/PLAN.md`. Source requirements: _Upskilling Platform Solution Document v1.4_ (Phase 1 = frontend-only static site).

## Conventions

- `catalogue.ts` is the source of truth for tracks and modules. A module goes live by adding `modules/<track>/<slug>/index.tsx`, one line in `modules/registry.ts`, and `status: "live"`.
- Modules talk only to the Module SDK (`lib/module-sdk.tsx`); never touch localStorage or `useProgress` directly from a module.
- No gamification: no scores, points, badges or certificates. Checkpoints explain; retry is always allowed.
- Colours: use tokens (`bg-surface`, `text-muted`, `bg-accent`, `viz-*`), never raw hex in components. `viz-*` colours carry fixed meanings (see PLAN.md).
- Pages are statically exported: no server-only features (see `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`).
- Add heavy libraries (R3F, D3, DuckDB-WASM…) only inside the module that needs them, so they stay in that module's bundle.
- Before calling a module done: `pnpm typecheck && pnpm lint && pnpm test:e2e`, then a visual check in dark, light and mobile widths.
- Write for newcomers: assume no background beyond a module's prerequisites. Every module needs `level`, `plain`, `terms` (and `prerequisites` where relevant) in the catalogue. Open with the big idea as an everyday analogy or story before mechanics. Wrap jargon in narration with `<Term id="…">` (add missing terms to the track's file in `glossaries/`; only truly general terms go in `glossaries/shared.ts`). See "Designing for newcomers" in `docs/PLAN.md`.
- 3D: use `toolkit/three` (`SceneCanvas`, `AnimatedBox`, `CameraRig`, `LabelAnchors` + `LabelOverlay`). Don't use drei `<Html>` for labels (its per-label React roots crash on conditional mount/unmount under React 19); declare all labels up front with a `visible` flag. In scroll stories, pass `persistent` so the canvas isn't remounted per section.
