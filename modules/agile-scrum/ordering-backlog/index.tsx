"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OrderState } from "./state";
import { Errands, OrderIt, OrderMyths, RiskFirst, Wrap } from "./steps";

export default defineModule<OrderState>({
  initialState,
  steps: [
    { id: "errands", title: "Everything can't come first", Component: Errands },
    { id: "order", title: "Order the backlog", Component: OrderIt },
    { id: "risk", title: "When risk goes first", checkpoint: "risk-first", Component: RiskFirst },
    { id: "myths", title: "Guide or myth?", checkpoint: "order-myths", Component: OrderMyths },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
