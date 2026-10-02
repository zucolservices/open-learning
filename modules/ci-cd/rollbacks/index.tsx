"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RollbackState } from "./state";
import { Cases, OneWayDoors, SixPm, WhichWayOut, Wrap } from "./steps";

export default defineModule<RollbackState>({
  initialState,
  steps: [
    { id: "sixpm", title: "6 p.m., and checkout is failing", Component: SixPm },
    { id: "doors", title: "One-way doors", Component: OneWayDoors },
    { id: "cases", title: "When undoing went wrong, and right", Component: Cases },
    { id: "check", title: "Which way out?", checkpoint: "which-way-out", Component: WhichWayOut },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
