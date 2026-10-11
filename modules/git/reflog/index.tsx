"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReflogState } from "./state";
import { Footsteps, LoseAndFind, DeletedBranch, Limits, ReflogCheck, Wrap } from "./steps";

export default defineModule<ReflogState>({
  initialState,
  steps: [
    { id: "story", title: "Footprints in the snow", Component: Footsteps },
    { id: "rescue", title: "Lose two commits, then get them back", Component: LoseAndFind },
    { id: "branch", title: "The branch you deleted too soon", Component: DeletedBranch },
    { id: "limits", title: "What the reflog can't save", Component: Limits },
    {
      id: "check",
      title: "Can you get it back?",
      checkpoint: "git-reflog",
      Component: ReflogCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
