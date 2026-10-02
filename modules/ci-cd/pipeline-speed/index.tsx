"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SpeedState } from "./state";
import { Diminishing, UnderTen, WhereToStart, WhileYouWait, Wrap } from "./steps";

export default defineModule<SpeedState>({
  initialState,
  steps: [
    { id: "wait", title: "While you wait", Component: WhileYouWait },
    { id: "ten", title: "From 45 minutes to under 10", Component: UnderTen },
    { id: "returns", title: "Diminishing returns", Component: Diminishing },
    { id: "check", title: "Where to start", checkpoint: "where-to-start", Component: WhereToStart },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
