"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IndexState } from "./state";
import { ChaiStall, ClimbGraph, MemoryCalc, MemoryGuess, SpeedVsRecall, Wrap } from "./steps";

export default defineModule<IndexState>({
  initialState,
  steps: [
    { id: "chai", title: "The nearest chai stall", Component: ChaiStall },
    { id: "climb", title: "Climb the graph", Component: ClimbGraph },
    { id: "tradeoff", title: "Speed against recall", Component: SpeedVsRecall },
    { id: "memory", title: "Where the memory goes", Component: MemoryCalc },
    { id: "guess", title: "Guess the memory", checkpoint: "vec-memory", Component: MemoryGuess },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
