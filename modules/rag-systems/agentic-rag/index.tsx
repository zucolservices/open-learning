"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AgentState } from "./state";
import {
  Budgets,
  ClerkAndAssistant,
  HowAgentWorks,
  Mcp,
  SmallModelTries,
  WhenAgent,
  Wrap,
} from "./steps";

export default defineModule<AgentState>({
  initialState,
  steps: [
    { id: "clerk", title: "The clerk and the assistant", Component: ClerkAndAssistant },
    { id: "how", title: "How an agent works", Component: HowAgentWorks },
    { id: "tries", title: "A small model tries", Component: SmallModelTries },
    { id: "budgets", title: "Budgets and stopping", Component: Budgets },
    { id: "mcp", title: "MCP: one plug for many tools", Component: Mcp },
    {
      id: "when",
      title: "Agent or single search?",
      checkpoint: "agent-or-not",
      Component: WhenAgent,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
