"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PlansState } from "./state";
import { TwoBuilds } from "./steps-story";
import { LearnEarly, PickApproach, RealCases, RiskyPlan, Wrap } from "./steps";

export default defineModule<PlansState>({
  initialState,
  steps: [
    { id: "two-builds", title: "Two buildings, two plans", Component: TwoBuilds },
    { id: "learn-early", title: "Learn early or learn late", Component: LearnEarly },
    { id: "cases", title: "When big launches go wrong", Component: RealCases },
    {
      id: "pick",
      title: "Plan up front, or in loops?",
      checkpoint: "plan-or-loop",
      Component: PickApproach,
    },
    { id: "risky", title: "A fixed 18-month plan", checkpoint: "risky-plan", Component: RiskyPlan },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
