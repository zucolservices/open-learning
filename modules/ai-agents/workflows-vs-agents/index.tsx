"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FlowState } from "./state";
import { Kitchen, Patterns, Match, StartSimple, WhatFirst, Wrap } from "./steps";

export default defineModule<FlowState>({
  initialState,
  steps: [
    { id: "story", title: "Set menu or à la carte", Component: Kitchen },
    { id: "patterns", title: "Five workflow patterns", Component: Patterns },
    { id: "match", title: "Match the task to the pattern", Component: Match },
    { id: "simple", title: "Start simple", Component: StartSimple },
    {
      id: "check",
      title: "What would you build first?",
      checkpoint: "build-first",
      Component: WhatFirst,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
