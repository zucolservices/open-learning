"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LoopState } from "./state";
import { Detective, OneRun, ReAct, Stopping, LoopOrder, Wrap } from "./steps";

export default defineModule<LoopState>({
  initialState,
  steps: [
    { id: "story", title: "How a detective works", Component: Detective },
    { id: "run", title: "One run, turn by turn", Component: OneRun },
    { id: "react", title: "Where the loop came from", Component: ReAct },
    { id: "stopping", title: "Knowing when to stop", Component: Stopping },
    { id: "check", title: "Put the loop in order", checkpoint: "loop-order", Component: LoopOrder },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
