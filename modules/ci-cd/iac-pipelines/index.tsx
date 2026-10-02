"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IacState } from "./state";
import { AutoOrCareful, EveryTool, InfraPipeline, ReviewPlan, Wrap } from "./steps";

export default defineModule<IacState>({
  initialState,
  steps: [
    { id: "review", title: "Review the plan", Component: ReviewPlan },
    { id: "pipeline", title: "The infrastructure pipeline", Component: InfraPipeline },
    { id: "tools", title: "Every tool has a preview", Component: EveryTool },
    {
      id: "check",
      title: "Routine or risky?",
      checkpoint: "routine-or-risky",
      Component: AutoOrCareful,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
