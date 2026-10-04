"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HitlState } from "./state";
import { Autopilot, Expenses, Roles, Handover, AskOrAct, Wrap } from "./steps";

export default defineModule<HitlState>({
  initialState,
  steps: [
    { id: "story", title: "The autopilot", Component: Autopilot },
    { id: "expenses", title: "A month of expense claims", Component: Expenses },
    { id: "roles", title: "Levels of autonomy", Component: Roles },
    { id: "handover", title: "Designing the handover", Component: Handover },
    { id: "check", title: "Ask a person, or act?", checkpoint: "ask-or-act", Component: AskOrAct },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
