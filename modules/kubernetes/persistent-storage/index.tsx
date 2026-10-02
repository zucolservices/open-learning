"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StoreState } from "./state";
import { ClaimSteps, MoveDb, WhereKeep, WhichStorage, Wrap } from "./steps";

export default defineModule<StoreState>({
  initialState,
  steps: [
    { id: "keep", title: "Where do you keep your things?", Component: WhereKeep },
    { id: "move", title: "Move the database", Component: MoveDb },
    { id: "claim", title: "Claim, provision, attach", Component: ClaimSteps },
    { id: "check", title: "Which storage?", checkpoint: "which-storage", Component: WhichStorage },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
