"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WaState } from "./state";
import { Inspection, Pillars, Review, TradeOffs, WhichPillar, Wrap } from "./steps";

export default defineModule<WaState>({
  initialState,
  steps: [
    { id: "inspection", title: "A house inspection", Component: Inspection },
    { id: "pillars", title: "The pillars", Component: Pillars },
    { id: "review", title: "Review a design", Component: Review },
    { id: "tradeoffs", title: "Every fix has a price", Component: TradeOffs },
    { id: "which", title: "Which pillar?", checkpoint: "which-pillar", Component: WhichPillar },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
