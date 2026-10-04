"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StreamState } from "./state";
import { Ledger, MicroBatches, Triggers, Checkpoints, WhichTrigger, Wrap } from "./steps";

export default defineModule<StreamState>({
  initialState,
  steps: [
    { id: "story", title: "A ledger that never closes", Component: Ledger },
    { id: "sim", title: "Micro-batches and watermarks", Component: MicroBatches },
    { id: "triggers", title: "Triggers and modes", Component: Triggers },
    { id: "checkpoints", title: "Checkpoints and state", Component: Checkpoints },
    { id: "check", title: "Which trigger?", checkpoint: "which-trigger", Component: WhichTrigger },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
