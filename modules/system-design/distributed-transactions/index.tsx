"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TxState } from "./state";
import { CompensateCheck, DualWrite, OutboxCheck, Tools, TwoWays, Wrap } from "./steps";

export default defineModule<TxState>({
  initialState,
  steps: [
    { id: "two-ways", title: "One order, three databases", Component: TwoWays },
    {
      id: "compensate",
      title: "Compensation is not undo",
      checkpoint: "compensate",
      Component: CompensateCheck,
    },
    { id: "dual-write", title: "Save it, and tell everyone", Component: DualWrite },
    { id: "once", title: "Exactly once?", checkpoint: "outbox-once", Component: OutboxCheck },
    { id: "tools", title: "Saga engines you'll meet", Component: Tools },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
