"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SystemsState } from "./state";
import { Restaurant, RagTriad, AgentRun, PartsAndWhole, WhereBroke, Wrap } from "./steps";

export default defineModule<SystemsState>({
  initialState,
  steps: [
    { id: "story", title: "Inspecting a restaurant", Component: Restaurant },
    { id: "rag", title: "Evaluate a RAG answer", Component: RagTriad },
    { id: "agent", title: "Grade an agent run", Component: AgentRun },
    { id: "parts", title: "The parts and the whole", Component: PartsAndWhole },
    { id: "check", title: "Where did it break?", checkpoint: "where-broke", Component: WhereBroke },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
