"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PlatformState } from "./state";
import { Landscape, PickForTeam, PriceMonth, Wrap } from "./steps";

export default defineModule<PlatformState>({
  initialState,
  steps: [
    { id: "landscape", title: "The landscape", Component: Landscape },
    { id: "price", title: "Price a month of builds", Component: PriceMonth },
    {
      id: "check",
      title: "Pick for the team",
      checkpoint: "pick-for-team",
      Component: PickForTeam,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
