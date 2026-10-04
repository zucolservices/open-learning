"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ConwayState } from "./state";
import { Committees, Reorganise, Topologies, Evidence, WhichType, Wrap } from "./steps";

export default defineModule<ConwayState>({
  initialState,
  steps: [
    { id: "story", title: "How do committees invent?", Component: Committees },
    { id: "reorg", title: "Reorganise the teams", Component: Reorganise },
    { id: "topologies", title: "Four team types", Component: Topologies },
    { id: "evidence", title: "Evidence and caution", Component: Evidence },
    {
      id: "check",
      title: "Which kind of team?",
      checkpoint: "which-team-type",
      Component: WhichType,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
