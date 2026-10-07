"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TopState } from "./state";
import { FireList, Tour, HowMade, Family, WhichCategory, Wrap } from "./steps";

export default defineModule<TopState>({
  initialState,
  steps: [
    { id: "story", title: "The fire service's list", Component: FireList },
    { id: "tour", title: "Tour the Top 10", Component: Tour },
    { id: "made", title: "How the list is made", Component: HowMade },
    { id: "family", title: "The list's relatives", Component: Family },
    {
      id: "check",
      title: "Which category?",
      checkpoint: "top10-category",
      Component: WhichCategory,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
