"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ConflictState } from "./state";
import { OneWall, Resolve, Styles, Helpers, OrderCheck, Wrap } from "./steps";

export default defineModule<ConflictState>({
  initialState,
  steps: [
    { id: "story", title: "One wall, two colours", Component: OneWall },
    { id: "resolve", title: "Resolve the conflict", Component: Resolve },
    { id: "styles", title: "Show me the original too", Component: Styles },
    { id: "helpers", title: "Escape hatches and helpers", Component: Helpers },
    {
      id: "check",
      title: "Put the steps in order",
      checkpoint: "git-conflicts",
      Component: OrderCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
