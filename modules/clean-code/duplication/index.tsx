"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DupState } from "./state";
import { Uniform, Life, Knowledge, WhenMerge, DupCheck, Wrap } from "./steps";

export default defineModule<DupState>({
  initialState,
  steps: [
    { id: "story", title: "One uniform for everyone", Component: Uniform },
    { id: "life", title: "The life of a shared function", Component: Life },
    { id: "knowledge", title: "DRY is about knowledge, not text", Component: Knowledge },
    { id: "when", title: "When to merge", Component: WhenMerge },
    { id: "check", title: "Merge or leave?", checkpoint: "clean-duplication", Component: DupCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
