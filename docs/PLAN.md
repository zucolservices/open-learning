# Zucol OpenLearning: Phase 1 plan

Based on _Interactive Tech Upskilling Platform, Solution Document v1.4_. Phase 1 is a frontend-only static site on Vercel. We build tracks one at a time, starting with **Modern Data Lakehouse** (Data engineering).

## Principles for this build

- **Learning, not credentials.** There are no scores, points, badges or certificates. Checkpoints make the learner commit to an answer, then explain the right one. The only progress signals are completed ticks and resume.
- **Foundation-level depth.** A track should leave someone able to reason about the technology on a real project: the concepts, the internals and the ecosystem.
- **Vendor-neutral, ecosystem-aware.** Teach concepts across open formats and engines, then show how they map onto AWS, Google Cloud, Azure, vendor platforms and pure open source.
- **Format follows the concept** (solution doc §2.1). Use 3D where structure is spatial, simulations for trade-offs, step-throughs for processes, and sandboxes for hands-on skill.

## Design language

**Calm lab bench, bright ideas.** Surfaces are near-neutral so the interactive content carries the colour.

| Element              | Decision                                                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Themes               | Dark-first with a full light theme. Follows the OS setting and can be toggled.                                                                                                                          |
| Type                 | Geist Sans for UI and prose, Geist Mono for data, code and file names. Headings are tight and semibold.                                                                                                 |
| Track identity       | Each track has one accent colour (`[data-track]` in `globals.css`). Lakehouse uses teal/aqua, for water.                                                                                                |
| Semantic viz colours | These mean the same thing in every module: `viz-data` (data files), `viz-meta` (metadata/logs), `viz-compute` (engines, I/O, work done), `viz-add` (added), `viz-remove` (removed/deleted), `viz-idle`. |
| Module layout        | A short narration column beside a large **Stage** (dot-grid canvas). A step rail at the top, a navigation dock at the bottom, and ←/→ keys to move between steps.                                       |
| Motion               | Springs and layout animation (Motion). Motion always shows causality: data moving, files appearing, pages being read. It is never decoration. `prefers-reduced-motion` is respected.                    |
| Checkpoints          | Predict (slider guess, then the answer animates in), Choose, and Order (drag). "Not quite" plus an explanation, and retry is always allowed.                                                            |
| Visual metaphors     | These stay consistent across the Lakehouse track: file = tile, row = small cell, commit/snapshot = card, page = bordered group, engine = amber.                                                         |

## Designing for newcomers

Many learners will meet these topics for the first time, so every module assumes **no background** beyond its listed prerequisites, and teaches the nuances too.

| Practice                                | How it's built in                                                                                                                                                                                                                                                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plain words first**                   | Every module has a 2–3 sentence `plain` explanation (catalogue) shown in its Key terms drawer and on its page.                                                                                                                                                                                              |
| **Big idea before mechanics**           | Open with an everyday analogy or story before any file, JSON or SQL (e.g. Delta's bank-passbook step, the swamp-to-lakehouse scroll story).                                                                                                                                                                 |
| **Explain every term where it appears** | Jargon in narration is wrapped in `<Term id="…">`: a dotted underline that shows a plain definition and analogy on hover or tap. Terms live in `glossaries/` (one file per track, plus a small `shared.ts` for general terms); each track has a `/tracks/<track>/glossary` page and `/glossary` is the hub. |
| **Key terms drawer**                    | Every module's top bar has "Key terms": plain words, prerequisites (with completion ticks), and every term the module uses.                                                                                                                                                                                 |
| **Level and prerequisites**             | Each module has a level (Beginner / Core / Deep dive / Applied) and prerequisites, shown on cards and pages. The track page opens with a "New to all this? Start here" path.                                                                                                                                |
| **Then the nuance**                     | After the intuition, show the real artefacts (actual log JSON, real API calls, real limits) and the edge cases, backed by the module's `SOURCES.md`.                                                                                                                                                        |
| **Scroll stories for journeys**         | When an idea is a journey through time or through a system, tell it as a scroll story with a pinned, changing diagram.                                                                                                                                                                                      |

### Format review (2026-09-24)

Scroll stories added where the idea is a journey: file formats (one order through CSV → JSON → Avro → Parquet), inside Parquet (scroll to zoom into the file), Iceberg (a query descending the metadata tree), table maintenance (six months of a table's life), governance (one customer's data under DPDP), ingestion (one event from phone to table), medallion (one record from bronze to gold), query engines (the life of a SQL query). ACID gains a bank-transfer infographic. Formats per module live in `catalogue.ts`.

## Architecture (as built)

```
app/                          routes (static export)
  page.tsx                    home: tracks + continue where you left off
  tracks/[track]/page.tsx     track page, generated from the catalogue
  tracks/[track]/[module]/    live modules → ModuleLoader; planned → storyboard brief
catalogue.ts                  every track / chapter / module (source of truth)
modules/
  registry.ts                 lazy loader per live module (one line each)
  <track>/<module>/index.tsx  default-exports defineModule({ initialState, steps })
toolkit/
  shell/                      ModuleShell (step rail, dock, keyboard), ModuleLoader
  layout/                     StepLayout, Stage
  checkpoints/                ChoiceCheckpoint, PredictCheckpoint, OrderCheckpoint
lib/
  module-sdk.tsx              useModule, useSceneState, useCheckpoint (start/step/checkpoint/complete)
  progress-adapter.ts         Zustand persist → localStorage "zucol-learn:v1"
tests/smoke.spec.ts           Playwright: every catalogue page renders; progress survives reload
```

**Adding a module:** build `modules/<track>/<slug>/index.tsx`, add one line to `modules/registry.ts`, and set `status: "live"` in `catalogue.ts`.

Libraries are added only when a module first needs them: React Three Fiber and drei (3D), D3/visx (charts), React Flow (build-and-connect), GSAP ScrollTrigger (scroll stories), DuckDB-WASM and Monaco (sandbox).

## Modern Data Lakehouse: curriculum

29 modules in 9 chapters, about 15 hours. Delta Lake, Apache Iceberg and Apache Hudi are all covered, each in its own module, then compared. Full concept lists are in `catalogue.ts`.

| #     | Module                                  | Centrepiece                                                                | Key formats              |
| ----- | --------------------------------------- | -------------------------------------------------------------------------- | ------------------------ |
| **1** | **Foundations**                         |                                                                            |                          |
| 1     | From swamp to lakehouse                 | 30 years of data architecture evolving around one company                  | Scroll story             |
| 2     | Object storage: the ground floor        | "Rename a folder" becomes thousands of non-atomic calls                    | Simulation               |
| 3     | Rows vs columns: file formats           | Flip row/columnar layout, watch bytes read                                 | Infographic, simulation  |
| 4     | Inside a Parquet file                   | 3D exploded Parquet file; row groups skipped by footer stats               | **3D**, simulation       |
| **2** | **Open table formats**                  |                                                                            |                          |
| 5     | What makes a table a table              | Two writers corrupt a Hive-style table; fix it                             | Fix the problem          |
| 6     | Delta Lake: the transaction log ⭐      | Version slider replays `_delta_log` commits (time travel)                  | Step-through, simulation |
| 7     | Apache Iceberg: the metadata tree       | 3D metadata tree; a query prunes whole branches                            | **3D**, step-through     |
| 8     | Apache Hudi: the timeline               | Stream upserts; watch timeline, base and log files evolve                  | Step-through             |
| 9     | Delta vs Iceberg vs Hudi                | Same operations, three formats side by side; UniForm/XTable                | Simulation, scenario     |
| **3** | **How tables behave**                   |                                                                            |                          |
| 10    | ACID on object storage                  | Two writers race; optimistic concurrency and retry                         | Step-through             |
| 11    | Updates & deletes: CoW vs MoR           | Slide update rate; read vs write cost trade places                         | Simulation               |
| 12    | Schema evolution & enforcement          | Rename a column in Hive vs Iceberg; which returns wrong data?              | Fix the problem          |
| **4** | **Performance & layout**                |                                                                            |                          |
| 13    | Partitioning done right                 | Choose a scheme; file count, file size and query time respond              | Simulation               |
| 14    | File layout, clustering & data skipping | Linear vs Z-order vs Hilbert; files skipped per query                      | Simulation               |
| 15    | Keeping tables healthy                  | Six simulated months with and without maintenance                          | Simulation               |
| **5** | **Catalogs & governance**               |                                                                            |                          |
| 16    | Catalogs: the source of truth           | Spark, Trino and DuckDB share one catalog; commits propagate               | Build & connect          |
| 17    | Governance, security & privacy          | Erasure request: find every snapshot still holding the data                | Fix the problem          |
| **6** | **Building pipelines**                  |                                                                            |                          |
| 18    | Getting data in                         | Trigger interval vs latency vs small files                                 | Simulation               |
| 19    | CDC, MERGE & SCDs                       | Replay Debezium events; fix out-of-order and duplicate events              | Step-through, fix        |
| 20    | Medallion architecture                  | Wire bronze/silver/gold; replay a bad day of data                          | Build & connect          |
| **7** | **Querying & serving**                  |                                                                            |                          |
| 21    | How engines read a lakehouse            | Query plan step-through; pruning shrinks the files read                    | Step-through             |
| 22    | Hands-on: query in your browser         | DuckDB-WASM guided tasks on real Parquet                                   | **Sandbox**              |
| 23    | Serving BI, ML & AI                     | Route BI, ML training and a RAG app to the same gold tables                | Build & connect          |
| **8** | **Platforms & ecosystem**               |                                                                            |                          |
| 24    | Lakehouse on AWS                        | S3/S3 Tables, Glue, Lake Formation, EMR, Athena, Redshift                  | Build & connect          |
| 25    | Lakehouse on Google Cloud               | GCS, BigLake, BigQuery, Dataproc, Dataflow, Dataplex                       | Build & connect          |
| 26    | Lakehouse on Azure & Fabric             | ADLS Gen2, Databricks, Fabric OneLake, Purview                             | Build & connect          |
| 27    | The open-source & vendor landscape      | "Rosetta stone": swap one architecture across clouds, vendors and pure OSS | Build & connect          |
| **9** | **Capstone**                            |                                                                            |                          |
| 28    | Design a lakehouse                      | Full design for a cooperative bank's transaction analytics                 | Build, scenario          |
| 29    | The slow, expensive lakehouse           | Diagnose five compounding problems from evidence                           | Fix the problem          |

**Accuracy note:** cloud services and format features change quickly (S3 Tables, Iceberg v3, Unity Catalog OSS, Apache Polaris, BigLake Iceberg tables, Fabric). Check each product claim against current official docs when its module is built, and record the date checked in the module folder.

## Roadmap

| Step                 | Scope                                                                                   | Status                                                                  |
| -------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1. Foundation        | Shell, design language, routing, Module SDK, progress adapter, checkpoints, smoke tests | **Done.** A sample module lives at `/tracks/playground/rows-vs-columns` |
| 2. Flagship          | Module 6, Delta Lake transaction log: storyboard, then build                            | **Done.** 14 steps, fact-checked (module `SOURCES.md`)                  |
| 3. Parallel flagship | Module 7, Iceberg metadata tree. First 3D module; sets the R3F toolkit                  | Next                                                                    |
| 4. Rest of track     | Chapters 1 → 9, growing the toolkit (charts, builder, sandbox) along the way            | In progress: modules 1–24 done (chapters 1–7 complete) |
| 5. Team feedback     | 3–5 engineers use the track; refine                                                     |                                                                         |
| 6. Deploy            | Vercel project + preview deploys; decide on access protection                           |                                                                         |

### Per-module workflow

1. **Storyboard** (in `modules/<track>/<slug>/STORYBOARD.md`): must-understand ideas, misconceptions, representation, interactions, checkpoints, step list.
2. **Build** steps against the toolkit; extract anything reusable into `toolkit/`.
3. **Verify**: typecheck, lint, smoke tests, a visual check in both themes and at mobile width, and a fact check with sources.
4. **Flip** `status: "live"`.
