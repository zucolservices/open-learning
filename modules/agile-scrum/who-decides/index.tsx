"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DecideState } from "./state";
import { Kitchen, NotTheBoss, Situations, Summary, Wrap } from "./steps";

export default defineModule<DecideState>({
  initialState,
  steps: [
    { id: "kitchen", title: "Three accountabilities", Component: Kitchen },
    { id: "situations", title: "Who decides?", Component: Situations },
    { id: "summary", title: "Who decides what, at a glance", Component: Summary },
    {
      id: "boss",
      title: "Is the Scrum Master the boss?",
      checkpoint: "not-the-boss",
      Component: NotTheBoss,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
