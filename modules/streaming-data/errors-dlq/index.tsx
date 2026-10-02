"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DlqState } from "./state";
import { Backoff, BrokenCar, PoisonPill, Platforms, WhatToDo, Wrap } from "./steps";

export default defineModule<DlqState>({
  initialState,
  steps: [
    { id: "car", title: "A breakdown at the toll booth", Component: BrokenCar },
    { id: "poison", title: "One bad event", Component: PoisonPill },
    { id: "backoff", title: "Back off, with jitter", Component: Backoff },
    { id: "platforms", title: "Dead letters everywhere", Component: Platforms },
    {
      id: "check",
      title: "Retry, park or replay?",
      checkpoint: "retry-park-replay",
      Component: WhatToDo,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
