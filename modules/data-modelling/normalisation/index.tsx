"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type NormState } from "./state";
import { AddressBook, Normalise, WholeKey, WhenToStop, WhichAnomaly, Wrap } from "./steps";

export default defineModule<NormState>({
  initialState,
  steps: [
    { id: "story", title: "The address written everywhere", Component: AddressBook },
    { id: "normalise", title: "Normalise an orders sheet", Component: Normalise },
    { id: "key", title: "The key, the whole key", Component: WholeKey },
    { id: "stop", title: "When to stop", Component: WhenToStop },
    { id: "check", title: "Which anomaly?", checkpoint: "which-anomaly", Component: WhichAnomaly },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
