"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EsState } from "./state";
import { LongWall, StormIt, Legend, Formats, WhichSticky, Wrap } from "./steps";

export default defineModule<EsState>({
  initialState,
  steps: [
    { id: "story", title: "A long wall and orange notes", Component: LongWall },
    { id: "storm", title: "Storm a home loan", Component: StormIt },
    { id: "legend", title: "The colour code", Component: Legend },
    { id: "formats", title: "Three formats", Component: Formats },
    { id: "check", title: "Which sticky?", checkpoint: "which-sticky", Component: WhichSticky },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
