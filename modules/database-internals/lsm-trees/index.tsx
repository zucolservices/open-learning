"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LsmState } from "./state";
import { OrderPad, WritePath, ReadPath, TradeOffs, WhySlower, Wrap } from "./steps";

export default defineModule<LsmState>({
  initialState,
  steps: [
    { id: "pad", title: "The order pad", Component: OrderPad },
    { id: "write", title: "Writes: memtable, flush, compact", Component: WritePath },
    { id: "read", title: "Reads: newest first", Component: ReadPath },
    { id: "trade", title: "Three kinds of amplification", Component: TradeOffs },
    {
      id: "check",
      title: "Why reads can be slower",
      checkpoint: "why-slower",
      Component: WhySlower,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
