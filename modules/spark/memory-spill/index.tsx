"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MemState } from "./state";
import { Desk, MemorySim, Container, SpillUi, WhatHappens, Wrap } from "./steps";

export default defineModule<MemState>({
  initialState,
  steps: [
    { id: "story", title: "A crowded desk", Component: Desk },
    { id: "sim", title: "Inside an executor", Component: MemorySim },
    { id: "container", title: "Heap and container", Component: Container },
    { id: "ui", title: "Finding spill", Component: SpillUi },
    {
      id: "check",
      title: "Spill, OOM or killed?",
      checkpoint: "spill-oom-killed",
      Component: WhatHappens,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
