"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CrashState } from "./state";
import { Kitchen, Triage, Health, Ratings, CrashCheck, Wrap } from "./steps";

export default defineModule<CrashState>({
  initialState,
  steps: [
    { id: "story", title: "The comment cards", Component: Kitchen },
    { id: "triage", title: "Triage the new release", Component: Triage },
    { id: "health", title: "Measuring app health", Component: Health },
    { id: "ratings", title: "Ratings and respectful analytics", Component: Ratings },
    {
      id: "check",
      title: "When to ask for a rating",
      checkpoint: "mobile-rating",
      Component: CrashCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
