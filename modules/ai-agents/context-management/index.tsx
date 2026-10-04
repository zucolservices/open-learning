"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CtxState } from "./state";
import { Desk, LongTask, Rot, Techniques, WhichTechnique, Wrap } from "./steps";

export default defineModule<CtxState>({
  initialState,
  steps: [
    { id: "story", title: "A small desk", Component: Desk },
    { id: "long", title: "A 200-step task", Component: LongTask },
    { id: "rot", title: "Bigger isn't better", Component: Rot },
    { id: "techniques", title: "Four ways to keep going", Component: Techniques },
    {
      id: "check",
      title: "Which technique?",
      checkpoint: "context-technique",
      Component: WhichTechnique,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
