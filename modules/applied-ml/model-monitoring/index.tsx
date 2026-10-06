"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MonitorState } from "./state";
import { OldMap, Dashboard, Psi, Stories, WhichDrift, Wrap } from "./steps";

export default defineModule<MonitorState>({
  initialState,
  steps: [
    { id: "story", title: "A sat-nav with an old map", Component: OldMap },
    { id: "dashboard", title: "Six months in production", Component: Dashboard },
    { id: "psi", title: "Measuring how far inputs moved", Component: Psi },
    { id: "stories", title: "When the world changed", Component: Stories },
    {
      id: "check",
      title: "Which kind of drift?",
      checkpoint: "which-drift",
      Component: WhichDrift,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
