"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MisbehaveState } from "./state";
import { Case1, Case2, Case3, Case4, DebugLoop, Queue, SortSymptoms, Wrap } from "./steps";

export default defineModule<MisbehaveState>({
  initialState,
  steps: [
    { id: "queue", title: "The complaints queue", Component: Queue },
    { id: "cutoff", title: "Case 1: cut off in Kannada", Component: Case1 },
    { id: "sampling", title: "Case 2: a different answer every time", Component: Case2 },
    { id: "buried", title: "Case 3: it promised approval", Component: Case3 },
    { id: "injection", title: "Case 4: the ₹500 fee", Component: Case4 },
    { id: "sort", title: "Name the cause", checkpoint: "symptoms", Component: SortSymptoms },
    { id: "loop", title: "The debugging loop", checkpoint: "debug-loop", Component: DebugLoop },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
