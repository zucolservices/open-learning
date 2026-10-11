"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ChoosingState } from "./state";
import { Lift, BugHunt, Paths, Boundaries, ChoosingCheck, Wrap } from "./steps";

export default defineModule<ChoosingState>({
  initialState,
  steps: [
    { id: "story", title: "Testing a lift without riding it forever", Component: Lift },
    { id: "hunt", title: "Hunt the bug with as few tests as possible", Component: BugHunt },
    { id: "paths", title: "Happy, edge and sad paths", Component: Paths },
    { id: "boundaries", title: "Two values or three?", Component: Boundaries },
    {
      id: "check",
      title: "Pick the best three tests",
      checkpoint: "testing-choosing",
      Component: ChoosingCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
