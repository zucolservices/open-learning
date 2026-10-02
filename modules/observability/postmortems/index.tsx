"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PmState } from "./state";
import { BrokenVase, RewriteIt, NoRootCause, WhenToWrite, StrongOrWeak, Wrap } from "./steps";

export default defineModule<PmState>({
  initialState,
  steps: [
    { id: "vase", title: "The broken vase", Component: BrokenVase },
    { id: "rewrite", title: "Rewrite the report", Component: RewriteIt },
    { id: "cause", title: "One root cause?", Component: NoRootCause },
    { id: "when", title: "When to write one", Component: WhenToWrite },
    {
      id: "check",
      title: "Strong or weak action item?",
      checkpoint: "strong-or-weak",
      Component: StrongOrWeak,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
