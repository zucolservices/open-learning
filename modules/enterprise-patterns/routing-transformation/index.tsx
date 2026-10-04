"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RtState } from "./state";
import { SortingOffice, Pipeline, Canonical, MorePatterns, WhichPattern, Wrap } from "./steps";

export default defineModule<RtState>({
  initialState,
  steps: [
    { id: "story", title: "The sorting office", Component: SortingOffice },
    { id: "pipeline", title: "Build an order pipeline", Component: Pipeline },
    { id: "canonical", title: "One common format?", Component: Canonical },
    { id: "more", title: "More patterns", Component: MorePatterns },
    { id: "check", title: "Which pattern?", checkpoint: "which-pattern", Component: WhichPattern },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
