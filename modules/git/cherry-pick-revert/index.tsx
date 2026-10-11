"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PickState } from "./state";
import { Recipe, HotfixAndUndo, RevertOrReset, WhenToPick, PickCheck, Wrap } from "./steps";

export default defineModule<PickState>({
  initialState,
  steps: [
    { id: "story", title: "Copy one recipe, cross out another", Component: Recipe },
    { id: "hotfix", title: "A hotfix and an undo", Component: HotfixAndUndo },
    { id: "which", title: "The bad commit is already pushed. Now what?", Component: RevertOrReset },
    { id: "when", title: "Good and bad reasons to cherry-pick", Component: WhenToPick },
    {
      id: "check",
      title: "Cherry-pick or revert?",
      checkpoint: "git-cherry-revert",
      Component: PickCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
