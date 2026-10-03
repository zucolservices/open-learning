"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EngState } from "./state";
import { Vehicles, Matrix, HeapOrClustered, Managed, PickEngine, Wrap } from "./steps";

export default defineModule<EngState>({
  initialState,
  steps: [
    { id: "story", title: "Same job, different machines", Component: Vehicles },
    { id: "matrix", title: "Side by side", Component: Matrix },
    { id: "layout", title: "Heap or clustered?", Component: HeapOrClustered },
    { id: "cloud", title: "Managed in the cloud", Component: Managed },
    { id: "check", title: "Pick an engine", checkpoint: "pick-engine", Component: PickEngine },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
