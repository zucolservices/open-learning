"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StarState } from "./state";
import { Receipt, SliceStar, WhyStars, History, FactOrDim, Wrap } from "./steps";

export default defineModule<StarState>({
  initialState,
  steps: [
    { id: "story", title: "The receipt", Component: Receipt },
    { id: "slice", title: "Slice the star", Component: SliceStar },
    { id: "why", title: "Why a star?", Component: WhyStars },
    { id: "history", title: "Who came up with it?", Component: History },
    { id: "check", title: "Fact or dimension?", checkpoint: "fact-or-dim", Component: FactOrDim },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
