"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OutageState } from "./state";
import { Afterwards, Classify, FirstMover, FollowRequest, Paged, StopIt, Wrap } from "./steps";

export default defineModule<OutageState>({
  initialState,
  steps: [
    { id: "paged", title: "Paged at 21:02", Component: Paged },
    { id: "first", title: "What moved first?", checkpoint: "first-mover", Component: FirstMover },
    { id: "follow", title: "Follow a failing request", Component: FollowRequest },
    {
      id: "classify",
      title: "Trigger, amplifier or symptom?",
      checkpoint: "classify",
      Component: Classify,
    },
    { id: "stop", title: "Stop the outage", Component: StopIt },
    { id: "after", title: "After the fire", checkpoint: "incident-order", Component: Afterwards },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
