"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyObsState } from "./state";
import { ThreeAm } from "./steps-story";
import { AskNew, PredictedOrNew, TwoIdeas, Wrap } from "./steps";

export default defineModule<WhyObsState>({
  initialState,
  steps: [
    { id: "story", title: "3 a.m.", Component: ThreeAm },
    { id: "ask", title: "Ask a new question", Component: AskNew },
    { id: "compare", title: "Monitoring and observability", Component: TwoIdeas },
    {
      id: "check",
      title: "Predicted or new?",
      checkpoint: "predicted-or-new",
      Component: PredictedOrNew,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
