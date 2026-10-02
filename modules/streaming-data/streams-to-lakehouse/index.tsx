"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LakeState } from "./state";
import { Interval, Receipts, Tools, TuneOrTidy, Upserts, Wrap } from "./steps";

export default defineModule<LakeState>({
  initialState,
  steps: [
    { id: "receipts", title: "Filing receipts", Component: Receipts },
    { id: "interval", title: "Tune the commit interval", Component: Interval },
    { id: "upserts", title: "Updates leave a trail", Component: Upserts },
    { id: "tools", title: "Kafka to table, ready-made", Component: Tools },
    { id: "check", title: "Tune or tidy?", checkpoint: "tune-or-tidy", Component: TuneOrTidy },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
