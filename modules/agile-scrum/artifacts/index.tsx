"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ArtifactsState } from "./state";
import { Connect, GoodGoal, IsItDone, ReadyOrRefine, Wrap } from "./steps";

export default defineModule<ArtifactsState>({
  initialState,
  steps: [
    { id: "connect", title: "Three artifacts, three promises", Component: Connect },
    { id: "done", title: "Is it an Increment yet?", Component: IsItDone },
    { id: "goal", title: "Is this a Product Goal?", checkpoint: "good-goal", Component: GoodGoal },
    {
      id: "ready",
      title: "Ready for a Sprint?",
      checkpoint: "ready-refine",
      Component: ReadyOrRefine,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
