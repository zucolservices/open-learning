"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RlState } from "./state";
import { WaterTank, TwoLimiters, TellThem, InTheWild, OnA429, Wrap } from "./steps";

export default defineModule<RlState>({
  initialState,
  steps: [
    { id: "tank", title: "A tank with a tap", Component: WaterTank },
    { id: "limiters", title: "Same limit, different shape", Component: TwoLimiters },
    { id: "tell", title: "Tell them when to come back", Component: TellThem },
    { id: "wild", title: "Limits in the wild", Component: InTheWild },
    { id: "check", title: "What the client should do", checkpoint: "on-429", Component: OnA429 },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
