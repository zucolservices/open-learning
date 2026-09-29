"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SchemeState } from "./state";
import { AllDesigns, Brief, Design, Launch, Results, Wrap } from "./steps";

export default defineModule<SchemeState>({
  initialState,
  steps: [
    { id: "brief", title: "The brief", Component: Brief },
    { id: "design", title: "Make your choices", Component: Design },
    { id: "results", title: "Run the test set", Component: Results },
    { id: "all", title: "All 36 designs", Component: AllDesigns },
    { id: "launch", title: "Ready to launch?", checkpoint: "launch-scheme", Component: Launch },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
