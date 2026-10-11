"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BranchState } from "./state";
import { Bookmarks, Playground, Cheap, MainOrMaster, BranchCheck, Wrap } from "./steps";

export default defineModule<BranchState>({
  initialState,
  steps: [
    { id: "story", title: "A bookmark, not a photocopy", Component: Bookmarks },
    { id: "play", title: "Branch playground", Component: Playground },
    { id: "cheap", title: "Why branching is cheap", Component: Cheap },
    { id: "main", title: "main or master?", Component: MainOrMaster },
    { id: "check", title: "True or false?", checkpoint: "git-branches", Component: BranchCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
