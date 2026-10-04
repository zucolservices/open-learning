"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReconState } from "./state";
import { Till, Reconcile, Bisect, Tools, WhichCheck, Wrap } from "./steps";

export default defineModule<ReconState>({
  initialState,
  steps: [
    { id: "story", title: "Cashing up the till", Component: Till },
    { id: "reconcile", title: "Reconcile a copy", Component: Reconcile },
    { id: "bisect", title: "Finding the needle", Component: Bisect },
    { id: "tools", title: "Tools and tolerances", Component: Tools },
    {
      id: "check",
      title: "Which check catches it?",
      checkpoint: "which-check",
      Component: WhichCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
