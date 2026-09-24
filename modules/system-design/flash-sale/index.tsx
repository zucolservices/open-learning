"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SaleState } from "./state";
import { Fairness, Holds, LastCake, RealWorld, TenOClock, WhyAtomic, Wrap } from "./steps";

export default defineModule<SaleState>({
  initialState,
  steps: [
    { id: "race", title: "The last ticket", Component: LastCake },
    { id: "ten", title: "10:00:00", Component: TenOClock },
    { id: "atomic", title: "Why can't it oversell?", checkpoint: "atomic", Component: WhyAtomic },
    { id: "holds", title: "Held, but never paid for", Component: Holds },
    { id: "shuffle", title: "Why shuffle the queue?", checkpoint: "shuffle", Component: Fairness },
    { id: "real", title: "In the real world", Component: RealWorld },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
