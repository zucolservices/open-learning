"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReadState } from "./state";
import { TownMap, ReadOrder, Position, Strategy, ReadCheck, Wrap } from "./steps";

export default defineModule<ReadState>({
  initialState,
  steps: [
    { id: "story", title: "Look at the map before the streets", Component: TownMap },
    { id: "order", title: "Choose the order you read the files", Component: ReadOrder },
    { id: "position", title: "File order changes what gets found", Component: Position },
    { id: "strategy", title: "A reading strategy", Component: Strategy },
    { id: "check", title: "Plan your reading", checkpoint: "review-reading", Component: ReadCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
