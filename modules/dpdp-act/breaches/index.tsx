"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BreachState } from "./state";
import { CopiedKey, HourByHour, CustomerNotice, TwoClocks, BreachCheck, Wrap } from "./steps";

export default defineModule<BreachState>({
  initialState,
  steps: [
    { id: "story", title: "A copied master key", Component: CopiedKey },
    { id: "drill", title: "Hour by hour", Component: HourByHour },
    { id: "notice", title: "Write the message to customers", Component: CustomerNotice },
    { id: "clocks", title: "Two regimes, two clocks", Component: TwoClocks },
    {
      id: "check",
      title: "A personal data breach?",
      checkpoint: "dpdp-breach",
      Component: BreachCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
