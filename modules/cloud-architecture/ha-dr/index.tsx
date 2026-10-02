"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DrState } from "./state";
import { FailRegion, Nines, Pick, ProveIt, Tyres, TwoNumbers, Wrap } from "./steps";

export default defineModule<DrState>({
  initialState,
  steps: [
    { id: "tyres", title: "No spare, spare tyre, run-flats", Component: Tyres },
    { id: "numbers", title: "Two numbers", Component: TwoNumbers },
    { id: "fail", title: "Fail a region", Component: FailRegion },
    { id: "nines", title: "Counting nines", Component: Nines },
    { id: "prove", title: "Prove it works", Component: ProveIt },
    { id: "pick", title: "Pick the strategy", checkpoint: "dr-strategy", Component: Pick },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
