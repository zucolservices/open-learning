"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type InOutState } from "./state";
import { FixTheBill, Leaving, Reception, StorageBill, TracePacket, Wrap } from "./steps";

export default defineModule<InOutState>({
  initialState,
  steps: [
    { id: "reception", title: "The reception desk", Component: Reception },
    { id: "trace", title: "Trace a packet", Component: TracePacket },
    { id: "bill", title: "The storage bill", Component: StorageBill },
    { id: "leaving", title: "What leaving costs", Component: Leaving },
    { id: "fix", title: "Fix the bill", checkpoint: "nat-bill", Component: FixTheBill },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
