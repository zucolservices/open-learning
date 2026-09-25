"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SmallState } from "./state";
import { Cascade, Distillation, OnDevice, RoutingTest, Sizes, SmallOrLarge, Wrap } from "./steps";

export default defineModule<SmallState>({
  initialState,
  steps: [
    { id: "sizes", title: "From phone to data centre", Component: Sizes },
    { id: "test", title: "Sorting support messages", Component: RoutingTest },
    { id: "distil", title: "Distillation", Component: Distillation },
    { id: "cascade", title: "Small first, escalate when unsure", Component: Cascade },
    { id: "device", title: "Models on your phone", Component: OnDevice },
    {
      id: "choose",
      title: "Small or large?",
      checkpoint: "small-or-large",
      Component: SmallOrLarge,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
