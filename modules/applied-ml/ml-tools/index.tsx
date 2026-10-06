"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ToolsState } from "./state";
import { Workshop, Lifecycle, Stacks, ComeAndGo, ToolJob, Wrap } from "./steps";

export default defineModule<ToolsState>({
  initialState,
  steps: [
    { id: "story", title: "A workshop, not a single tool", Component: Workshop },
    { id: "lifecycle", title: "Tools along the lifecycle", Component: Lifecycle },
    { id: "stacks", title: "Three starter stacks", Component: Stacks },
    { id: "change", title: "Tools come and go", Component: ComeAndGo },
    { id: "check", title: "Which job does it do?", checkpoint: "tool-job", Component: ToolJob },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
