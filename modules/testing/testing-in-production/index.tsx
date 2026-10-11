"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ProdState } from "./state";
import { SoftOpening, Rollout, Techniques, AllAtOnce, ProdCheck, Wrap } from "./steps";

export default defineModule<ProdState>({
  initialState,
  steps: [
    { id: "story", title: "The soft opening", Component: SoftOpening },
    { id: "rollout", title: "Roll out a change, one step at a time", Component: Rollout },
    { id: "techniques", title: "Ways to test safely in production", Component: Techniques },
    { id: "once", title: "When everything ships at once", Component: AllAtOnce },
    {
      id: "check",
      title: "What would you do?",
      checkpoint: "testing-production",
      Component: ProdCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
