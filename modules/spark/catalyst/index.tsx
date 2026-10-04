"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CatState } from "./state";
import { SatNav, StepCatalyst, RulesOff, ReadExplain, PhaseOrder, Wrap } from "./steps";

export default defineModule<CatState>({
  initialState,
  steps: [
    { id: "story", title: "The route planner", Component: SatNav },
    { id: "step", title: "Through the optimiser", Component: StepCatalyst },
    { id: "rules", title: "Switch the rules off", Component: RulesOff },
    { id: "explain", title: "Reading explain()", Component: ReadExplain },
    { id: "check", title: "In what order?", checkpoint: "catalyst-order", Component: PhaseOrder },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
