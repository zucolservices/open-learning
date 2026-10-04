"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EsState } from "./state";
import { Ledger, Rebuild, ReadModels, WhenNot, FitOrNot, Wrap } from "./steps";

export default defineModule<EsState>({
  initialState,
  steps: [
    { id: "story", title: "Nobody erases a ledger", Component: Ledger },
    { id: "rebuild", title: "Rebuild a balance", Component: Rebuild },
    { id: "read", title: "Separate reads from writes", Component: ReadModels },
    { id: "when", title: "Powerful, and often overused", Component: WhenNot },
    { id: "check", title: "Good fit?", checkpoint: "es-fit", Component: FitOrNot },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
