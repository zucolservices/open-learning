"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type JoinState } from "./state";
import { Cashier, Duality, GrowingState, JoinIt, WhichJoin, Wrap } from "./steps";

export default defineModule<JoinState>({
  initialState,
  steps: [
    { id: "cashier", title: "The cashier's register", Component: Cashier },
    { id: "duality", title: "Streams and tables", Component: Duality },
    { id: "join", title: "Join payments to customers and logins", Component: JoinIt },
    { id: "grow", title: "Watch the state grow", Component: GrowingState },
    { id: "check", title: "Which join?", checkpoint: "which-join", Component: WhichJoin },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
