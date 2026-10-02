"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IndiaState } from "./state";
import { Allowed, CheckDesign, Courier, Regions, Rules, Wrap } from "./steps";

export default defineModule<IndiaState>({
  initialState,
  steps: [
    { id: "courier", title: "An approved courier", Component: Courier },
    { id: "regions", title: "Clouds in India", Component: Regions },
    { id: "check", title: "Check the design", Component: CheckDesign },
    { id: "rules", title: "Which rules apply?", Component: Rules },
    { id: "allowed", title: "Allowed or not?", checkpoint: "india-allowed", Component: Allowed },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
