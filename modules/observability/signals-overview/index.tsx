"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SignalsState } from "./state";
import { JoinedUp, ThreeWays, WhatItCosts, WhichFirst, Wrap } from "./steps";

export default defineModule<SignalsState>({
  initialState,
  steps: [
    { id: "three", title: "One slow checkout, three ways", Component: ThreeWays },
    { id: "cost", title: "What each one costs", Component: WhatItCosts },
    { id: "joined", title: "Joined up, not three silos", Component: JoinedUp },
    {
      id: "check",
      title: "Which signal first?",
      checkpoint: "which-signal-first",
      Component: WhichFirst,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
