"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CloneState } from "./state";
import { Impressionist, Requests, Harms, Safeguards, PreventOrTrace, Wrap } from "./steps";

export default defineModule<CloneState>({
  initialState,
  steps: [
    { id: "story", title: "The perfect impression", Component: Impressionist },
    { id: "requests", title: "Six cloning requests", Component: Requests },
    { id: "harms", title: "When cloning goes wrong", Component: Harms },
    { id: "safeguards", title: "Safeguards and the law", Component: Safeguards },
    {
      id: "check",
      title: "Prevent or trace?",
      checkpoint: "prevent-trace",
      Component: PreventOrTrace,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
