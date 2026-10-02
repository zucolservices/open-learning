"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RlState } from "./state";
import { HitLimit, NodeShort, PackNodes, TableBooked, WhichQos, Wrap } from "./steps";

export default defineModule<RlState>({
  initialState,
  steps: [
    { id: "table", title: "A booked table and a plate size", Component: TableBooked },
    { id: "pack", title: "Pack the nodes", Component: PackNodes },
    { id: "limit", title: "Hit the limit", Component: HitLimit },
    { id: "short", title: "When a node runs short", Component: NodeShort },
    { id: "check", title: "Which QoS class?", checkpoint: "which-qos", Component: WhichQos },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
