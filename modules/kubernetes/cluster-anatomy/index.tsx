"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AnatomyState } from "./state";
import { FollowApply, Kitchen, WhichComponent, WhoDoesWhat, Wrap } from "./steps";

export default defineModule<AnatomyState>({
  initialState,
  steps: [
    { id: "kitchen", title: "A restaurant kitchen", Component: Kitchen },
    { id: "apply", title: "Follow one kubectl apply", Component: FollowApply },
    { id: "parts", title: "Who does what", Component: WhoDoesWhat },
    {
      id: "check",
      title: "Which component?",
      checkpoint: "which-component",
      Component: WhichComponent,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
