"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReleaseState } from "./state";
import { AllAtOnce, FiveWays, HowBig, WhichTool, Wrap } from "./steps";

export default defineModule<ReleaseState>({
  initialState,
  steps: [
    { id: "five", title: "A bad release, five ways", Component: FiveWays },
    { id: "canary", title: "How big a canary?", Component: HowBig },
    { id: "incidents", title: "When everyone got it at once", Component: AllAtOnce },
    {
      id: "check",
      title: "Which tool for the job?",
      checkpoint: "which-release-tool",
      Component: WhichTool,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
