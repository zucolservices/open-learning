"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AgentState } from "./state";
import { ThreeWays } from "./steps-story";
import { Dial, Definitions, MetAlready, AgentOrNot, Wrap } from "./steps";

export default defineModule<AgentState>({
  initialState,
  steps: [
    { id: "story", title: "Three ways to book a train", Component: ThreeWays },
    { id: "dial", title: "Autonomy is a dial", Component: Dial },
    { id: "definitions", title: "What people mean by agent", Component: Definitions },
    { id: "met", title: "Agents you may have met", Component: MetAlready },
    { id: "check", title: "Agent or not?", checkpoint: "agent-or-not", Component: AgentOrNot },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
