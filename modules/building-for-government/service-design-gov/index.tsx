"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DesignState } from "./state";
import { Desk, Redesign, Standards, India, DesignCheck, Wrap } from "./steps";

export default defineModule<DesignState>({
  initialState,
  steps: [
    { id: "story", title: "Build the path people walk", Component: Desk },
    { id: "redesign", title: "Redesign the pension application", Component: Redesign },
    { id: "standards", title: "Service standards around the world", Component: Standards },
    { id: "india", title: "India's approach, and assisted access", Component: India },
    {
      id: "check",
      title: "Users first, or the office first?",
      checkpoint: "gov-service-design",
      Component: DesignCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
