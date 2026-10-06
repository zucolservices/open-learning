"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LifecycleState } from "./state";
import { Bakery, ChurnProject, SmallBox, WhereFail, PhaseOrder, Wrap } from "./steps";

export default defineModule<LifecycleState>({
  initialState,
  steps: [
    { id: "story", title: "Opening a bakery", Component: Bakery },
    { id: "project", title: "A churn project, start to finish", Component: ChurnProject },
    { id: "small-box", title: "The model is a small box", Component: SmallBox },
    { id: "fail", title: "Where projects stall", Component: WhereFail },
    {
      id: "check",
      title: "Put the phases in order",
      checkpoint: "phase-order",
      Component: PhaseOrder,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
