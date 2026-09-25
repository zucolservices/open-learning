"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type InjectState } from "./state";
import { BreakALeg, OneStream, Sandbox, Trifecta, Varieties, Wrap } from "./steps";

export default defineModule<InjectState>({
  initialState,
  steps: [
    { id: "why", title: "Why it happens", Component: OneStream },
    { id: "sandbox", title: "Attack the assistant, then defend it", Component: Sandbox },
    { id: "trifecta", title: "The lethal trifecta", Component: Trifecta },
    {
      id: "break",
      title: "Which fix removes the risk?",
      checkpoint: "break-leg",
      Component: BreakALeg,
    },
    {
      id: "varieties",
      title: "What could go wrong?",
      checkpoint: "varieties",
      Component: Varieties,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
