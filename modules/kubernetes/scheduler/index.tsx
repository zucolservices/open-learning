"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SchedState } from "./state";
import { BeScheduler, MoreLevers, Seating, SpreadZones, WhichTool, Wrap } from "./steps";

export default defineModule<SchedState>({
  initialState,
  steps: [
    { id: "seating", title: "Seating wedding guests", Component: Seating },
    { id: "be", title: "Be the scheduler", Component: BeScheduler },
    { id: "spread", title: "Spread across zones", Component: SpreadZones },
    { id: "levers", title: "More levers", Component: MoreLevers },
    {
      id: "check",
      title: "Which tool?",
      checkpoint: "which-scheduling-tool",
      Component: WhichTool,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
