"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PerfState } from "./state";
import { Shutters, Profile, Starts, Frames, PerfCheck, Wrap } from "./steps";

export default defineModule<PerfState>({
  initialState,
  steps: [
    { id: "story", title: "Opening the shutters", Component: Shutters },
    { id: "profile", title: "Profile and fix the app", Component: Profile },
    { id: "starts", title: "Cold, warm and hot starts", Component: Starts },
    { id: "frames", title: "Frames, budgets and tools", Component: Frames },
    {
      id: "check",
      title: "Before or after the first frame?",
      checkpoint: "mobile-startup",
      Component: PerfCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
