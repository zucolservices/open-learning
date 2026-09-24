"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ResultsState } from "./state";
import { Brief, Debrief, Decide, Replay, WhyStatic } from "./steps";

export default defineModule<ResultsState>({
  initialState,
  steps: [
    { id: "brief", title: "The brief", checkpoint: "peak-estimate", Component: Brief },
    { id: "decide", title: "Make your design", Component: Decide },
    { id: "replay", title: "Replay results day", Component: Replay },
    {
      id: "why-static",
      title: "Why do files win?",
      checkpoint: "why-static",
      Component: WhyStatic,
    },
    { id: "debrief", title: "What to remember", Component: Debrief },
  ],
});
