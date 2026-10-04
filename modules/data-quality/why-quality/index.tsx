"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { OneBadValue } from "./steps-story";
import { CountCost, Incidents, FitForPurpose, GoodEnough, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "One bad value", Component: OneBadValue },
    { id: "cost", title: "What bad data costs", Component: CountCost },
    { id: "incidents", title: "It happens for real", Component: Incidents },
    { id: "fit", title: "Good enough for what?", Component: FitForPurpose },
    {
      id: "check",
      title: "Fit for purpose?",
      checkpoint: "fit-for-purpose",
      Component: GoodEnough,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
