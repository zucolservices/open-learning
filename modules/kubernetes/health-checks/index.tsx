"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HealthState } from "./state";
import { FixLoop, ThreeQuestions, WhichProbe, WritingProbe, Wrap } from "./steps";

export default defineModule<HealthState>({
  initialState,
  steps: [
    { id: "questions", title: "Alive, ready, still training", Component: ThreeQuestions },
    { id: "fix", title: "Fix the restart loop", Component: FixLoop },
    { id: "write", title: "Writing a probe", Component: WritingProbe },
    { id: "check", title: "Which probe?", checkpoint: "which-probe", Component: WhichProbe },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
