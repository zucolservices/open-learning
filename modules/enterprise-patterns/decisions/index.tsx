"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AdrState } from "./state";
import { WhatWereThey, WriteAndGuard, FiveParts, Fitness, WorthIt, Wrap } from "./steps";

export default defineModule<AdrState>({
  initialState,
  steps: [
    { id: "story", title: "What were they thinking?", Component: WhatWereThey },
    { id: "write", title: "Write it, then guard it", Component: WriteAndGuard },
    { id: "parts", title: "Five short sections", Component: FiveParts },
    { id: "fitness", title: "Fitness functions", Component: Fitness },
    { id: "check", title: "Worth a record?", checkpoint: "worth-adr", Component: WorthIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
