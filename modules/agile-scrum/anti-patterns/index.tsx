"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AntiState } from "./state";
import { Clinic, HealthyOrNot, Targets, Wrap } from "./steps";

export default defineModule<AntiState>({
  initialState,
  steps: [
    { id: "targets", title: "Teaching to the test", Component: Targets },
    { id: "clinic", title: "The symptom clinic", Component: Clinic },
    {
      id: "healthy",
      title: "Healthy or anti-pattern?",
      checkpoint: "healthy-or-not",
      Component: HealthyOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
