"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SemState } from "./state";
import { Signs, FixPage, Headings, Common, SemCheck, Wrap } from "./steps";

export default defineModule<SemState>({
  initialState,
  steps: [
    { id: "story", title: "A building with no signs", Component: Signs },
    { id: "fix", title: "Give every box the right element", Component: FixPage },
    { id: "headings", title: "Headings and landmarks: the rules", Component: Headings },
    { id: "common", title: "How common are these mistakes?", Component: Common },
    {
      id: "check",
      title: "The clickable box",
      checkpoint: "frontend-semantic",
      Component: SemCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
