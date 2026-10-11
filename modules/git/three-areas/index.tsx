"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AreasState } from "./state";
import { Parcel, MoveChanges, WhyStage, WhereItLives, AreasCheck, Wrap } from "./steps";

export default defineModule<AreasState>({
  initialState,
  steps: [
    { id: "story", title: "Desk, packing list, post", Component: Parcel },
    { id: "move", title: "Move changes between the three areas", Component: MoveChanges },
    { id: "why", title: "Two commits from one messy afternoon", Component: WhyStage },
    { id: "disk", title: "Where each area lives on disk", Component: WhereItLives },
    {
      id: "check",
      title: "Where is the change now?",
      checkpoint: "git-areas",
      Component: AreasCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
