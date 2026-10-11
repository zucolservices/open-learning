"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CacheState } from "./state";
import { Board, Simulate, Patterns, Tools, CacheCheck, Wrap } from "./steps";

export default defineModule<CacheState>({
  initialState,
  steps: [
    { id: "story", title: "The specials board", Component: Board },
    { id: "simulate", title: "Put a cache in front of the menu", Component: Simulate },
    { id: "patterns", title: "Cache-aside and friends", Component: Patterns },
    { id: "tools", title: "Tools, licences and stampede tricks", Component: Tools },
    {
      id: "check",
      title: "Cache it or not?",
      checkpoint: "backend-caching",
      Component: CacheCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
