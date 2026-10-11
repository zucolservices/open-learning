"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type JsState } from "./state";
import { Suitcase, Shrink, Bundlers, Cost, JsCheck, Wrap } from "./steps";

export default defineModule<JsState>({
  initialState,
  steps: [
    { id: "story", title: "Packing for a weekend", Component: Suitcase },
    { id: "shrink", title: "Shrink the first-load bundle", Component: Shrink },
    { id: "bundlers", title: "Today's bundlers", Component: Bundlers },
    { id: "cost", title: "Why JavaScript costs more than images", Component: Cost },
    {
      id: "check",
      title: "Lighter or heavier?",
      checkpoint: "frontend-js-size",
      Component: JsCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
