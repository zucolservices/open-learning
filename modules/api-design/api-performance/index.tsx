"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PerfState } from "./state";
import { BestBefore, FiveFetches, Directives, LostUpdate, PickHeader, Wrap } from "./steps";

export default defineModule<PerfState>({
  initialState,
  steps: [
    { id: "best", title: "Best before", Component: BestBefore },
    { id: "fetches", title: "Five fetches", Component: FiveFetches },
    { id: "directives", title: "Saying how to cache", Component: Directives },
    { id: "lost", title: "The lost update", Component: LostUpdate },
    {
      id: "check",
      title: "Which Cache-Control?",
      checkpoint: "pick-header",
      Component: PickHeader,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
