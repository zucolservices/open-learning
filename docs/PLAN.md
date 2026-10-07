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

## Cloud Architecture: curriculum

Platform & cloud area, first track (approved 2026-10-02). 22 modules in 7 chapters, about 10 hours. Accent: "stratus" sky blue (`[data-track="stratus"]`). Glossary: `glossaries/cloud-architecture.ts`. Vendor-neutral: AWS, Google Cloud and Azure side by side, with open-source tools (Terraform/OpenTofu, Open Policy Agent). Links to System Design for scaling, caching and queues, and to the Lakehouse cloud modules for data platforms, rather than repeating them. Real data where possible: real IAM policy evaluation in the browser, real Terraform plan output, public region and zone lists, dated list prices. Built on one branch (`track/cloud-architecture`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built.

| #     | Module                                        | Centrepiece                                                          | Key formats        |
| ----- | --------------------------------------------- | -------------------------------------------------------------------- | ------------------ |
| **1** | **The big picture**                           |                                                                      |                    |
| 1     | What the cloud really is                      | From a server cupboard to a hyperscale data centre; IaaS, PaaS, SaaS | Scroll story       |
| 2     | Regions, zones and shared responsibility      | Fail a data centre, a zone, a region; sort security jobs             | Simulation         |
| **2** | **Compute**                                   |                                                                      |                    |
| 3     | Virtual machines, containers and functions    | One app run three ways: start-up, cost, control                      | Simulation         |
| 4     | Autoscaling and load balancers                | A day of traffic into a scaling group; health checks                 | Simulation         |
| **3** | **Networking**                                |                                                                      |                    |
| 5     | Your own private network                      | Carve CIDR ranges into subnets; write route tables                   | Build & connect    |
| 6     | Getting in and out                            | Trace a packet through NAT; private endpoints; egress                | Step-through       |
| 7     | Connecting networks                           | Peering every pair vs a hub; VPN and dedicated links                 | Build & connect    |
| 8     | DNS and traffic routing                       | Latency and failover routing across regions; CDNs                    | Simulation         |
| **4** | **Identity & security**                       |                                                                      |                    |
| 9     | Identity and access                           | Evaluate real policies; cut an over-broad one to least privilege     | Fix the problem    |
| 10    | Workload identity and federation              | A leaked key vs short-lived credentials for workloads and CI         | Step-through       |
| 11    | Encryption, keys and secrets                  | Envelope encryption, rotation and revocation                         | Step-through       |
| 12    | Guardrails and policy as code                 | Preventive vs detective controls across the three clouds             | Simulation         |
| **5** | **Organising the estate**                     |                                                                      |                    |
| 13    | Accounts, subscriptions and projects          | Build an organisation tree; policies and bills flow down             | Build & connect    |
| 14    | Landing zones                                 | Assemble log archive, security, shared network, workload accounts    | Build & connect    |
| 15    | Infrastructure as code                        | Read a real Terraform plan; find drift                               | Sandbox            |
| **6** | **Data, resilience & cost**                   |                                                                      |                    |
| 16    | Storage and managed databases                 | Place data on the right storage and tier; see the cost               | Simulation         |
| 17    | High availability and disaster recovery       | Backup-restore to active-active; fail a region                       | Simulation         |
| 18    | Cost and FinOps                               | On-demand, committed and spot; find waste in a bill                  | Simulation         |
| 19    | Well-architected reviews                      | Review a diagram against the shared pillars                          | Fix the problem    |
| **7** | **In practice**                               |                                                                      |                    |
| 20    | Cloud in India and government                 | Region, empanelment and residency, service by service                | Fix the problem    |
| 21    | Migration: the 7 Rs                           | Decide ten applications' fate                                        | Branching scenario |
| 22    | Capstone: a foundation for a state department | Design a landing zone and app platform, then review it               | Branching, build   |

## Streaming Data Systems: curriculum

Data engineering area, second track (approved 2026-10-02). 23 modules in 7 chapters, about 9.5 hours. Accent: "current" pink (`[data-track="current"]`). Glossary: `glossaries/streaming-data.ts`. Vendor-neutral: Apache Kafka, Redpanda and Pulsar, Amazon Kinesis, Google Pub/Sub and Azure Event Hubs, with Flink, Spark Structured Streaming, Kafka Streams and Beam for processing. Goes deeper than System Design's queues, delivery-guarantee and event-driven modules and the Lakehouse ingestion and CDC modules, and links to them rather than repeating them. Built on one branch (`track/streaming-data`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built.

| #     | Module                                   | Centrepiece                                                            | Key formats      |
| ----- | ---------------------------------------- | ---------------------------------------------------------------------- | ---------------- |
| **1** | **The big picture**                      |                                                                        |                  |
| 1     | Batch vs streams                         | A suspicious payment through tonight's batch and through a live stream | Scroll story     |
| 2     | Events, logs and topics                  | Append to a log, read from any offset, replay                          | Simulation       |
| **2** | **The log**                              |                                                                        |                  |
| 3     | Partitions and ordering                  | Choose a key; ordering per key and hot partitions                      | Simulation       |
| 4     | Consumer groups and offsets              | Add consumers, watch rebalances and lag                                | Simulation       |
| 5     | Durability and replication               | Lose a broker under different acks settings                            | Simulation       |
| 6     | Retention, compaction and tiered storage | Time, size and key-based retention; tiering                            | Step-through     |
| 7     | The platforms compared                   | Kafka, Redpanda, Pulsar, Kinesis, Pub/Sub, Event Hubs                  | Infographic      |
| **3** | **Getting data in and out**              |                                                                        |                  |
| 8     | Change data capture and the outbox       | Dual write loses an event; outbox + CDC                                | Step-through     |
| 9     | Schemas and evolution                    | Break a consumer, fix it with compatibility rules                      | Fix the problem  |
| 10    | Delivery guarantees                      | Crash at the worst moment; count duplicates and losses                 | Simulation       |
| **4** | **Processing streams**                   |                                                                        |                  |
| 11    | Filter, map, route                       | Wire a small topology                                                  | Build & connect  |
| 12    | Event time vs processing time            | Delayed events, watermarks                                             | Simulation       |
| 13    | Windows                                  | Tumbling, hopping, sliding, session on one stream                      | Simulation       |
| 14    | State and joins                          | Stream–table and stream–stream joins                                   | Step-through     |
| 15    | Checkpoints and exactly-once processing  | Crash, restore, replay without double counting                         | Step-through     |
| 16    | Streaming SQL                            | A continuous query and a self-updating view                            | Sandbox          |
| **5** | **Operating streams**                    |                                                                        |                  |
| 17    | Backpressure and lag                     | A sale-day spike; scale consumers and partitions                       | Simulation       |
| 18    | Errors, retries and dead-letter queues   | A poison message blocks a partition                                    | Fix the problem  |
| 19    | Sizing and cost                          | Size a topic, price it on four services                                | Simulation       |
| **6** | **Streams meet storage**                 |                                                                        |                  |
| 20    | Streaming into the lakehouse             | Freshness vs small files in an Iceberg table                           | Simulation       |
| 21    | Real-time analytics stores               | ClickHouse, Druid and Pinot behind a live dashboard                    | Infographic      |
| **7** | **In practice**                          |                                                                        |                  |
| 22    | Event-driven patterns                    | Event sourcing, CQRS, a saga that undoes itself                        | Step-through     |
| 23    | Capstone: a real-time payments monitor   | Design a UPI-like monitoring pipeline, then break it                   | Branching, build |

## Kubernetes: curriculum

Platform & cloud area, second track (approved 2026-10-02). 23 modules in 7 chapters, about 9.5 hours. Accent: "helm" amber (`[data-track="helm"]`). Glossary: `glossaries/kubernetes.ts`. Vendor-neutral: upstream Kubernetes with EKS, GKE, AKS and OpenShift, and local clusters (kind, k3s). Builds on Cloud Architecture's containers, load-balancing and workload-identity modules and links to them rather than repeating them. Built on one branch (`track/kubernetes`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                      | Centrepiece                                                             | Key formats       |
| ----- | ------------------------------------------- | ----------------------------------------------------------------------- | ----------------- |
| **1** | **The big picture**                         |                                                                         |                   |
| 1     | Why Kubernetes                              | One app by hand on twenty servers, then a cluster that keeps it running | Scroll story      |
| 2     | Desired state and the control loop          | Delete a pod or kill a node; the cluster puts it back                   | Simulation        |
| 3     | The cluster, taken apart                    | Follow one kubectl apply through every component                        | Step-through      |
| **2** | **Running workloads**                       |                                                                         |                   |
| 4     | Pods                                        | Two containers sharing a pod; init containers, sidecars, pod lifecycle  | Step-through      |
| 5     | Deployments and rolling updates             | Roll out v2, tune surge and unavailability, roll back                   | Simulation        |
| 6     | Health checks                               | A slow starter in a restart loop; fix it with probes                    | Fix the problem   |
| 7     | StatefulSets, DaemonSets, Jobs and CronJobs | Which controller for which workload                                     | Infographic, sort |
| **3** | **Networking**                              |                                                                         |                   |
| 8     | Services and DNS                            | Labels, selectors and Service types; traffic follows moving pods        | Simulation        |
| 9     | Ingress and Gateway API                     | Route outside traffic by host and path                                  | Step-through      |
| 10    | Network policies                            | Lock down a three-tier app without breaking it                          | Fix the problem   |
| **4** | **Configuration and storage**               |                                                                         |                   |
| 11    | ConfigMaps and Secrets                      | What a Secret really protects                                           | Step-through      |
| 12    | Persistent storage                          | A database pod moves node; PVCs, StorageClasses, CSI                    | Simulation        |
| **5** | **Scheduling and scaling**                  |                                                                         |                   |
| 13    | Requests, limits and QoS                    | Bin-packing, throttling and OOM kills                                   | Simulation        |
| 14    | The scheduler                               | Filters and scores; taints, affinity, topology spread                   | Simulation        |
| 15    | Autoscaling                                 | HPA, VPA, Cluster Autoscaler/Karpenter, KEDA through a spike            | Simulation        |
| 16    | Disruptions and upgrades                    | Drain with PodDisruptionBudgets; version upgrades                       | Step-through      |
| **6** | **Security and operations**                 |                                                                         |                   |
| 17    | Access control and service accounts         | An over-privileged service account; least-privilege RBAC                | Fix the problem   |
| 18    | Pod security and admission                  | Pod Security Standards and policy engines                               | Build, sort       |
| 19    | Packaging and GitOps                        | Helm, Kustomize, Argo CD and Flux                                       | Step-through      |
| 20    | Debugging a cluster                         | CrashLoopBackOff, Pending, ImagePullBackOff from the clues              | Branching         |
| **7** | **In practice**                             |                                                                         |                   |
| 21    | Extending Kubernetes                        | A custom resource and its operator                                      | Step-through      |
| 22    | Managed Kubernetes and cost                 | EKS, GKE, AKS, OpenShift priced; when not to use Kubernetes             | Infographic, sim  |
| 23    | Capstone: a payments API on Kubernetes      | Design it, then a bad release, a dead node and a surge                  | Branching, build  |

## CI/CD: curriculum

Platform & cloud area, third track (started 2026-10-03). 21 modules in 6 chapters, about 8.5 hours. Accent: "relay" purple (`[data-track="relay"]`). Glossary: `glossaries/ci-cd.ts`. Vendor-neutral: GitHub Actions, GitLab CI/CD, Jenkins, Azure Pipelines, CircleCI, Buildkite, AWS CodePipeline/CodeBuild, Google Cloud Build and Tekton. Builds on Cloud Architecture's infrastructure-as-code module and Kubernetes' Deployments and GitOps modules and links to them rather than repeating them. Built on one branch (`track/ci-cd`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                  | Centrepiece                                                             | Key formats      |
| ----- | --------------------------------------- | ----------------------------------------------------------------------- | ---------------- |
| **1** | **The big picture**                     |                                                                         |                  |
| 1     | Why CI/CD                               | A quarterly release weekend vs small daily releases                     | Scroll story     |
| 2     | Version control and branching           | Long-lived vs short-lived branches; conflicts pile up or vanish         | Simulation       |
| 3     | A pipeline, taken apart                 | One git push from webhook to green tick                                 | Step-through     |
| **2** | **Continuous integration**              |                                                                         |                  |
| 4     | Reproducible builds and caching         | Pin and cache until builds are identical and fast                       | Simulation       |
| 5     | Automated tests                         | Shape a suite: bugs caught, time taken, flakiness                       | Simulation       |
| 6     | Fast feedback                           | A 45-minute pipeline under ten                                          | Simulation       |
| 7     | Quality gates and merge rules           | Branch protection, reviews, merge queues                                | Build            |
| **3** | **Artifacts and environments**          |                                                                         |                  |
| 8     | Artifacts and versioning                | Build once, promote the same artifact                                   | Step-through     |
| 9     | Building container images               | Layers, multi-stage builds, tags vs digests                             | Simulation       |
| 10    | Environments and promotion              | Test, staging, production, previews                                     | Step-through     |
| 11    | Infrastructure in the pipeline          | A plan in the PR that would delete the database                         | Step-through     |
| **4** | **Releasing safely**                    |                                                                         |                  |
| 12    | Continuous delivery and deployment      | Where the human approval sits                                           | Simulation       |
| 13    | Release strategies                      | A bad release five ways: who gets hurt                                  | Simulation       |
| 14    | Feature flags                           | 1%, 10%, 50%, then a kill switch                                        | Simulation       |
| 15    | Database changes without downtime       | Expand and contract                                                     | Step-through     |
| 16    | Rollback and roll forward               | A 6 p.m. failure, three ways out                                        | Branching        |
| **5** | **Securing the pipeline**               |                                                                         |                  |
| 17    | Secrets and identity in pipelines       | A stranger's pull request after your keys; OIDC                         | Fix the problem  |
| 18    | Software supply chain security          | Four real attacks and the defences that stop them                       | Step-through     |
| **6** | **In practice**                         |                                                                         |                  |
| 19    | Measuring delivery                      | The DORA measures for two teams                                         | Simulation       |
| 20    | CI/CD platforms compared                | A month of builds priced; three teams choose                            | Infographic, sim |
| 21    | Capstone: a pipeline for a payments app | Design it, then a bad commit, a poisoned dependency, a failed migration | Branching, build |

## Observability: curriculum

Platform & cloud area, fourth track (started 2026-10-03). 21 modules in 5 chapters, about 8.5 hours. Accent: "signal" cyan (`[data-track="signal"]`). Glossary: `glossaries/observability.ts`. Vendor-neutral: OpenTelemetry, Prometheus, Grafana, Loki, Tempo, Jaeger and Elastic alongside Datadog, New Relic, Honeycomb, Splunk and the clouds' own tools. Builds on System Design's observability module and links to it rather than repeating it. Built on one branch (`track/observability`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                  | Centrepiece                                                       | Key formats      |
| ----- | --------------------------------------- | ----------------------------------------------------------------- | ---------------- |
| **1** | **The big picture**                     |                                                                   |                  |
| 1     | Why observability                       | A 3 a.m. incident with only a CPU graph, then with real telemetry | Scroll story     |
| 2     | Metrics, logs and traces                | One slow request investigated three ways                          | Step-through     |
| 3     | Instrumentation and OpenTelemetry       | Instrument once, switch backends without code changes             | Step-through     |
| **2** | **Metrics**                             |                                                                   |                  |
| 4     | Counters, gauges and histograms         | Three metric types react to the same traffic                      | Simulation       |
| 5     | Averages lie: percentiles               | The slow requests an average hides                                | Simulation       |
| 6     | Labels and cardinality                  | One label that multiplies the bill                                | Simulation       |
| 7     | The golden signals                      | Diagnose three services from four numbers                         | Branching        |
| **3** | **Logs and traces**                     |                                                                   |                  |
| 8     | Structured logs                         | Find one failed payment in free text vs structured logs           | Fix the problem  |
| 9     | Log pipelines and storage               | Index, keep and sample a day of logs                              | Simulation       |
| 10    | Distributed tracing                     | One slow checkout across six services                             | Step-through     |
| 11    | Sampling traces                         | Head vs tail sampling: keep the trace that mattered               | Simulation       |
| 12    | Continuous profiling                    | Read a flame graph                                                | Step-through     |
| **4** | **Reliability targets**                 |                                                                   |                  |
| 13    | SLIs and SLOs                           | The right indicator; what the nines allow                         | Build            |
| 14    | Error budgets                           | Spend a month's budget, apply the policy                          | Simulation       |
| 15    | Alerting that works                     | Burn-rate alerts vs page storms                                   | Simulation       |
| 16    | Dashboards that answer questions        | Redesign a 40-panel wall                                          | Build            |
| **5** | **Operating**                           |                                                                   |                  |
| 17    | Debugging with telemetry                | From page to root cause, signal by signal                         | Branching        |
| 18    | Incident response                       | Run an outage as incident commander                               | Branching        |
| 19    | Blameless postmortems                   | Rewrite a blaming report                                          | Fix the problem  |
| 20    | Observability platforms and cost        | Price the same telemetry on several platforms                     | Infographic, sim |
| 21    | Capstone: observing a payments platform | Design it, then a slow bank, a silent failure, a page storm       | Branching, build |

## API Design: curriculum

Architecture area, second track (started 2026-10-03). 21 modules in 5 chapters, about 8.5 hours. Accent: "contract" green (`[data-track="contract"]`). Glossary: `glossaries/api-design.ts`. Vendor-neutral: open standards (HTTP RFCs, OpenAPI, AsyncAPI, OAuth, Protocol Buffers, GraphQL) alongside gateways from AWS, Google Cloud, Azure, Kong, Apigee and others. Links to System Design for rate limiting and idempotency at scale rather than repeating it. Built on one branch (`track/api-design`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                 | Centrepiece                                 | Key formats                         |
| ----- | -------------------------------------- | ------------------------------------------- | ----------------------------------- |
| **1** | **The big picture**                    |                                             |                                     |
| 1     | What an API is                         | One tap in a delivery app, through its APIs | Scroll story                        |
| 2     | HTTP from the ground up                | Build a request, watch the response         | Step through                        |
| 3     | REST, RPC, GraphQL and events          | Match integrations to API styles            | Animated infographic, Build connect |
| **2** | **Designing REST APIs**                |                                             |                                     |
| 4     | Resources and URLs                     | Redesign a library's endpoints              | Fix the problem                     |
| 5     | Methods, status codes and errors       | Status codes and Problem Details            | Simulation, Fix the problem         |
| 6     | Request and response design            | Fix a payment response's traps              | Fix the problem                     |
| 7     | Pagination, filtering and sorting      | Offset vs cursor on a changing list         | Simulation                          |
| 8     | Idempotency and safe retries           | Retry a payment with and without a key      | Simulation                          |
| **3** | **Contracts and change**               |                                             |                                     |
| 9     | OpenAPI and contract-first design      | One OpenAPI file: docs, mock, client        | Step through, Build connect         |
| 10    | Versioning and breaking changes        | Safe or breaking? Ship without failures     | Build connect, Simulation           |
| 11    | Deprecation and lifecycle              | A twelve-month sunset                       | Simulation                          |
| **4** | **Beyond REST**                        |                                             |                                     |
| 12    | gRPC and Protocol Buffers              | Evolve a Protobuf message                   | Step through, Simulation            |
| 13    | GraphQL                                | A query that explodes into N+1              | Build connect, Simulation           |
| 14    | Webhooks and async APIs                | Webhooks through failures and forgery       | Simulation, Fix the problem         |
| 15    | Real-time APIs                         | Live scores four ways                       | Simulation                          |
| **5** | **Security and operations**            |                                             |                                     |
| 16    | Authentication: keys, OAuth and tokens | OAuth with PKCE, step by step               | Step through                        |
| 17    | Authorisation and API security         | Attack and fix the OWASP API Top 10         | Fix the problem                     |
| 18    | Rate limits and quotas                 | Token bucket vs fixed window                | Simulation                          |
| 19    | Caching and performance                | ETags and Cache-Control                     | Simulation                          |
| 20    | Gateways and developer experience      | Gateways and developer portals              | Animated infographic, Build connect |
| 21    | Capstone: an API for a parcel service  | Parcel API through a year of use            | Branching scenario, Build connect   |

## Database Internals: curriculum

Architecture area, third track (started 2026-10-04). 21 modules in 6 chapters, about 9 hours. Accent: "ledger" blue (`[data-track="ledger"]`). Glossary: `glossaries/database-internals.ts`. Vendor-neutral: PostgreSQL, MySQL/InnoDB, SQLite, SQL Server, Oracle and RocksDB alongside managed cloud databases. Builds on the Lakehouse row/column modules and System Design's replication and consistency modules, linking rather than repeating. Built on one branch (`track/database-internals`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                            | Centrepiece                       | Key formats                         |
| ----- | --------------------------------- | --------------------------------- | ----------------------------------- |
| **1** | **The big picture**               |                                   |                                     |
| 1     | What happens when you run a query | One SELECT, from parser to disk   | Scroll story                        |
| 2     | Memory, SSDs and disks            | The latency ladder in human time  | Animated infographic, Simulation    |
| **2** | **Storing data**                  |                                   |                                     |
| 3     | Pages and rows                    | Inside a slotted page             | Simulation                          |
| 4     | Row stores and column stores      | Checkout vs report, row vs column | Simulation                          |
| 5     | The buffer pool                   | LRU vs clock sweep vs a big scan  | Simulation                          |
| **3** | **Indexes**                       |                                   |                                     |
| 6     | B-trees                           | Build a B+tree, split by split    | Simulation, Step through            |
| 7     | Using indexes well                | Composite and covering indexes    | Simulation                          |
| 8     | LSM trees                         | Memtable, SSTables, compaction    | Simulation, Step through            |
| 9     | Hash, inverted and vector indexes | Match searches to index types     | Animated infographic, Build connect |
| **4** | **Running queries**               |                                   |                                     |
| 10    | Parsing and planning              | Read an EXPLAIN plan              | Step through                        |
| 11    | Join algorithms                   | Nested loop vs hash vs merge      | Simulation                          |
| 12    | Statistics and the optimiser      | Stale statistics, terrible plan   | Simulation, Fix the problem         |
| **5** | **Transactions and durability**   |                                   |                                     |
| 13    | Write-ahead logging and recovery  | Pull the plug mid-transfer        | Simulation, Step through            |
| 14    | Transactions and ACID             | A transfer that fails halfway     | Scroll story                        |
| 15    | Isolation levels and anomalies    | Catch the anomalies               | Simulation                          |
| 16    | Locks and deadlocks               | Create and break a deadlock       | Simulation                          |
| 17    | MVCC                              | Two versions of one row           | Simulation, Step through            |
| **6** | **Beyond one machine**            |                                   |                                     |
| 18    | Replication under the hood        | Ship the WAL to a replica         | Simulation                          |
| 19    | Distributed SQL and consensus     | Raft: elect, lose, commit         | Simulation, Step through            |
| 20    | Database engines compared         | Engines side by side              | Animated infographic                |
| 21    | Capstone: the slow database       | Diagnose the slow database        | Branching scenario, Fix the problem |

## Enterprise Patterns: curriculum

Architecture area, fourth track (started 2026-10-04). 21 modules in 6 chapters, about 8.5 hours. Accent: "keystone" slate (`[data-track="keystone"]`). Glossary: `glossaries/enterprise-patterns.ts`. Covers team design, domain-driven design, the enterprise integration patterns, architecture styles and legacy modernisation. Vendor-neutral: open-source tools alongside AWS, Azure and Google Cloud integration services. Links to System Design (sagas, event-driven architecture), Streaming (CDC and outbox) and API Design rather than repeating them. Built on one branch (`track/enterprise-patterns`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                       | Centrepiece                                | Key formats               |
| ----- | -------------------------------------------- | ------------------------------------------ | ------------------------- |
| **1** | **The big picture**                          |                                            |                           |
| 1     | What makes enterprise systems hard           | One address change, a dozen copies         | Scroll story              |
| 2     | Conway's law and team topologies             | Reorganise teams, redraw the system        | Simulation                |
| **2** | **Domains and boundaries**                   |                                            |                           |
| 3     | A shared language                            | Five meanings of 'customer'                | Simulation                |
| 4     | Bounded contexts                             | Split the bloated Customer model           | Build connect             |
| 5     | Context maps                                 | Six relationships on a context map         | Animated infographic      |
| 6     | Entities, value objects and aggregates       | Design an order aggregate                  | Simulation                |
| 7     | Event storming                               | Sticky-note timeline for a loan            | Simulation                |
| **3** | **Integrating systems**                      |                                            |                           |
| 8     | Four ways to integrate                       | Four integration styles, one change        | Simulation                |
| 9     | Messaging building blocks                    | Commands, events and documents on channels | Simulation                |
| 10    | Routing and transformation                   | Build an order pipeline                    | Build connect, Simulation |
| 11    | Orchestration and choreography               | Conductor vs reacting services             | Simulation                |
| 12    | From ESB to API-led integration              | ESB to API-led to event mesh               | Animated infographic      |
| **4** | **Architecture styles**                      |                                            |                           |
| 13    | Layers, hexagons and clean architecture      | Swap the edges, keep the core              | Simulation                |
| 14    | Modular monoliths and microservices          | One, five or fifty deployables             | Simulation                |
| 15    | CQRS and event sourcing                      | Rebuild a balance from events              | Simulation, Step through  |
| 16    | Who owns the data?                           | Untangle a shared database                 | Simulation                |
| **5** | **Change and legacy**                        |                                            |                           |
| 17    | The strangler fig                            | Strangle a legacy system route by route    | Simulation                |
| 18    | Living with legacy                           | Wrap a mainframe                           | Build connect             |
| 19    | Architecture decisions and fitness functions | ADR to fitness function                    | Simulation                |
| 20    | Enterprise architecture and governance       | C4 levels and a technology radar           | Animated infographic      |
| **6** | **Capstone**                                 |                                            |                           |
| 21    | Capstone: modernising a benefits system      | Modernise a benefits platform              | Branching scenario        |

## Apache Spark: curriculum

Data engineering area, third track (started 2026-10-04). 21 modules in 6 chapters, about 8 hours. Accent: "ember" red (`[data-track="ember"]`). Glossary: `glossaries/spark.ts`. Vendor-neutral: open-source Spark alongside Databricks, Amazon EMR and Glue, Google Dataproc, Azure and Fabric, and Kubernetes. Links to the Lakehouse track (file formats, table layout) and Streaming track rather than repeating them. Built on one branch (`track/spark`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                | Centrepiece                   | Key formats                         |
| ----- | ------------------------------------- | ----------------------------- | ----------------------------------- |
| **1** | **The big picture**                   |                               |                                     |
| 1     | Why Spark exists                      | MapReduce vs Spark data trips | Scroll story                        |
| 2     | Driver, executors and the cluster     | Follow a job to executors     | Animated infographic, Simulation    |
| **2** | **Data and APIs**                     |                               |                                     |
| 3     | RDDs, DataFrames and Datasets         | Word count three ways         | Simulation                          |
| 4     | Transformations, actions and laziness | Build a plan lazily           | Step through                        |
| 5     | Partitions and parallelism            | Tasks in waves                | Simulation                          |
| 6     | Spark SQL and the DataFrame API       | SQL and DataFrame, one plan   | Simulation                          |
| **3** | **How a query runs**                  |                               |                                     |
| 7     | The Catalyst optimiser                | Step through Catalyst         | Step through                        |
| 8     | Jobs, stages and tasks                | A simulated Spark UI          | Simulation                          |
| 9     | The shuffle                           | Every executor to every other | Simulation                          |
| 10    | Join strategies                       | Broadcast or sort-merge       | Simulation                          |
| 11    | Adaptive Query Execution              | Re-plan at runtime            | Simulation                          |
| 12    | Tungsten and vectorised engines       | Row, codegen, vectorised      | Animated infographic                |
| **4** | **Performance**                       |                               |                                     |
| 13    | Data skew                             | One task straggles            | Simulation, Fix the problem         |
| 14    | Memory, spill and out-of-memory       | Memory regions and spill      | Simulation                          |
| 15    | Caching and persistence               | Cache or recompute            | Simulation                          |
| 16    | Reading and writing files             | Thousands of tiny files       | Simulation, Fix the problem         |
| **5** | **Beyond batch**                      |                               |                                     |
| 17    | Structured Streaming                  | Micro-batches and watermarks  | Simulation                          |
| 18    | PySpark, Arrow and UDFs               | Python UDF three ways         | Simulation                          |
| 19    | Running Spark                         | Where Spark runs              | Animated infographic                |
| 20    | Cost and right-sizing                 | Size the cluster              | Simulation                          |
| **6** | **Capstone**                          |                               |                                     |
| 21    | Capstone: the slow nightly job        | The slow nightly job          | Branching scenario, Fix the problem |

## Data Modelling: curriculum

Data engineering area, fourth track (started 2026-10-04). 21 modules in 6 chapters, about 8 hours. Accent: "timber" brown (`[data-track="timber"]`). Glossary: `glossaries/data-modelling.ts`. Vendor-neutral: PostgreSQL, the major cloud warehouses and lakehouses, dbt and NoSQL databases. Built on one branch (`track/data-modelling`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                      | Centrepiece                    | Key formats          |
| ----- | ------------------------------------------- | ------------------------------ | -------------------- |
| **1** | **The big picture**                         |                                |                      |
| 1     | Why model data?                             | Messy sheet vs modelled table  | Scroll story         |
| 2     | Conceptual, logical and physical            | A library, three ways          | Step through         |
| **2** | **Relational foundations**                  |                                |                      |
| 3     | Keys and relationships                      | Keys and crow's feet           | Build connect        |
| 4     | Normalisation                               | Normalise a spreadsheet        | Step through         |
| 5     | Transactions vs analytics                   | Same data, two shapes          | Simulation           |
| **3** | **Dimensional modelling**                   |                                |                      |
| 6     | Facts, dimensions and the star schema       | Build a star                   | Build connect        |
| 7     | The four-step design process                | Pick the grain                 | Step through         |
| 8     | Types of fact table                         | Three fact tables              | Simulation           |
| 9     | Conformed dimensions and the bus matrix     | Build a bus matrix             | Build connect        |
| 10    | Dimension patterns                          | Dimension patterns             | Fix the problem      |
| 11    | Slowly changing dimensions                  | SCD types side by side         | Simulation           |
| **4** | **Other approaches**                        |                                |                      |
| 12    | Inmon, Kimball and the enterprise warehouse | Two warehouse philosophies     | Animated infographic |
| 13    | Data Vault                                  | Hubs, links and satellites     | Build connect        |
| 14    | One big table                               | Star or one big table          | Simulation           |
| 15    | Metrics and semantic layers                 | One metric, defined once       | Simulation           |
| **5** | **Modern practice**                         |                                |                      |
| 16    | Layered modelling with dbt                  | Staging to marts               | Build connect        |
| 17    | Modelling for NoSQL                         | Design from access patterns    | Simulation           |
| 18    | Graph models                                | Nodes and edges                | Simulation           |
| 19    | Modelling time                              | Valid time and record time     | Simulation           |
| 20    | Naming, documentation and change            | Change without breaking        | Fix the problem      |
| **6** | **Capstone**                                |                                |                      |
| 21    | Capstone: model a food-delivery business    | Model a food-delivery business | Branching scenario   |

## Data Quality: curriculum

Data engineering area, fifth track (started 2026-10-04). 21 modules in 6 chapters, about 8 hours. Accent: "assay" jade (`[data-track="assay"]`). Glossary: `glossaries/data-quality.ts`. Vendor-neutral: open-source frameworks (Great Expectations, Soda, dbt, Deequ), commercial observability platforms, and the quality features of AWS, Google Cloud, Azure, Databricks and Snowflake. Links to the Observability track (SLOs, incidents) and Data Modelling track (contracts, change) rather than repeating them. Built on one branch (`track/data-quality`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                             | Centrepiece                         | Key formats                         |
| ----- | ---------------------------------- | ----------------------------------- | ----------------------------------- |
| **1** | **The big picture**                |                                     |                                     |
| 1     | Why data quality matters           | One bad value's journey             | Scroll story                        |
| 2     | Dimensions of data quality         | Find the defect, name the dimension | Fix the problem                     |
| **2** | **Testing data**                   |                                     |                                     |
| 3     | Testing data like code             | A bad load meets its tests          | Build connect                       |
| 4     | Profiling a dataset                | Profile a supplier file             | Simulation                          |
| 5     | Validation frameworks              | One rule, three tools               | Simulation                          |
| 6     | Where to test in a pipeline        | Checks along a pipeline             | Build connect                       |
| 7     | Failing well                       | Warn, block or quarantine           | Simulation                          |
| **3** | **Contracts and ownership**        |                                     |                                     |
| 8     | Data contracts                     | Write a contract                    | Build connect                       |
| 9     | Schema changes                     | Compatibility modes                 | Simulation                          |
| 10    | Ownership and stewardship          | Who owns what                       | Simulation                          |
| 11    | Freshness, SLAs and SLOs           | Freshness and error budgets         | Simulation                          |
| **4** | **Data observability**             |                                     |                                     |
| 12    | Data observability                 | Five signals, one silent failure    | Simulation                          |
| 13    | Anomaly detection                  | Thresholds vs baselines             | Simulation                          |
| 14    | Lineage and impact                 | Trace the broken dashboard          | Build connect                       |
| 15    | Handling data incidents            | Run a data incident                 | Branching scenario                  |
| **5** | **Hard problems**                  |                                     |                                     |
| 16    | Duplicates and entity resolution   | Match two customer lists            | Simulation                          |
| 17    | Reconciliation                     | Reconcile source and target         | Simulation                          |
| 18    | Late and missing data              | Late events and backfills           | Simulation                          |
| 19    | Data quality for ML and AI         | Dirty data, drifting model          | Simulation                          |
| 20    | Tools and platforms                | The tool landscape                  | Animated infographic                |
| **6** | **Capstone**                       |                                     |                                     |
| 21    | Capstone: the wrong revenue number | The wrong revenue number            | Branching scenario, Fix the problem |

## AI Agents: curriculum

AI & machine learning area, third track (started 2026-10-04). 21 modules in 7 chapters, about 8 hours. Accent: "orbit" violet (`[data-track="orbit"]`). Glossary: `glossaries/ai-agents.ts`. Vendor-neutral: open-source frameworks (LangGraph, OpenAI Agents SDK, Claude Agent SDK, Google ADK, Microsoft Agent Framework, CrewAI and others), open protocols (MCP, A2A) and the managed agent services of AWS, Google Cloud and Microsoft. Builds on LLM Foundations (tool calling, prompt injection) and RAG Systems (agentic RAG) rather than repeating them. Built on one branch (`track/ai-agents`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                         | Centrepiece                        | Key formats                         |
| ----- | ------------------------------ | ---------------------------------- | ----------------------------------- |
| **1** | **The big picture**            |                                    |                                     |
| 1     | What an agent is               | Chatbot, workflow or agent         | Scroll story                        |
| 2     | The agent loop                 | One task, turn by turn             | Step through                        |
| 3     | Workflows or agents?           | Match tasks to patterns            | Build connect                       |
| **2** | **Tools**                      |                                    |                                     |
| 4     | Designing tools                | Fix three bad tools                | Fix the problem                     |
| 5     | Model Context Protocol         | Host, client and server            | Animated infographic                |
| 6     | Code, browsers and computers   | Sandbox, browser or desktop        | Simulation                          |
| **3** | **Planning and reasoning**     |                                    |                                     |
| 7     | Planning and decomposition     | Plan first or as you go            | Simulation                          |
| 8     | Reflection and self-correction | Add a critic                       | Simulation                          |
| 9     | Errors, retries and limits     | Inject failures, choose recoveries | Fix the problem                     |
| **4** | **Memory and context**         |                                    |                                     |
| 10    | Memory                         | Three kinds of memory              | Simulation                          |
| 11    | Managing long tasks            | A 200-step task                    | Simulation                          |
| 12    | State, pauses and resumption   | Crash and resume                   | Simulation                          |
| **5** | **Many agents**                |                                    |                                     |
| 13    | Multi-agent systems            | Orchestrator and workers           | Simulation                          |
| 14    | Agents talking to agents       | Agent cards and delegation         | Animated infographic                |
| 15    | Frameworks and platforms       | The framework map                  | Animated infographic                |
| **6** | **Safety and production**      |                                    |                                     |
| 16    | Guardrails and permissions     | Permissions for an email agent     | Simulation                          |
| 17    | Prompt injection and agents    | The poisoned web page              | Fix the problem                     |
| 18    | Humans in the loop             | Where to ask a person              | Simulation                          |
| 19    | Evaluating agents              | Outcome, path and cost             | Simulation                          |
| 20    | Cost, latency and tracing      | Trace and trim a run               | Fix the problem                     |
| **7** | **Capstone**                   |                                    |                                     |
| 21    | Capstone: the support agent    | Five failures, five fixes          | Branching scenario, Fix the problem |

## Voice AI: curriculum

AI & machine learning area, fourth track (started 2026-10-05). 18 modules in 6 chapters, about 7 hours. Accent: "timbre" rose (`[data-track="timbre"]`). Glossary: `glossaries/voice-ai.ts`. Vendor-neutral: open-source speech models and frameworks (Whisper, NVIDIA Parakeet, Kokoro, Kyutai, Pipecat, LiveKit Agents), specialist voice APIs, and the speech services of Google, Microsoft, AWS and OpenAI. Builds on AI Agents (tools, guardrails) and LLM Foundations (latency, streaming) rather than repeating them. Built on one branch (`track/voice-ai`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                           | Centrepiece                 | Key formats                         |
| ----- | -------------------------------- | --------------------------- | ----------------------------------- |
| **1** | **The big picture**              |                             |                                     |
| 1     | Why voice is hard                | A human call vs a slow bot  | Scroll story                        |
| 2     | Sound as data                    | Record, resample, see       | Simulation                          |
| 3     | The voice pipeline               | One question, five stages   | Animated infographic                |
| **2** | **Listening**                    |                             |                                     |
| 4     | Speech recognition               | Score a transcript          | Simulation                          |
| 5     | Voice activity and turn-taking   | Tune the endpoint           | Simulation                          |
| 6     | Noise, accents and speakers      | Noise, echo, accents        | Simulation                          |
| **3** | **Speaking**                     |                             |                                     |
| 7     | Speech synthesis                 | Neural voices, streamed     | Simulation                          |
| 8     | Writing for the ear              | Fix a reply for the ear     | Fix the problem                     |
| 9     | Voice cloning and consent        | Six cloning requests        | Branching scenario                  |
| **4** | **Real time**                    |                             |                                     |
| 10    | The latency budget               | Build the latency budget    | Simulation                          |
| 11    | Speech-to-speech models          | Cascade vs speech-to-speech | Simulation                          |
| 12    | Barge-in and interruptions       | Interrupt the assistant     | Simulation                          |
| 13    | WebRTC, WebSockets and phones    | Three ways to carry audio   | Animated infographic                |
| **5** | **Voice agents**                 |                             |                                     |
| 14    | Designing voice conversations    | Rescue a phone menu         | Fix the problem                     |
| 15    | Taking action mid-call           | Change a booking mid-call   | Simulation                          |
| 16    | Voice platforms and models       | The voice stack map         | Animated infographic                |
| 17    | Testing and running voice agents | Simulated callers           | Simulation                          |
| **6** | **Capstone**                     |                             |                                     |
| 18    | Capstone: the clinic phone line  | The clinic phone line       | Branching scenario, Fix the problem |

## LLM Evaluation: curriculum

AI & machine learning area, fifth track (started 2026-10-05). 20 modules in 7 chapters, about 7 hours. Accent: "gauge" sky (`[data-track="gauge"]`). Glossary: `glossaries/llm-evaluation.ts`. Vendor-neutral: open-source frameworks (Inspect, DeepEval, Ragas, lm-evaluation-harness, OpenAI Evals), evaluation and observability platforms, and the evaluation services of OpenAI, Anthropic, Google, AWS and Microsoft. Builds on LLM Foundations (sampling, prompting), RAG Systems and AI Agents rather than repeating them. Built on one branch (`track/llm-evaluation`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                  | Centrepiece                            | Key formats                         |
| ----- | --------------------------------------- | -------------------------------------- | ----------------------------------- |
| **1** | **The big picture**                     |                                        |                                     |
| 1     | Why evaluate                            | Five answers versus a hundred cases    | Scroll story                        |
| 2     | Deciding what good means                | From "helpful" to measurable           | Build connect                       |
| 3     | Building an eval set                    | Grow an eval set                       | Simulation                          |
| **2** | **Scoring answers**                     |                                        |                                     |
| 4     | Code-based checks                       | Graders a program can run              | Simulation                          |
| 5     | Similarity metrics                      | When overlap lies                      | Simulation                          |
| 6     | LLM as a judge                          | Catch the biased judge                 | Fix the problem                     |
| 7     | Trusting your judge                     | Judge versus experts                   | Simulation                          |
| 8     | Human evaluation                        | Run a rating study                     | Simulation                          |
| **3** | **How sure are you?**                   |                                        |                                     |
| 9     | Error bars for evals                    | Watch the score wobble                 | Simulation                          |
| 10    | Comparing two versions                  | A versus B, honestly                   | Simulation                          |
| 11    | Non-determinism and reliability         | Right every time?                      | Simulation                          |
| **4** | **Benchmarks**                          |                                        |                                     |
| 12    | Public benchmarks                       | Read a benchmark table                 | Animated infographic                |
| 13    | Contamination and gaming                | Find the leaked questions              | Fix the problem                     |
| **5** | **Evaluating real systems**             |                                        |                                     |
| 14    | Evaluating RAG and agents               | Evaluate a RAG answer and an agent run | Build connect                       |
| 15    | Safety evals and red-teaming            | Red-team a chatbot                     | Simulation                          |
| 16    | Bias and fairness evals                 | Swap the name, change the answer?      | Simulation                          |
| **6** | **Evals in practice**                   |                                        |                                     |
| 17    | Evals in development                    | Evals as tests in CI                   | Simulation                          |
| 18    | Evaluation in production                | Watch production                       | Simulation                          |
| 19    | Evaluation tools                        | The eval tool map                      | Animated infographic                |
| **7** | **Capstone**                            |                                        |                                     |
| 20    | Capstone: should we ship the new model? | Should we ship it?                     | Branching scenario, Fix the problem |

## Applied ML: curriculum

AI & machine learning area, sixth track (started 2026-10-06). 22 modules in 7 chapters, about 8 hours. Accent: "gradient" amber (`[data-track="gradient"]`). Glossary: `glossaries/applied-ml.ts`. Vendor-neutral: open-source libraries (scikit-learn, XGBoost, LightGBM, CatBoost, MLflow, statsmodels), and the ML platforms of AWS (SageMaker), Google (Gemini Enterprise Agent Platform, formerly Vertex AI), Microsoft (Azure Machine Learning) and Databricks. Focuses on classic ML on tabular data; builds on Data Quality (drift, training–serving skew) and LLM Evaluation (metrics, statistics) rather than repeating them. Built on one branch (`track/applied-ml`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                  | Centrepiece                                     | Key formats                         |
| ----- | --------------------------------------- | ----------------------------------------------- | ----------------------------------- |
| **1** | **The big picture**                     |                                                 |                                     |
| 1     | What machine learning is                | Hand-written rules versus a learned spam filter | Scroll story                        |
| 2     | The ML project lifecycle                | A churn project, start to finish                | Animated infographic                |
| 3     | Framing the problem                     | From “reduce churn” to a prediction target      | Build connect                       |
| **2** | **Data and features**                   |                                                 |                                     |
| 4     | Training, validation and test sets      | Random, time and group splits                   | Simulation                          |
| 5     | Feature engineering                     | Build features, watch the score                 | Build connect                       |
| 6     | Data leakage                            | Find the leak                                   | Fix the problem                     |
| **3** | **Models**                              |                                                 |                                     |
| 7     | Linear and logistic regression          | Fit a line, then let gradient descent           | Simulation                          |
| 8     | Decision trees                          | Grow a loan-approval tree                       | Simulation                          |
| 9     | Random forests and gradient boosting    | Vote and boost                                  | Simulation                          |
| 10    | Overfitting and regularisation          | Train versus validation error                   | Simulation                          |
| 11    | Clustering and dimensionality reduction | Segment customers with k-means                  | Simulation                          |
| **4** | **Evaluating models**                   |                                                 |                                     |
| 12    | Accuracy, precision and recall          | Move the fraud threshold                        | Simulation                          |
| 13    | Measuring regression errors             | One huge miss, three metrics                    | Simulation                          |
| 14    | Rare events and imbalanced data         | 1 in 500 is fraud                               | Fix the problem                     |
| 15    | Probabilities you can trust             | Does 70% mean 70%?                              | Simulation                          |
| **5** | **Improving and explaining**            |                                                 |                                     |
| 16    | Hyperparameter tuning                   | Search the knobs on a budget                    | Simulation                          |
| 17    | Explaining predictions                  | Why was this loan declined?                     | Simulation                          |
| 18    | Forecasting time series                 | Backtest a demand forecast                      | Simulation                          |
| **6** | **ML in production**                    |                                                 |                                     |
| 19    | Serving models                          | Batch, real time or on device                   | Simulation                          |
| 20    | Drift and monitoring                    | Watch a model decay                             | Simulation                          |
| 21    | The ML tool landscape                   | The ML tool map                                 | Animated infographic                |
| **7** | **Capstone**                            |                                                 |                                     |
| 22    | Capstone: predicting customer churn     | The churn model, end to end                     | Branching scenario, Fix the problem |

## Application Security: curriculum

Security & government area, first track (started 2026-10-07). 22 modules in 6 chapters, about 8 hours. Accent: "bastion" plum (`[data-track="bastion"]`). Glossary: `glossaries/app-security.ts`. Vendor-neutral: open standards (OWASP Top 10 and ASVS, NIST, CWE, IETF RFCs), open-source tools (OWASP ZAP, Semgrep, Trivy, gitleaks, Sigstore) and the security services of AWS, Google Cloud, Microsoft Azure and GitHub. Every attack is a safe, rules-based simulation in the browser: no real payloads against real systems. Builds on API Design (auth basics), CI/CD (pipeline and supply-chain basics) and Cloud Architecture (IAM) rather than repeating them. Built on one branch (`track/app-security`), one commit per module, merged once at the end. Each module is fact-checked on its own before it is built; card illustrations and a showcase follow the last module.

| #     | Module                                | Centrepiece                           | Key formats                         |
| ----- | ------------------------------------- | ------------------------------------- | ----------------------------------- |
| **1** | **The big picture**                   |                                       |                                     |
| 1     | Why application security              | Breach timeline scroll story          | Scroll story                        |
| 2     | Threat modelling                      | Data-flow diagram + STRIDE finder     | Build connect                       |
| 3     | Secure design principles              | Layered defences vs an attack         | Simulation                          |
| 4     | The OWASP Top 10                      | Top 10 tour mapped to incidents       | Animated infographic                |
| **2** | **Injection and input**               |                                       |                                     |
| 5     | SQL injection                         | Live login query builder              | Simulation                          |
| 6     | Cross-site scripting                  | Sandboxed comment page                | Simulation                          |
| 7     | Command, template and other injection | Three injections, one fix             | Fix the problem                     |
| 8     | Validation and safe parsing           | Upload validator                      | Simulation                          |
| **3** | **Identity and access**               |                                       |                                     |
| 9     | Passwords and authentication          | Password-cracking race                | Simulation                          |
| 10    | MFA and passkeys                      | Phishing vs three MFA kinds           | Simulation                          |
| 11    | Sessions, cookies and tokens          | Session theft and hardening           | Simulation                          |
| 12    | Broken access control                 | IDOR invoice viewer                   | Simulation                          |
| 13    | OAuth and OpenID Connect              | OAuth flow step-through               | Step through                        |
| **4** | **The web platform**                  |                                       |                                     |
| 14    | CSRF, CORS and the same-origin policy | Forged transfer vs defences           | Simulation                          |
| 15    | Security headers and CSP              | Header toggles vs attacks             | Simulation                          |
| 16    | Server-side request forgery           | Image preview reaches metadata        | Simulation                          |
| 17    | Encryption and TLS                    | TLS handshake + café Wi-Fi            | Step through                        |
| **5** | **Secure delivery**                   |                                       |                                     |
| 18    | Secrets management                    | Leaked key hunt and rotation          | Fix the problem                     |
| 19    | Dependencies and the supply chain     | Dependency tree trace                 | Simulation                          |
| 20    | Security testing and DevSecOps        | Testing tools on a pipeline           | Animated infographic                |
| 21    | Logging, detection and response       | Incident log triage                   | Branching scenario                  |
| **6** | **Capstone**                          |                                       |                                     |
| 22    | Capstone: securing a payments app     | Payments app threat model + incidents | Branching scenario, Fix the problem |

## Roadmap

| Step                       | Scope                                                                                   | Status                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1. Foundation              | Shell, design language, routing, Module SDK, progress adapter, checkpoints, smoke tests | **Done.** A sample module lives at `/tracks/playground/rows-vs-columns` |
| 2. Flagship                | Module 6, Delta Lake transaction log: storyboard, then build                            | **Done.** 14 steps, fact-checked (module `SOURCES.md`)                  |
| 3. Parallel flagship       | Module 7, Iceberg metadata tree. First 3D module; sets the R3F toolkit                  | Next                                                                    |
| 4. Rest of track           | Chapters 1 → 9, growing the toolkit (charts, builder, sandbox) along the way            | Done: all 29 modules live (2026-09-24)                                  |
| 4b. System Design          | Second track (Architecture), 27 modules                                                 | Live: all 27 modules                                                    |
| 4c. LLM Foundations        | Third track (AI & machine learning), 26 modules                                         | Live: all 26 modules (2026-09-25)                                       |
| 4d. Agile & Scrum          | Delivery management, first track, 23 modules                                            | Live: all 23 modules (2026-09-28)                                       |
| 4e. RAG Systems            | AI & machine learning, second track, 23 modules                                         | Live: all 23 modules (2026-09-29)                                       |
| 4f. Cloud Architecture     | Platform & cloud, first track, 22 modules                                               | Live: all 22 modules (2026-10-02)                                       |
| 4g. Streaming Data Systems | Data engineering, second track, 23 modules                                              | Live: all 23 modules (2026-10-02)                                       |
| 4h. Kubernetes             | Platform & cloud, second track, 23 modules                                              | Live: all 23 modules (2026-10-03)                                       |
| 4i. CI/CD                  | Platform & cloud, third track, 21 modules                                               | Live: all 21 modules (2026-10-03)                                       |
| 4j. Observability          | Platform & cloud, fourth track, 21 modules                                              | Live: all 21 modules (2026-10-03)                                       |
| 4k. API Design             | Architecture, second track, 21 modules                                                  | Live: all 21 modules (2026-10-04)                                       |
| 4l. Database Internals     | Architecture, third track, 21 modules                                                   | Live: all 21 modules (2026-10-04)                                       |
| 4m. Enterprise Patterns    | Architecture, fourth track, 21 modules                                                  | Live: all 21 modules (2026-10-04)                                       |
| 4n. Apache Spark           | Data engineering, third track, 21 modules                                               | Live: all 21 modules (2026-10-04)                                       |
| 4o. Data Modelling         | Data engineering, fourth track, 21 modules                                              | Live: all 21 modules (2026-10-04)                                       |
| 4p. Data Quality           | Data engineering, fifth track, 21 modules                                               | Live: all 21 modules (2026-10-04)                                       |
| 4q. AI Agents              | AI & machine learning, third track, 21 modules                                          | Live: all 21 modules (2026-10-04)                                       |
| 4r. Voice AI               | AI & machine learning, fourth track, 18 modules                                         | Live: all 18 modules (2026-10-05)                                       |
| 4s. LLM Evaluation         | AI & machine learning, fifth track, 20 modules                                          | Live: all 20 modules (2026-10-05)                                       |
| 4t. Applied ML             | AI & machine learning, sixth track, 22 modules                                          | Live: all 22 modules (2026-10-06)                                       |
| 4u. Application Security   | Security & government, first track, 22 modules                                          | In progress: 22 of 22 modules                                           |
| 5. Team feedback           | 3–5 engineers use the track; refine                                                     |                                                                         |
| 6. Deploy                  | Vercel project + preview deploys; decide on access protection                           |                                                                         |

### Per-module workflow

1. **Storyboard** (in `modules/<track>/<slug>/STORYBOARD.md`): must-understand ideas, misconceptions, representation, interactions, checkpoints, step list.
2. **Build** steps against the toolkit; extract anything reusable into `toolkit/`.
3. **Verify**: typecheck, lint, smoke tests, a visual check in both themes and at mobile width, and a fact check with sources.
4. **Flip** `status: "live"`.
