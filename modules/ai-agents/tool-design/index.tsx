"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ToolState } from "./state";
import { NewHire, FixTools, Anatomy, MistakeProof, GoodOrBad, Wrap } from "./steps";

export default defineModule<ToolState>({
  initialState,
  steps: [
    { id: "story", title: "Instructions for a new starter", Component: NewHire },
    { id: "fix", title: "Fix three bad tools, and a fourth", Component: FixTools },
    { id: "anatomy", title: "Anatomy of a tool", Component: Anatomy },
    { id: "mistake-proof", title: "Make mistakes impossible", Component: MistakeProof },
    { id: "check", title: "Good design or bad?", checkpoint: "tool-design", Component: GoodOrBad },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
