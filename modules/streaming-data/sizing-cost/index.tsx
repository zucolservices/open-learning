"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SizingState } from "./state";
import { Catering, Disk, HiddenBill, Partitions, PriceIt, WhatGrows, Wrap } from "./steps";

export default defineModule<SizingState>({
  initialState,
  steps: [
    { id: "catering", title: "Counters or plates", Component: Catering },
    { id: "partitions", title: "How many partitions?", Component: Partitions },
    { id: "disk", title: "How much disk?", Component: Disk },
    { id: "price", title: "Price it", Component: PriceIt },
    { id: "network", title: "The hidden bill", Component: HiddenBill },
    { id: "check", title: "What grows the bill?", checkpoint: "what-grows", Component: WhatGrows },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
