"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CdnState } from "./state";
import { FarAway, HitRatio, Providers, Publishing, StaleCheck, WhatToCache, Wrap } from "./steps";

export default defineModule<CdnState>({
  initialState,
  steps: [
    { id: "far", title: "Far away is slow", Component: FarAway },
    { id: "hit", title: "The hit ratio", Component: HitRatio },
    { id: "publish", title: "Publishing a change", Component: Publishing },
    {
      id: "what",
      title: "What should the CDN cache?",
      checkpoint: "what-to-cache",
      Component: WhatToCache,
    },
    { id: "providers", title: "CDNs, and code at the edge", Component: Providers },
    {
      id: "stale",
      title: "The stubborn old version",
      checkpoint: "stale-js",
      Component: StaleCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
