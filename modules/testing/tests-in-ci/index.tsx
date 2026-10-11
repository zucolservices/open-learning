"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CiState } from "./state";
import { Taster, SpeedUp, MainGreen, Evidence, CiCheck, Wrap } from "./steps";

export default defineModule<CiState>({
  initialState,
  steps: [
    { id: "story", title: "Feedback while you still remember", Component: Taster },
    { id: "speed", title: "Cut a 40-minute pipeline down", Component: SpeedUp },
    { id: "green", title: "Keeping the main branch green", Component: MainGreen },
    { id: "evidence", title: "Why it pays, and the tools", Component: Evidence },
    { id: "check", title: "Free win or trade-off?", checkpoint: "testing-ci", Component: CiCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
