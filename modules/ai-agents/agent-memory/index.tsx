"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MemState } from "./state";
import { Notebook, WeekLater, Recall, Products, WhichMemory, Wrap } from "./steps";

export default defineModule<MemState>({
  initialState,
  steps: [
    { id: "story", title: "The assistant with a notebook", Component: Notebook },
    { id: "week", title: "A week later", Component: WeekLater },
    { id: "recall", title: "Choosing what to recall", Component: Recall },
    { id: "products", title: "Memory in real products", Component: Products },
    {
      id: "check",
      title: "Which kind of memory?",
      checkpoint: "memory-kind",
      Component: WhichMemory,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
