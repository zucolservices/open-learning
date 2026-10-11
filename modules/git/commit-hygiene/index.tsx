"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HygieneState } from "./state";
import { LabBook, CleanUp, Anatomy, Conventional, HygieneCheck, Wrap } from "./steps";

export default defineModule<HygieneState>({
  initialState,
  steps: [
    { id: "story", title: "A lab notebook someone else can read", Component: LabBook },
    { id: "clean", title: "Clean up a messy branch", Component: CleanUp },
    { id: "anatomy", title: "Anatomy of a good message", Component: Anatomy },
    { id: "conventional", title: "Messages tools can read", Component: Conventional },
    {
      id: "check",
      title: "Good message or not?",
      checkpoint: "git-hygiene",
      Component: HygieneCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
