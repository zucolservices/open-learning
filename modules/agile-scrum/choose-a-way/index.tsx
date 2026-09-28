"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WayState } from "./state";
import { FourTeams, Kitchens, WayMyths, Wrap } from "./steps";

export default defineModule<WayState>({
  initialState,
  steps: [
    { id: "kitchens", title: "A banquet or a café?", Component: Kitchens },
    { id: "teams", title: "Four teams, four choices", Component: FourTeams },
    { id: "myths", title: "Scrum, Kanban and myths", checkpoint: "way-myths", Component: WayMyths },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
