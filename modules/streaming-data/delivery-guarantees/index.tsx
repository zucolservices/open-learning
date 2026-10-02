"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DelState } from "./state";
import { Courier, CrashIt, Elsewhere, Machinery, WhichGuarantee, Wrap } from "./steps";

export default defineModule<DelState>({
  initialState,
  steps: [
    { id: "courier", title: "Couriers and signatures", Component: Courier },
    { id: "crash", title: "Crash at the worst moment", Component: CrashIt },
    { id: "machinery", title: "How Kafka does exactly once", Component: Machinery },
    { id: "elsewhere", title: "Guarantees elsewhere", Component: Elsewhere },
    {
      id: "check",
      title: "Which guarantee?",
      checkpoint: "which-guarantee",
      Component: WhichGuarantee,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
