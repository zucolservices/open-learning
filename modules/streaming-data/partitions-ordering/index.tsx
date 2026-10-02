"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PartState } from "./state";
import { Counters, HashIt, HotPartition, OrderMatters, PickKey, Platforms, Wrap } from "./steps";

export default defineModule<PartState>({
  initialState,
  steps: [
    { id: "counters", title: "Counters at the post office", Component: Counters },
    { id: "hash", title: "From key to partition", Component: HashIt },
    { id: "order", title: "Order only within a partition", Component: OrderMatters },
    { id: "hot", title: "One partition runs hot", Component: HotPartition },
    { id: "platforms", title: "Partitions everywhere", Component: Platforms },
    { id: "pick", title: "Pick the key", checkpoint: "pick-the-key", Component: PickKey },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
