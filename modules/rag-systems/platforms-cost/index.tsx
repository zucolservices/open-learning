"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CostState } from "./state";
import { Calculator, HomeOrRestaurant, India, LongContext, PickStack, TheMap, Wrap } from "./steps";

export default defineModule<CostState>({
  initialState,
  steps: [
    { id: "kitchen", title: "Cook, kit or restaurant", Component: HomeOrRestaurant },
    { id: "map", title: "The map", Component: TheMap },
    { id: "cost", title: "What it costs", Component: Calculator },
    { id: "long", title: "Just paste everything?", Component: LongContext },
    { id: "india", title: "Keeping data in India", Component: India },
    { id: "pick", title: "Pick a stack", checkpoint: "pick-stack", Component: PickStack },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
