"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SafetyState } from "./state";
import { TwoTeams } from "./steps-story";
import { Habits, Research, Zones, SafetyCheck, Wrap } from "./steps";

export default defineModule<SafetyState>({
  initialState,
  steps: [
    { id: "story", title: "The question nobody asked", Component: TwoTeams },
    { id: "habits", title: "Who speaks up in the next review?", Component: Habits },
    { id: "research", title: "Tone and power in review", Component: Research },
    { id: "zones", title: "Safety and standards together", Component: Zones },
    {
      id: "check",
      title: "Builds or erodes?",
      checkpoint: "review-safety",
      Component: SafetyCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
