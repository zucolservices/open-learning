"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AltState } from "./state";
import { Kitchen, Choose, PairMob, Trunk, AltCheck, Wrap } from "./steps";

export default defineModule<AltState>({
  initialState,
  steps: [
    { id: "story", title: "Tasting the soup", Component: Kitchen },
    { id: "choose", title: "Pick a review style for each change", Component: Choose },
    { id: "pair", title: "Pairing and mobbing", Component: PairMob },
    { id: "trunk", title: "Trunk-based teams and review", Component: Trunk },
    {
      id: "check",
      title: "Ship, show or ask?",
      checkpoint: "review-alternatives",
      Component: AltCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
