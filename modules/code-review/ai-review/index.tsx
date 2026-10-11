"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AiState } from "./state";
import { Intern, Triage, Landscape, Evidence, AiCheck, Wrap } from "./steps";

export default defineModule<AiState>({
  initialState,
  steps: [
    { id: "story", title: "The brilliant new intern", Component: Intern },
    { id: "triage", title: "Triage an AI review", Component: Triage },
    { id: "landscape", title: "AI reviewers in 2026", Component: Landscape },
    { id: "evidence", title: "What the studies say so far", Component: Evidence },
    { id: "check", title: "Good use or risky use?", checkpoint: "review-ai", Component: AiCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
