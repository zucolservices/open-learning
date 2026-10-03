"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type JoinState } from "./state";
import { SeatingPlan, ThreeJoins, Memory, JoinOrder, PickJoin, Wrap } from "./steps";

export default defineModule<JoinState>({
  initialState,
  steps: [
    { id: "seating", title: "The wedding seating plan", Component: SeatingPlan },
    { id: "three", title: "Three ways to join", Component: ThreeJoins },
    { id: "memory", title: "When the hash table doesn't fit", Component: Memory },
    { id: "order", title: "Which table first?", Component: JoinOrder },
    { id: "check", title: "Pick the join", checkpoint: "pick-join", Component: PickJoin },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
