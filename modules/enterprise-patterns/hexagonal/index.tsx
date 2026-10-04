"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HexState } from "./state";
import { TravelAdapter, SwapEdges, OneRule, InPractice, CoreOrAdapter, Wrap } from "./steps";

export default defineModule<HexState>({
  initialState,
  steps: [
    { id: "story", title: "The travel adapter", Component: TravelAdapter },
    { id: "swap", title: "Swap the edges, keep the core", Component: SwapEdges },
    { id: "rule", title: "Three names, one rule", Component: OneRule },
    { id: "practice", title: "In practice", Component: InPractice },
    {
      id: "check",
      title: "Core or adapter?",
      checkpoint: "core-or-adapter",
      Component: CoreOrAdapter,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
