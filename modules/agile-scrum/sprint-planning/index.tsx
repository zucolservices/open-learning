"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PlanState } from "./state";
import { BiggerThanThought, CommitWhat, PlanIt, ThreeTopics, Wrap } from "./steps";

export default defineModule<PlanState>({
  initialState,
  steps: [
    { id: "topics", title: "Why, what and how", Component: ThreeTopics },
    { id: "plan", title: "Plan a Sprint", Component: PlanIt },
    {
      id: "commit",
      title: "What does the team commit to?",
      checkpoint: "commit-what",
      Component: CommitWhat,
    },
    {
      id: "bigger",
      title: "Bigger than we thought",
      checkpoint: "bigger",
      Component: BiggerThanThought,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
