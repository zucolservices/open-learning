"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RetState } from "./state";
import { Cleanup, Elsewhere, PhoneStorage, Tiered, WhichPolicy, Wrap } from "./steps";

export default defineModule<RetState>({
  initialState,
  steps: [
    { id: "phone", title: "A phone that never fills up", Component: PhoneStorage },
    { id: "cleanup", title: "Delete, or keep the latest", Component: Cleanup },
    { id: "tiered", title: "Old segments to object storage", Component: Tiered },
    { id: "elsewhere", title: "How long others keep events", Component: Elsewhere },
    { id: "which", title: "Which policy?", checkpoint: "which-policy", Component: WhichPolicy },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
