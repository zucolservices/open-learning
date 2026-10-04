"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type NoState } from "./state";
import { Lunchbox, ThreeShapes, EmbedOrRef, SingleTable, EmbedSort, Wrap } from "./steps";

export default defineModule<NoState>({
  initialState,
  steps: [
    { id: "story", title: "Pack for the trip you're taking", Component: Lunchbox },
    { id: "sim", title: "One dataset, three shapes", Component: ThreeShapes },
    { id: "embed", title: "Embed or reference?", Component: EmbedOrRef },
    { id: "single", title: "Single-table design", Component: SingleTable },
    {
      id: "check",
      title: "Embed or reference: you decide",
      checkpoint: "embed-or-ref",
      Component: EmbedSort,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
