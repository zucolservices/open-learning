"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MergeState } from "./state";
import { TwoEditors, MergeShapes, LineByLine, Strategies, MergeCheck, Wrap } from "./steps";

export default defineModule<MergeState>({
  initialState,
  steps: [
    { id: "story", title: "Two editors, one original", Component: TwoEditors },
    { id: "shapes", title: "Merge specials into main", Component: MergeShapes },
    { id: "lines", title: "How a three-way merge decides", Component: LineByLine },
    { id: "strategies", title: "Merge strategies, briefly", Component: Strategies },
    {
      id: "check",
      title: "What will git merge do?",
      checkpoint: "git-merging",
      Component: MergeCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
