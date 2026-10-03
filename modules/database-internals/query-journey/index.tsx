"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type QjState } from "./state";
import { OneQuery } from "./steps-story";
import { TryIt, WhoIsWho, Popular, StageOrder, Wrap } from "./steps";

export default defineModule<QjState>({
  initialState,
  steps: [
    { id: "story", title: "One query", Component: OneQuery },
    { id: "try", title: "Same query, four ways", Component: TryIt },
    { id: "who", title: "Processes, threads and files", Component: WhoIsWho },
    { id: "popular", title: "Which databases?", Component: Popular },
    { id: "check", title: "In what order?", checkpoint: "stage-order", Component: StageOrder },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
