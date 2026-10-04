"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type QualityState } from "./state";
import { MysteryShopper, SimCallers, Numbers, Recording, WhichNumber, Wrap } from "./steps";

export default defineModule<QualityState>({
  initialState,
  steps: [
    { id: "story", title: "Mystery shoppers", Component: MysteryShopper },
    { id: "sim", title: "Simulated callers", Component: SimCallers },
    { id: "numbers", title: "Numbers that match what callers feel", Component: Numbers },
    { id: "recording", title: "Recording, privacy and disclosure", Component: Recording },
    {
      id: "check",
      title: "Which number answers it?",
      checkpoint: "which-number",
      Component: WhichNumber,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
