"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ObsState } from "./state";
import { ErrorBudget, ThreeWays, Tools, Waterfall, WhichSignal, Wrap } from "./steps";

export default defineModule<ObsState>({
  initialState,
  steps: [
    { id: "three", title: "Three ways to see", Component: ThreeWays },
    { id: "trace", title: "Follow one request", Component: Waterfall },
    { id: "which", title: "Which signal?", checkpoint: "which-signal", Component: WhichSignal },
    { id: "budget", title: "Spend the error budget", Component: ErrorBudget },
    { id: "tools", title: "Observability tools", Component: Tools },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
