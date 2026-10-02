"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StorageState } from "./state";
import { Lifecycle, ManagedDb, PlaceData, ThreeKinds, WhichStorage, Wrap } from "./steps";

export default defineModule<StorageState>({
  initialState,
  steps: [
    { id: "kinds", title: "Warehouse, drawer, cupboard", Component: ThreeKinds },
    { id: "place", title: "Place the department's data", Component: PlaceData },
    { id: "lifecycle", title: "Let files cool down", Component: Lifecycle },
    { id: "db", title: "Run the database, or rent it?", Component: ManagedDb },
    { id: "which", title: "Which storage?", checkpoint: "which-storage", Component: WhichStorage },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
