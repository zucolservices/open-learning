"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BatchState } from "./state";
import { BatchLab, Evidence, GroupProject, ReleaseFirst, Wrap, XpPractices } from "./steps";

export default defineModule<BatchState>({
  initialState,
  steps: [
    { id: "project", title: "The group project", Component: GroupProject },
    { id: "lab", title: "Batch-size lab", Component: BatchLab },
    {
      id: "first",
      title: "What to fix first?",
      checkpoint: "release-first",
      Component: ReleaseFirst,
    },
    { id: "xp", title: "Practices from XP", Component: XpPractices },
    {
      id: "evidence",
      title: "What the evidence says",
      checkpoint: "xp-evidence",
      Component: Evidence,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
