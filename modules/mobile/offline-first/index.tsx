"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OfflineState } from "./state";
import { Notebook, Lift, Writes, Tools, OfflineCheck, Wrap } from "./steps";

export default defineModule<OfflineState>({
  initialState,
  steps: [
    { id: "story", title: "The waiter's notepad", Component: Notebook },
    { id: "lift", title: "An order in a lift", Component: Lift },
    { id: "writes", title: "Three ways to write", Component: Writes },
    { id: "tools", title: "Building blocks", Component: Tools },
    {
      id: "check",
      title: "Which write strategy?",
      checkpoint: "mobile-offline",
      Component: OfflineCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
