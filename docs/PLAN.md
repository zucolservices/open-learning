# OpenLearning: Phase 1 plan

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

## System Design at Scale: curriculum

Architecture area, second track (approved 2026-09-24). 27 modules in 8 chapters, about 14 hours. Accent: blueprint indigo (`[data-track="blueprint"]`). Glossary: `glossaries/system-design.ts`. Vendor-neutral, with building blocks mapped onto AWS, Google Cloud, Azure and open source in module 25.

| #     | Module                                     | Centrepiece                                                                     | Key formats             |
| ----- | ------------------------------------------ | ------------------------------------------------------------------------------- | ----------------------- |
| **1** | **Foundations**                            |                                                                                 |                         |
| 1     | What "at scale" means                      | One app from 100 users to 100 million; each order of magnitude breaks something | Scroll story            |
| 2     | Latency, throughput & percentiles          | Coffee-counter queue: p50/p99 explode near capacity; fan-out tail latency       | Simulation              |
| 3     | Back-of-the-envelope estimation            | Users → QPS → storage → bandwidth; latency ladder in human time                 | Simulation              |
| **2** | **Scaling the stateless tier**             |                                                                                 |                         |
| 4     | Load balancing                             | Round robin vs least connections vs power of two, with slow and dead servers    | Simulation              |
| 5     | Horizontal scaling & autoscaling           | Tune autoscaling through a traffic spike                                        | Simulation              |
| 6     | CDNs & the edge                            | Edge hits and misses on a map; invalidation                                     | Infographic, simulation |
| **3** | **Caching**                                |                                                                                 |                         |
| 7     | Caching patterns                           | Cache-aside / read-through / write-through / write-back step-through            | Step-through            |
| 8     | Eviction, invalidation & stampedes         | LRU vs LFU vs TTL; a hot key expires and the herd arrives                       | Simulation, fix         |
| **4** | **Data at scale**                          |                                                                                 |                         |
| 9     | Replication                                | Replication lag: miss your own write                                            | Simulation              |
| 10    | Partitioning & sharding                    | 3D hash ring: naive vs consistent hashing; hot keys                             | **3D**, simulation      |
| 11    | Consistency, CAP & quorums                 | Partition scenario; N/R/W quorum simulator                                      | Scenario, simulation    |
| 12    | Choosing a database                        | Route eight workloads to database families                                      | Build & connect         |
| 13    | Transactions across services               | 2PC vs saga vs outbox with failures injected                                    | Step-through, fix       |
| **5** | **Asynchronous systems**                   |                                                                                 |                         |
| 14    | Queues & streams                           | Producers outpace consumers; backlog, groups, ordering                          | Simulation              |
| 15    | Retries, idempotency & delivery guarantees | Retry storm vs backoff + jitter; idempotency keys                               | Simulation, fix         |
| 16    | Event-driven architecture                  | Rewire a coupled checkout into events                                           | Build & connect         |
| **6** | **Reliability**                            |                                                                                 |                         |
| 17    | Availability math                          | Series vs parallel availability calculator                                      | Simulation              |
| 18    | Timeouts, circuit breakers & rate limiting | Cascading failure; breakers, bulkheads, token bucket                            | Simulation, fix         |
| 19    | Multi-region & disaster recovery           | Failover drill                                                                  | Branching scenario      |
| 20    | Observability & SLOs                       | Trace waterfall; error budget burn                                              | Step-through            |
| **7** | **Classic designs**                        |                                                                                 |                         |
| 21    | Design a URL shortener                     | Guided design, then a load test                                                 | Build & connect         |
| 22    | Design a news feed                         | Fan-out on write vs read; the celebrity problem                                 | Simulation              |
| 23    | Design real-time chat                      | One message's journey between phones                                            | Step-through            |
| 24    | Design a flash-sale booking system         | A million users, a thousand seats                                               | Simulation, fix         |
| **8** | **Platforms & capstone**                   |                                                                                 |                         |
| 25    | Building blocks across platforms           | Rosetta stone across AWS, Google Cloud, Azure and open source                   | Infographic             |
| 26    | Capstone: the results-day portal           | Design, then replay a 100× results-day surge                                    | Scenario, simulation    |
| 27    | Capstone: the outage                       | Cascading failure from evidence                                                 | Fix the problem         |

## LLM Foundations: curriculum

AI & machine learning area, third track (approved 2026-09-25). 26 modules in 8 chapters, about 13 hours. Accent: "synapse" magenta (`[data-track="synapse"]`). Glossary: `glossaries/llm-foundations.ts`. Vendor-neutral: closed models (OpenAI, Anthropic, Google) and open-weight models (Llama, Mistral, Qwen, DeepSeek, Gemma), hosted on AWS Bedrock, Google Vertex AI, Azure AI Foundry or self-run. Where possible the real thing runs in the browser (a real tokenizer; precomputed real embeddings), loaded only inside the module that needs it.

| #     | Module                                  | Centrepiece                                                                                 | Key formats              |
| ----- | --------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------ |
| **1** | **The big picture**                     |                                                                                             |                          |
| 1     | What an LLM actually does               | From phone autocomplete to chat: a model that predicts the next token, over and over        | Scroll story             |
| 2     | Tokens                                  | Type anything and watch a real tokenizer split it; why Hindi costs more tokens than English | Sandbox, step-through    |
| 3     | Embeddings: meaning as coordinates      | A map of words and sentences; move through meaning; similarity search by hand               | 3D model, simulation     |
| **2** | **Inside the transformer**              |                                                                                             |                          |
| 4     | Attention                               | Which words look at which: an attention heatmap for a sentence, head by head                | Step-through             |
| 5     | The transformer block                   | One token's journey through embedding, attention, MLP and residual layers, stacked          | 3D model, step-through   |
| 6     | Positions & the context window          | Why order matters, why long context costs more, and what the KV cache saves                 | Simulation               |
| 7     | From scores to words: sampling          | Logits, softmax, temperature, top-k and top-p on a live next-token distribution             | Simulation               |
| **3** | **How models learn**                    |                                                                                             |                          |
| 8     | Pretraining & scaling laws              | Watch the loss fall; trade parameters for data at a fixed compute budget                    | Simulation               |
| 9     | From base model to assistant            | Same prompt, base vs instruction-tuned model; what fine-tuning changes                      | Step-through             |
| 10    | Alignment: RLHF, DPO & friends          | Preference pairs, reward models and why assistants refuse, hedge or flatter                 | Step-through, checkpoint |
| 11    | Reasoning models                        | Thinking tokens and test-time compute: accuracy vs cost and latency                         | Simulation               |
| **4** | **Using models well**                   |                                                                                             |                          |
| 12    | Prompting fundamentals                  | Fix a failing prompt: roles, instructions, examples and format                              | Fix the problem          |
| 13    | Structured output & tool calling        | The tool-calling loop step by step; schemas that the model must follow                      | Step-through, sandbox    |
| 14    | Context engineering                     | What goes into the window: long context vs retrieval, and what gets lost in the middle      | Simulation               |
| 15    | Hallucinations                          | Why fluent models state false things, and the mitigations that actually help                | Fix the problem          |
| **5** | **Running models**                      |                                                                                             |                          |
| 16    | Inference: prefill, decode & KV cache   | Time to first token vs tokens per second; where the time and memory go                      | Simulation               |
| 17    | Model size, memory & quantization       | Parameters × bytes: will this model fit on this GPU at 16, 8 or 4 bits?                     | Simulation               |
| 18    | Serving at scale                        | Batching, throughput vs latency, and why GPUs sit idle without it                           | Simulation               |
| 19    | Cost & latency estimation               | Tokens in, tokens out: estimate a feature's monthly bill and response time                  | Simulation               |
| **6** | **The model landscape**                 |                                                                                             |                          |
| 20    | Open vs closed models                   | Weights, licences and hosting: API, cloud platforms or your own GPUs                        | Build & connect          |
| 21    | Multimodal models                       | Images, documents and audio in; images and speech out                                       | Step-through             |
| 22    | Small & on-device models                | Distillation and small models: when a 3B model beats a 400B one for the job                 | Simulation, checkpoint   |
| **7** | **Safety & responsibility**             |                                                                                             |                          |
| 23    | Prompt injection & data leakage         | Attack a toy assistant, then defend it                                                      | Fix the problem          |
| 24    | Bias, privacy & responsible use         | Where bias comes from, personal data and the DPDP Act, and human oversight                  | Branching scenario       |
| **8** | **Capstones**                           |                                                                                             |                          |
| 25    | Capstone: choose and size a model       | A multilingual citizen helpdesk: pick model, context strategy, hosting, cost and latency    | Branching scenario       |
| 26    | Capstone: the assistant that misbehaves | Diagnose failures across tokens, sampling, context and injection; fix and verify            | Fix the problem          |

## Agile & Scrum: curriculum

Delivery management area, first track (approved 2026-09-28). 23 modules in 7 chapters, about 11 hours. Accent: "cadence" burnt orange (`[data-track="cadence"]`). Glossary: `glossaries/agile-scrum.ts`. Faithful to the primary sources (the 2020 Scrum Guide, the Agile Manifesto, the Kanban Guide), and clear about which common practices (story points, velocity, Definition of Ready) are add-ons rather than Scrum. Tool-neutral: Jira, Azure Boards, GitHub, GitLab, Linear and open source. Each module is fact-checked on its own before it is built. Estimation and delivery metrics in depth belong to their own tracks.

| #     | Module                                 | Centrepiece                                                                         | Key formats           |
| ----- | -------------------------------------- | ----------------------------------------------------------------------------------- | --------------------- |
| **1** | **Why agile**                          |                                                                                     |                       |
| 1     | Why plans break                        | A wedding hall vs a citizen portal: the cost of learning late; short feedback loops | Scroll story          |
| 2     | The Agile Manifesto                    | Four values and twelve principles, and the myths                                    | Step-through, sort    |
| 3     | Inspect & adapt                        | Steer to a moving target with long vs short cycles                                  | Simulation            |
| **2** | **Scrum, the framework**               |                                                                                     |                       |
| 4     | Scrum on one page                      | The whole framework in one clickable picture                                        | Animated infographic  |
| 5     | Who decides what?                      | Product Owner, Scrum Master or Developers, in real situations                       | Branching scenario    |
| 6     | The Sprint & Sprint Planning           | Plan a Sprint to one Sprint Goal within real capacity                               | Build                 |
| 7     | The Daily Scrum                        | Three stand-up transcripts that go wrong                                            | Fix the problem       |
| 8     | Review & Retrospective                 | Run a review with a client, then a retro                                            | Branching scenario    |
| 9     | Artifacts & commitments                | Backlogs and Increment ↔ Product Goal, Sprint Goal, Definition of Done              | Build & connect       |
| **3** | **The backlog**                        |                                                                                     |                       |
| 10    | User stories & acceptance criteria     | Rewrite weak stories: INVEST, Given/When/Then                                       | Fix the problem       |
| 11    | Splitting stories                      | Slice a big citizen-portal feature vertically                                       | Sandbox               |
| 12    | Ordering the backlog                   | MoSCoW vs value vs cost of delay: value delivered over time                         | Simulation            |
| **4** | **Flow & Kanban**                      |                                                                                     |                       |
| 13    | Kanban & WIP limits                    | A live board: WIP limits vs cycle time; Little's Law                                | Simulation            |
| 14    | Reading the charts                     | Burndown, burnup, cumulative flow and cycle-time scatter                            | Step-through          |
| 15    | Scrum, Kanban or both?                 | A way of working for four different teams                                           | Branching scenario    |
| **5** | **Engineering that makes agile work**  |                                                                                     |                       |
| 16    | Done means done                        | Weak vs strong Definition of Done; technical debt compounding                       | Simulation            |
| 17    | Small batches & continuous integration | Batch size vs lead time and merge pain; XP practices                                | Simulation            |
| **6** | **Agile in the real world**            |                                                                                     |                       |
| 18    | Client-facing & distributed teams      | A Bengaluru team, a remote client, a proxy Product Owner                            | Branching scenario    |
| 19    | Many teams: scaling frameworks         | SAFe, LeSS, Nexus and Scrum@Scale compared                                          | Build & connect       |
| 20    | The same board, every tool             | Rosetta stone across Jira, Azure Boards, GitHub, GitLab, Linear and open source     | Infographic           |
| 21    | Agile anti-patterns                    | Velocity as a target, Water-Scrum-Fall, Zombie Scrum                                | Sort, fix the problem |
| **7** | **Capstones**                          |                                                                                     |                       |
| 22    | Capstone: run a sprint                 | Two weeks on a client project; your calls, the charts respond                       | Simulation, branching |
| 23    | Capstone: the struggling team          | Diagnose from board, charts and retro notes; fix                                    | Fix the problem       |

## RAG Systems: curriculum

AI & machine learning area, second track (approved 2026-09-29). 23 modules in 7 chapters, about 12 hours. Accent: "lumen" lime (`[data-track="lumen"]`). Glossary: `glossaries/rag-systems.ts`. Builds on LLM Foundations (embeddings, context, hallucinations, prompt injection). Vendor-neutral: open-source vector databases and search engines (pgvector, OpenSearch/Elasticsearch, Qdrant, Weaviate, Milvus, Chroma, LanceDB, Vespa) and the managed services on AWS, Google Cloud and Azure, plus model providers' file-search APIs. Where possible the real thing runs in the browser (live BM25; precomputed real embeddings; a small English and Hindi corpus), loaded only inside the module that needs it. Each module is fact-checked on its own before it is built; vendor product names change often (landscape check: scratchpad `rag/LANDSCAPE.md`).

| #     | Module                               | Centrepiece                                                                          | Key formats               |
| ----- | ------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------- |
| **1** | **The big picture**                  |                                                                                      |                           |
| 1     | Why models need your documents       | Closed-book vs open-book exam; RAG vs fine-tuning vs long context                    | Scroll story              |
| 2     | A RAG system, end to end             | A tiny working pipeline: parse, chunk, embed, retrieve, answer with citations        | Infographic, step-through |
| **2** | **Preparing documents**              |                                                                                      |                           |
| 3     | Parsing real documents               | Scans, tables, columns and Hindi through naive vs layout-aware parsing               | Fix the problem           |
| 4     | Chunking                             | Size, overlap and splitting rules vs whether the answer is found                     | Simulation                |
| 5     | Metadata, freshness & deletions      | A revised circular: stale answers until metadata and re-indexing fix them            | Build & connect           |
| **3** | **From words to meaning**            |                                                                                      |                           |
| 6     | Keyword search & BM25                | Inverted index and BM25 scoring, live                                                | Simulation                |
| 7     | Embeddings for retrieval             | English, Hindi and romanised Hindi queries across embedding models                   | Sandbox                   |
| 8     | Vector indexes                       | Climb an HNSW graph; recall vs latency                                               | 3D model, simulation      |
| 9     | Hybrid search & fusion               | Keyword + vector merged with reciprocal rank fusion                                  | Simulation                |
| 10    | Reranking & relevance filtering      | Cross-encoders, LLM rerankers, relevance filters (incl. decision models such as Jev) | Step-through              |
| **4** | **Better context**                   |                                                                                      |                           |
| 11    | Understanding the question           | Follow-ups, multi-part questions, rewriting, HyDE                                    | Fix the problem           |
| 12    | Contextual retrieval & small-to-big  | Context lines on chunks; match small, return big                                     | Simulation                |
| 13    | Assembling the prompt                | Order, citations, "I don't know", lost in the middle, prompt caching                 | Build & connect           |
| **5** | **Beyond basic RAG**                 |                                                                                      |                           |
| 14    | Tables & SQL                         | Route questions to search or SQL                                                     | Branching scenario        |
| 15    | GraphRAG                             | Entities, communities and whole-collection questions                                 | Step-through              |
| 16    | Agentic RAG & MCP                    | Plan, search, read, search again, stop                                               | Step-through              |
| 17    | Multimodal RAG                       | Answers that live in charts and page images                                          | Step-through              |
| **6** | **Measuring & running it**           |                                                                                      |                           |
| 18    | Evaluating retrieval                 | A golden set; recall@k, MRR, nDCG for two setups                                     | Simulation                |
| 19    | Evaluating answers                   | Faithfulness and relevance; human vs LLM judge                                       | Fix the problem           |
| 20    | Security & access control            | Permissions, injected instructions (simulated), DPDP, OWASP LLM08                    | Fix the problem           |
| 21    | Platforms, cost & long context       | Open source and managed services on one map; monthly cost                            | Build & connect           |
| **7** | **Capstones**                        |                                                                                      |                           |
| 22    | Capstone: a scheme assistant         | Design a bilingual assistant, then evaluate it                                       | Branching, simulation     |
| 23    | Capstone: the RAG that answers wrong | Trace wrong answers stage by stage and fix them                                      | Fix the problem           |

## Roadmap

| Step                 | Scope                                                                                   | Status                                                                  |
| -------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1. Foundation        | Shell, design language, routing, Module SDK, progress adapter, checkpoints, smoke tests | **Done.** A sample module lives at `/tracks/playground/rows-vs-columns` |
| 2. Flagship          | Module 6, Delta Lake transaction log: storyboard, then build                            | **Done.** 14 steps, fact-checked (module `SOURCES.md`)                  |
| 3. Parallel flagship | Module 7, Iceberg metadata tree. First 3D module; sets the R3F toolkit                  | Next                                                                    |
| 4. Rest of track     | Chapters 1 → 9, growing the toolkit (charts, builder, sandbox) along the way            | Done: all 29 modules live (2026-09-24)                                  |
| 4b. System Design    | Second track (Architecture), 27 modules                                                 | Live: all 27 modules                                                    |
| 4c. LLM Foundations  | Third track (AI & machine learning), 26 modules                                         | Live: all 26 modules (2026-09-25)                                       |
| 4d. Agile & Scrum    | Delivery management, first track, 23 modules                                            | Live: all 23 modules (2026-09-28)                                       |
| 4e. RAG Systems      | AI & machine learning, second track, 23 modules                                         | In progress: 5 of 23 modules                                            |
| 5. Team feedback     | 3–5 engineers use the track; refine                                                     |                                                                         |
| 6. Deploy            | Vercel project + preview deploys; decide on access protection                           |                                                                         |

### Per-module workflow

1. **Storyboard** (in `modules/<track>/<slug>/STORYBOARD.md`): must-understand ideas, misconceptions, representation, interactions, checkpoints, step list.
2. **Build** steps against the toolkit; extract anything reusable into `toolkit/`.
3. **Verify**: typecheck, lint, smoke tests, a visual check in both themes and at mobile width, and a fact check with sources.
4. **Flip** `status: "live"`.
