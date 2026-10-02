"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SloState } from "./state";
import { MeasurablePromise, Nines, PickIndicator, WhichTerm, Wrap } from "./steps";

export default defineModule<SloState>({
  initialState,
  steps: [
    { id: "promise", title: "A promise you can measure", Component: MeasurablePromise },
    { id: "pick", title: "Pick the indicator", Component: PickIndicator },
    { id: "nines", title: "What the nines allow", Component: Nines },
    { id: "check", title: "SLI, SLO or SLA?", checkpoint: "sli-slo-sla", Component: WhichTerm },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
