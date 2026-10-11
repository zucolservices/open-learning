"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TouchState } from "./state";
import { Thumbs, Basket, Sizes, Gestures, TouchCheck, Wrap } from "./steps";

export default defineModule<TouchState>({
  initialState,
  steps: [
    { id: "story", title: "Buttons for thumbs", Component: Thumbs },
    { id: "basket", title: "Fix the basket screen", Component: Basket },
    { id: "sizes", title: "How big is big enough?", Component: Sizes },
    { id: "gestures", title: "Gestures and feedback", Component: Gestures },
    {
      id: "check",
      title: "Fine, or needs a fix?",
      checkpoint: "mobile-touch",
      Component: TouchCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
