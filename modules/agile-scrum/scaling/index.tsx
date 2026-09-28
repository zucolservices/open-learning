"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ScaleState } from "./state";
import { Conversations, Dependencies, FourFrameworks, MatchParts, Wrap } from "./steps";

export default defineModule<ScaleState>({
  initialState,
  steps: [
    { id: "conversations", title: "More people, more conversations", Component: Conversations },
    { id: "frameworks", title: "Four frameworks", Component: FourFrameworks },
    { id: "match", title: "Whose part is it?", checkpoint: "scale-match", Component: MatchParts },
    { id: "dependencies", title: "Remove, don't just manage", Component: Dependencies },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
