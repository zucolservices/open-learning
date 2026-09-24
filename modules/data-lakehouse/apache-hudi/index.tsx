"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HudiState } from "./state";
import { KeysAndFileGroups, RouteCheck, TimelineRail, WhyHudi } from "./steps-intro";
import { StreamUpserts } from "./steps-sim";
import { IncrementalPipelines, QueryTypes, ReadOptimizedCheck } from "./steps-queries";
import { ConcurrencyAndMetadata, Indexes, TableServices, TableTypeSort, Wrap } from "./steps-more";

export default defineModule<HudiState>({
  initialState,
  steps: [
    { id: "why", title: "Why Uber built Hudi", Component: WhyHudi },
    { id: "timeline", title: "The timeline", Component: TimelineRail },
    { id: "keys", title: "Keys and file groups", Component: KeysAndFileGroups },
    {
      id: "route-check",
      title: "Find the file",
      checkpoint: "route-update",
      Component: RouteCheck,
    },
    { id: "simulate", title: "Stream upserts", Component: StreamUpserts },
    { id: "queries", title: "Three ways to read", Component: QueryTypes },
    {
      id: "ro-check",
      title: "Read-optimized",
      checkpoint: "read-optimized",
      Component: ReadOptimizedCheck,
    },
    { id: "incremental", title: "Incremental pipelines", Component: IncrementalPipelines },
    { id: "services", title: "Table services", Component: TableServices },
    { id: "indexes", title: "Indexes", Component: Indexes },
    { id: "cow-or-mor", title: "CoW or MoR?", checkpoint: "cow-or-mor", Component: TableTypeSort },
    { id: "concurrency", title: "Concurrency & metadata", Component: ConcurrencyAndMetadata },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
