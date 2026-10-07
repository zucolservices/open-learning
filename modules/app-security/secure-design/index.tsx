"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DesignState } from "./state";
import { Hotel, Layers, EightPrinciples, FailSafely, WhichPrinciple, Wrap } from "./steps";

export default defineModule<DesignState>({
  initialState,
  steps: [
    { id: "story", title: "How a hotel stays safe", Component: Hotel },
    { id: "layers", title: "Stop a phished password", Component: Layers },
    { id: "principles", title: "Eight principles from 1975", Component: EightPrinciples },
    { id: "fail", title: "When things break", Component: FailSafely },
    {
      id: "check",
      title: "Which principle?",
      checkpoint: "which-principle",
      Component: WhichPrinciple,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
