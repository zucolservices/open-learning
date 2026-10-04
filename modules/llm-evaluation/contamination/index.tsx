"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ContamState } from "./state";
import { LeakedPaper, FindLeaks, Defences, Gaming, WhichLeak, Wrap } from "./steps";

export default defineModule<ContamState>({
  initialState,
  steps: [
    { id: "story", title: "The leaked exam paper", Component: LeakedPaper },
    { id: "find", title: "Find the leaked questions", Component: FindLeaks },
    { id: "defences", title: "Detecting and preventing leaks", Component: Defences },
    { id: "gaming", title: "Gaming without a leak", Component: Gaming },
    { id: "check", title: "What kind of problem?", checkpoint: "which-leak", Component: WhichLeak },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
