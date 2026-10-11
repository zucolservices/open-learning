"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ResState } from "./state";
import { Fuse, Simulate, Advice, Libraries, ResCheck, Wrap } from "./steps";

export default defineModule<ResState>({
  initialState,
  steps: [
    { id: "story", title: "The fuse box", Component: Fuse },
    { id: "simulate", title: "The payment provider is crawling", Component: Simulate },
    { id: "advice", title: "Hard-won advice from AWS", Component: Advice },
    { id: "libraries", title: "Libraries that do this for you", Component: Libraries },
    {
      id: "check",
      title: "Helps or hurts?",
      checkpoint: "backend-resilience",
      Component: ResCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
