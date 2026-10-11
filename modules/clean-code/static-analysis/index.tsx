"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StaticState } from "./state";
import { Proofreader, Triage, Kinds, Noise, StaticCheck, Wrap } from "./steps";

export default defineModule<StaticState>({
  initialState,
  steps: [
    { id: "story", title: "A proofreader who never gets tired", Component: Proofreader },
    { id: "triage", title: "Triage the findings on a pull request", Component: Triage },
    { id: "kinds", title: "Three kinds of tool", Component: Kinds },
    { id: "noise", title: "Keeping the signal high", Component: Noise },
    {
      id: "check",
      title: "Which tool catches it?",
      checkpoint: "clean-static",
      Component: StaticCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
