"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReflectState } from "./state";
import { Editor, AddCritic, Research, StopRules, Evidence, Wrap } from "./steps";

export default defineModule<ReflectState>({
  initialState,
  steps: [
    { id: "story", title: "Writer and editor", Component: Editor },
    { id: "critic", title: "Add a critic", Component: AddCritic },
    { id: "research", title: "What the research found", Component: Research },
    { id: "stop", title: "Loops that end", Component: StopRules },
    {
      id: "check",
      title: "Evidence or opinion?",
      checkpoint: "reflect-evidence",
      Component: Evidence,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
