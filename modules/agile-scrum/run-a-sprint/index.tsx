"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SprintState } from "./state";
import { Briefing, CancelCheck, Debrief, TheSprint, Wrap } from "./steps";

export default defineModule<SprintState>({
  initialState,
  steps: [
    { id: "briefing", title: "The briefing", Component: Briefing },
    { id: "sprint", title: "Run the Sprint", Component: TheSprint },
    { id: "debrief", title: "The debrief", Component: Debrief },
    {
      id: "cancel",
      title: "One more surprise",
      checkpoint: "sprint-cancel",
      Component: CancelCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
