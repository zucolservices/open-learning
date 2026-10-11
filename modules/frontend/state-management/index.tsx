"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MgmtState } from "./state";
import { House, Decide, Ladder, ContextVsStore, MgmtCheck, Wrap } from "./steps";

export default defineModule<MgmtState>({
  initialState,
  steps: [
    { id: "story", title: "Where do you keep your keys?", Component: House },
    { id: "decide", title: "Find a home for each piece of state", Component: Decide },
    { id: "ladder", title: "Climb only as high as you need", Component: Ladder },
    { id: "context", title: "Context isn't a store", Component: ContextVsStore },
    {
      id: "check",
      title: "The shareable filter",
      checkpoint: "frontend-state-mgmt",
      Component: MgmtCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
