"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UpdatesState } from "./state";
import { Anatomy, MorFamily, PrintedBook } from "./steps-intro";
import { AmplificationCheck, TradeOff, WhenToCompact } from "./steps-sim";
import { EraseOrder, ReallyGone, SwitchingItOn, Wrap } from "./steps-more";

export default defineModule<UpdatesState>({
  initialState,
  steps: [
    { id: "book", title: "A typo in a printed book", Component: PrintedBook },
    { id: "anatomy", title: "Anatomy of an UPDATE", Component: Anatomy },
    { id: "family", title: "The Merge-on-Read family", Component: MorFamily },
    { id: "trade-off", title: "The trade-off", Component: TradeOff },
    {
      id: "amplification",
      title: "Write amplification",
      checkpoint: "cow-write-mb",
      Component: AmplificationCheck,
    },
    { id: "compact", title: "When to compact", Component: WhenToCompact },
    { id: "gone", title: "Really gone?", Component: ReallyGone },
    {
      id: "erase-order",
      title: "Order the erasure",
      checkpoint: "erase-order",
      Component: EraseOrder,
    },
    { id: "settings", title: "Per format", Component: SwitchingItOn },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
