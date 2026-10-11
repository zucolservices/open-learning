"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PrState } from "./state";
import { Proposal, Journey, MergeButtons, Platforms, PrCheck, Wrap } from "./steps";

export default defineModule<PrState>({
  initialState,
  steps: [
    { id: "story", title: "“Can we add this to the menu?”", Component: Proposal },
    { id: "journey", title: "From branch to merged", Component: Journey },
    { id: "buttons", title: "Three ways to press 'merge'", Component: MergeButtons },
    { id: "platforms", title: "Same idea, different names", Component: Platforms },
    {
      id: "check",
      title: "Git, or the platform?",
      checkpoint: "git-pull-requests",
      Component: PrCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
