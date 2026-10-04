"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WideState } from "./state";
import { Catalogue, WideSim, Nested, TradeOffs, DashboardChoice, Wrap } from "./steps";

export default defineModule<WideState>({
  initialState,
  steps: [
    { id: "story", title: "Everything on one page", Component: Catalogue },
    { id: "sim", title: "Star or one big table?", Component: WideSim },
    { id: "nested", title: "Nested and repeated fields", Component: Nested },
    { id: "tradeoffs", title: "What it costs", Component: TradeOffs },
    {
      id: "check",
      title: "Faster dashboards",
      checkpoint: "faster-dashboards",
      Component: DashboardChoice,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
