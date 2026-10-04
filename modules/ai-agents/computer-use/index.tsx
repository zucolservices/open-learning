"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HandsState } from "./state";
import { Errand, FourHands, Flipbook, Sandboxes, WhichHand, Wrap } from "./steps";

export default defineModule<HandsState>({
  initialState,
  steps: [
    { id: "story", title: "Doing the errand yourself", Component: Errand },
    { id: "hands", title: "One task, four ways", Component: FourHands },
    { id: "flipbook", title: "How computer use sees", Component: Flipbook },
    { id: "sandboxes", title: "Sandboxes and code", Component: Sandboxes },
    { id: "check", title: "Which way to act?", checkpoint: "which-hand", Component: WhichHand },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
