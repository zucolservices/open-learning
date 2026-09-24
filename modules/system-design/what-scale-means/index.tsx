"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ScaleState } from "./state";
import { Growth } from "./steps-story";
import { FirstMove, GrowthOrder, KindsOfScale, UpOrOut, Wrap } from "./steps-more";

export default defineModule<ScaleState>({
  initialState,
  steps: [
    { id: "growth", title: "From 100 users to 100 million", Component: Growth },
    { id: "up-or-out", title: "Up or out?", Component: UpOrOut },
    { id: "order", title: "What comes next?", checkpoint: "growth-order", Component: GrowthOrder },
    {
      id: "kinds",
      title: "Three kinds of scale",
      checkpoint: "kinds-of-scale",
      Component: KindsOfScale,
    },
    {
      id: "first-move",
      title: "Measure before you shard",
      checkpoint: "first-move",
      Component: FirstMove,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
