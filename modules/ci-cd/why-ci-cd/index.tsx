"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { ReleaseWeekend } from "./steps-story";
import { BatchSize, SaferRiskier, ThreePhrases, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "The release weekend", Component: ReleaseWeekend },
    { id: "batch", title: "Same work, different batches", Component: BatchSize },
    { id: "phrases", title: "Three phrases, one idea", Component: ThreePhrases },
    {
      id: "check",
      title: "Safer or riskier?",
      checkpoint: "safer-riskier",
      Component: SaferRiskier,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
