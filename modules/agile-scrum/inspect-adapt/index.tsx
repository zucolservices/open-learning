"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type InspectState } from "./state";
import { DefinedOrEmpirical, Driving, Pillars, Steer, WhenInspect, Wrap } from "./steps";

export default defineModule<InspectState>({
  initialState,
  steps: [
    { id: "driving", title: "Learning to drive", Component: Driving },
    { id: "pillars", title: "Three pillars", Component: Pillars },
    { id: "steer", title: "Steer to a moving target", Component: Steer },
    {
      id: "defined",
      title: "Defined or empirical?",
      checkpoint: "defined-empirical",
      Component: DefinedOrEmpirical,
    },
    {
      id: "when",
      title: "When does Scrum inspect?",
      checkpoint: "when-inspect",
      Component: WhenInspect,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
