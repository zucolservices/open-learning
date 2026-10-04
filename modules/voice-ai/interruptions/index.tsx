"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IntState } from "./state";
import { Dinner, CutIn, BargeIn, Mechanics, StopOrContinue, Wrap } from "./steps";

export default defineModule<IntState>({
  initialState,
  steps: [
    { id: "story", title: "Getting a word in", Component: Dinner },
    { id: "cut-in", title: "Interrupt the assistant", Component: CutIn },
    { id: "barge-in", title: "Barge-in, then and now", Component: BargeIn },
    { id: "mechanics", title: "How real-time systems handle it", Component: Mechanics },
    {
      id: "check",
      title: "Stop, or keep talking?",
      checkpoint: "stop-or-continue",
      Component: StopOrContinue,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
