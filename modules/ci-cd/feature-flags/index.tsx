"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FlagState } from "./state";
import { FlagDebt, FourKinds, RollOut, WhichKind, Wrap } from "./steps";

export default defineModule<FlagState>({
  initialState,
  steps: [
    { id: "rollout", title: "Roll it out, then switch it off", Component: RollOut },
    { id: "kinds", title: "Four kinds of flag", Component: FourKinds },
    { id: "debt", title: "Flag debt", Component: FlagDebt },
    {
      id: "check",
      title: "Which kind is it?",
      checkpoint: "which-flag-kind",
      Component: WhichKind,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
