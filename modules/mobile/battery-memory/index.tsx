"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BattState } from "./state";
import { Flat, Drain, Battery, Memory, BattCheck, Wrap } from "./steps";

export default defineModule<BattState>({
  initialState,
  steps: [
    { id: "story", title: "The shared flat", Component: Flat },
    { id: "drain", title: "What drains, what gets killed", Component: Drain },
    { id: "battery", title: "Battery rules with teeth", Component: Battery },
    { id: "memory", title: "When memory runs out", Component: Memory },
    { id: "check", title: "Who goes first?", checkpoint: "mobile-memory", Component: BattCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
