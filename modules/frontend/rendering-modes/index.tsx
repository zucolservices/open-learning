"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RenderState } from "./state";
import { Furniture, Compare, Streaming, Tradeoffs, RenderCheck, Wrap } from "./steps";

export default defineModule<RenderState>({
  initialState,
  steps: [
    { id: "story", title: "Four ways to get a table", Component: Furniture },
    { id: "compare", title: "Load the same page four ways", Component: Compare },
    { id: "streaming", title: "Streaming and mixing modes", Component: Streaming },
    { id: "tradeoffs", title: "Picking per page", Component: Tradeoffs },
    {
      id: "check",
      title: "Choose a mode for each page",
      checkpoint: "frontend-rendering",
      Component: RenderCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
