"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type InferState } from "./state";
import { Ceiling, KvCache, Measured, Timeline, TwoPhases, WhatMoves, Wrap } from "./steps";

export default defineModule<InferState>({
  initialState,
  steps: [
    { id: "phases", title: "Two phases", Component: TwoPhases },
    { id: "measured", title: "Measured on a laptop", Component: Measured },
    { id: "timeline", title: "A request, start to finish", Component: Timeline },
    { id: "ceiling", title: "The memory speed limit", checkpoint: "ceiling", Component: Ceiling },
    { id: "kv", title: "The KV cache", Component: KvCache },
    {
      id: "moves",
      title: "What does each change speed up?",
      checkpoint: "what-moves",
      Component: WhatMoves,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
