"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DepState } from "./state";
import { Moving, Decide, Images, Platforms, DepCheck, Wrap } from "./steps";

export default defineModule<DepState>({
  initialState,
  steps: [
    { id: "story", title: "Food trucks, restaurants and caterers", Component: Moving },
    { id: "decide", title: "Five deployment decisions", Component: Decide },
    { id: "images", title: "Building good images", Component: Images },
    { id: "platforms", title: "Limits and rollouts by platform", Component: Platforms },
    {
      id: "check",
      title: "A canary rollout, in order",
      checkpoint: "backend-deploying",
      Component: DepCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
