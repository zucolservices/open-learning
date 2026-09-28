"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReviewState } from "./state";
import { Learned, Scenario, TwoEvents, Myths, Wrap } from "./steps";

export default defineModule<ReviewState>({
  initialState,
  steps: [
    { id: "two", title: "Two kinds of looking back", Component: TwoEvents },
    { id: "scenario", title: "End of Sprint 4", Component: Scenario },
    { id: "learned", title: "What the team learned", Component: Learned },
    { id: "myths", title: "Guide or myth?", checkpoint: "review-myths", Component: Myths },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
