"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AsState } from "./state";
import { Family, FestivalDay, SurviveSpike, WhichAutoscaler, Wrap } from "./steps";

export default defineModule<AsState>({
  initialState,
  steps: [
    { id: "festival", title: "Festival day at the sweet shop", Component: FestivalDay },
    { id: "spike", title: "Survive the spike", Component: SurviveSpike },
    { id: "family", title: "The autoscaling family", Component: Family },
    {
      id: "check",
      title: "Which autoscaler?",
      checkpoint: "which-autoscaler",
      Component: WhichAutoscaler,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
