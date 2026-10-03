"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WalState } from "./state";
import { DayBook, PullPlug, Checkpoints, Tradeoffs, AfterRestart, Wrap } from "./steps";

export default defineModule<WalState>({
  initialState,
  steps: [
    { id: "daybook", title: "The shop's day book", Component: DayBook },
    { id: "plug", title: "Pull the plug", Component: PullPlug },
    { id: "checkpoints", title: "Checkpoints and torn pages", Component: Checkpoints },
    { id: "trade", title: "Speed versus safety", Component: Tradeoffs },
    {
      id: "check",
      title: "After the restart",
      checkpoint: "after-restart",
      Component: AfterRestart,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
