"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SurgeState } from "./state";
import { Festival, ResultsDay, RealSurges, Playbook, SurgeCheck, Wrap } from "./steps";

export default defineModule<SurgeState>({
  initialState,
  steps: [
    { id: "story", title: "The festival crowd", Component: Festival },
    { id: "results", title: "Results day at 10 a.m.", Component: ResultsDay },
    { id: "real", title: "Real surges in India", Component: RealSurges },
    { id: "playbook", title: "The surge playbook", Component: Playbook },
    {
      id: "check",
      title: "Spread the peak, or serve more?",
      checkpoint: "gov-surge",
      Component: SurgeCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
