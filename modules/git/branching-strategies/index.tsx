"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StratState } from "./state";
import { Traffic, ThreeWays, Flags, Choosing, StratCheck, Wrap } from "./steps";

export default defineModule<StratState>({
  initialState,
  steps: [
    { id: "story", title: "Agreeing on the roads", Component: Traffic },
    { id: "three", title: "The same month, three ways", Component: ThreeWays },
    { id: "flags", title: "Merge now, switch on later", Component: Flags },
    { id: "choose", title: "Choosing for your team", Component: Choosing },
    {
      id: "check",
      title: "Which strategy fits?",
      checkpoint: "git-strategies",
      Component: StratCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
