"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PromptState } from "./state";
import { Briefing, BuildPrompt, OrderAndCache, WherePassagesGo, Wrap } from "./steps";

export default defineModule<PromptState>({
  initialState,
  steps: [
    { id: "briefing", title: "Briefing a stand-in", Component: Briefing },
    { id: "build", title: "Build the prompt", Component: BuildPrompt },
    { id: "position", title: "Does position matter?", Component: WherePassagesGo },
    {
      id: "order",
      title: "Order for caching",
      checkpoint: "prompt-order",
      Component: OrderAndCache,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
