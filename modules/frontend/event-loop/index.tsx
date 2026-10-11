"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LoopState } from "./state";
import { OneCook, StepThrough, LongTask, Tools, LoopCheck, Wrap } from "./steps";

export default defineModule<LoopState>({
  initialState,
  steps: [
    { id: "story", title: "A kitchen with one cook", Component: OneCook },
    { id: "step", title: "Predict, then step through the loop", Component: StepThrough },
    { id: "long", title: "Why a busy page ignores your click", Component: LongTask },
    { id: "tools", title: "Tools for keeping the main thread free", Component: Tools },
    {
      id: "check",
      title: "What runs first?",
      checkpoint: "frontend-event-loop",
      Component: LoopCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
