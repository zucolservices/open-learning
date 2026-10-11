"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RlState } from "./state";
import { Buffet, Simulate, Algorithms, Telling, RlCheck, Wrap } from "./steps";

export default defineModule<RlState>({
  initialState,
  steps: [
    { id: "story", title: "The all-you-can-eat buffet", Component: Buffet },
    { id: "simulate", title: "Protect the API from a runaway client", Component: Simulate },
    { id: "algorithms", title: "Four ways to count", Component: Algorithms },
    { id: "telling", title: "Telling clients, and protecting yourself", Component: Telling },
    {
      id: "check",
      title: "Being a good client",
      checkpoint: "backend-rate-limiting",
      Component: RlCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
