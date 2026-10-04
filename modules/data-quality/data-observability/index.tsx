"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ObsState } from "./state";
import { Dashboard, Watch, Unknowns, Tools, WhichSignal, Wrap } from "./steps";

export default defineModule<ObsState>({
  initialState,
  steps: [
    { id: "story", title: "The car dashboard", Component: Dashboard },
    { id: "watch", title: "Watch a table for a week", Component: Watch },
    { id: "unknowns", title: "Tests and observability", Component: Unknowns },
    { id: "tools", title: "Where it comes from", Component: Tools },
    {
      id: "check",
      title: "Which signal catches it?",
      checkpoint: "which-signal",
      Component: WhichSignal,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
