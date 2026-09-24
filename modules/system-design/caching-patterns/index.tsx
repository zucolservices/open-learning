"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CacheState } from "./state";
import { CachesEverywhere } from "./steps-layers";
import { PatternSort, Patterns } from "./steps-patterns";
import { DeleteCheck, StaleRace, Wrap } from "./steps-race";

export default defineModule<CacheState>({
  initialState,
  steps: [
    { id: "layers", title: "Caches everywhere", Component: CachesEverywhere },
    { id: "patterns", title: "Four ways to keep a cache", Component: Patterns },
    {
      id: "sort",
      title: "Which pattern is it?",
      checkpoint: "pattern-sort",
      Component: PatternSort,
    },
    { id: "race", title: "The stale-read race", Component: StaleRace },
    {
      id: "delete",
      title: "Update or delete?",
      checkpoint: "update-or-delete",
      Component: DeleteCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
