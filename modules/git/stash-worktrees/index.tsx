"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StashState } from "./state";
import { Interrupted, TwoWays, StashDetails, WhichToUse, StashCheck, Wrap } from "./steps";

export default defineModule<StashState>({
  initialState,
  steps: [
    { id: "story", title: "Interrupted mid-recipe", Component: Interrupted },
    { id: "ways", title: "Handle the interruption", Component: TwoWays },
    { id: "stash", title: "Stash, in a little more detail", Component: StashDetails },
    { id: "which", title: "Stash, worktree, or just commit?", Component: WhichToUse },
    {
      id: "check",
      title: "Stash or worktree?",
      checkpoint: "git-stash-worktree",
      Component: StashCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
