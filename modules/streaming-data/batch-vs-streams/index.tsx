"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BvsState } from "./state";
import { PaymentStory } from "./steps-story";
import { History, Ladder, RunEvery, SortWork, Wrap } from "./steps";

export default defineModule<BvsState>({
  initialState,
  steps: [
    { id: "story", title: "A payment at 11:42 pm", Component: PaymentStory },
    { id: "cadence", title: "How often do you look?", Component: RunEvery },
    { id: "ladder", title: "The latency ladder", Component: Ladder },
    { id: "history", title: "How we got here", Component: History },
    { id: "sort", title: "Batch or stream?", checkpoint: "batch-or-stream", Component: SortWork },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
