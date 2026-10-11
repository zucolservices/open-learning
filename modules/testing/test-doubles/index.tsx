"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DoublesState } from "./state";
import { StuntDouble, SwapDouble, FiveKinds, HowMuch, DoublesCheck, Wrap } from "./steps";

export default defineModule<DoublesState>({
  initialState,
  steps: [
    { id: "story", title: "The stunt double", Component: StuntDouble },
    { id: "swap", title: "Swap in a stand-in for the payment service", Component: SwapDouble },
    { id: "kinds", title: "Five kinds of stand-in", Component: FiveKinds },
    { id: "much", title: "How much should you fake?", Component: HowMuch },
    {
      id: "check",
      title: "Which stand-in?",
      checkpoint: "testing-doubles",
      Component: DoublesCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
