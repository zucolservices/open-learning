"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AiState } from "./state";
import { NewHire, Review, Evidence, Habits, AiCheck, Wrap } from "./steps";

export default defineModule<AiState>({
  initialState,
  steps: [
    { id: "story", title: "A fast, confident new cook", Component: NewHire },
    { id: "review", title: "Review four suggestions before accepting them", Component: Review },
    { id: "evidence", title: "What the studies say, so far", Component: Evidence },
    { id: "habits", title: "Habits for working with an assistant", Component: Habits },
    { id: "check", title: "Good habit or risk?", checkpoint: "clean-ai", Component: AiCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
