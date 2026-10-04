"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SttState } from "./state";
import { Stenographer, ScoreIt, Streaming, HowItWorks, ComputeWer, Wrap } from "./steps";

export default defineModule<SttState>({
  initialState,
  steps: [
    { id: "story", title: "The court stenographer", Component: Stenographer },
    { id: "score", title: "Score a transcript", Component: ScoreIt },
    { id: "streaming", title: "Words as you speak", Component: Streaming },
    { id: "how", title: "How recognisers learn", Component: HowItWorks },
    { id: "check", title: "Work out the WER", checkpoint: "compute-wer", Component: ComputeWer },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
