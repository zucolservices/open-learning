"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FlowState } from "./state";
import { Ticket, Journey, Platforms, Stalls, FlowCheck, Wrap } from "./steps";

export default defineModule<FlowState>({
  initialState,
  steps: [
    { id: "story", title: "An order ticket's journey", Component: Ticket },
    { id: "journey", title: "Follow a pull request from draft to merged", Component: Journey },
    { id: "platforms", title: "Same flow, different words", Component: Platforms },
    { id: "stalls", title: "Where reviews stall", Component: Stalls },
    {
      id: "check",
      title: "Put the flow in order",
      checkpoint: "review-flow",
      Component: FlowCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
