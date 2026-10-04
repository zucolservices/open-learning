"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CacheState } from "./state";
import { Stock, CacheSim, Levels, LazyLeaky, CacheIt, Wrap } from "./steps";

export default defineModule<CacheState>({
  initialState,
  steps: [
    { id: "story", title: "Make the stock once", Component: Stock },
    { id: "sim", title: "Reuse without recomputing", Component: CacheSim },
    { id: "levels", title: "Storage levels", Component: Levels },
    { id: "lazy", title: "Lazy, and easy to forget", Component: LazyLeaky },
    { id: "check", title: "Cache it?", checkpoint: "cache-it", Component: CacheIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
