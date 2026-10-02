"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GoldenState } from "./state";
import { FourNumbers, RedUse, SymptomOrCause, ThreeSick, Wrap } from "./steps";

export default defineModule<GoldenState>({
  initialState,
  steps: [
    { id: "four", title: "Four numbers", Component: FourNumbers },
    { id: "sick", title: "Three sick services", Component: ThreeSick },
    { id: "reduse", title: "RED for services, USE for resources", Component: RedUse },
    {
      id: "check",
      title: "Symptom or cause?",
      checkpoint: "symptom-or-cause",
      Component: SymptomOrCause,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
