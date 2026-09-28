"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ToolsState } from "./state";
import { Configure, Rosetta, Tickets, Wrap } from "./steps";

export default defineModule<ToolsState>({
  initialState,
  steps: [
    { id: "tickets", title: "Same trip, different app", Component: Tickets },
    { id: "rosetta", title: "One board, six tools", Component: Rosetta },
    {
      id: "configure",
      title: "Configure or leave alone?",
      checkpoint: "tool-config",
      Component: Configure,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
