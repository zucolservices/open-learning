"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SlaState } from "./state";
import { Bakery, Budget, Ladder, Pipelines, WhichOne, Wrap } from "./steps";

export default defineModule<SlaState>({
  initialState,
  steps: [
    { id: "story", title: "The bakery's promise", Component: Bakery },
    { id: "budget", title: "A bad month", Component: Budget },
    { id: "ladder", title: "SLI, SLO, SLA", Component: Ladder },
    { id: "pipelines", title: "Service levels for pipelines", Component: Pipelines },
    {
      id: "check",
      title: "Indicator, objective or agreement?",
      checkpoint: "sli-slo-sla",
      Component: WhichOne,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
