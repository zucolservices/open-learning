"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ImbState } from "./state";
import { Needle, FraudFix, Accuracy, Smote, GoodOrMistake, Wrap } from "./steps";

export default defineModule<ImbState>({
  initialState,
  steps: [
    { id: "story", title: "A needle in a haystack", Component: Needle },
    { id: "fix", title: "1 in 500 is fraud", Component: FraudFix },
    { id: "accuracy", title: "Why 99.8% means nothing", Component: Accuracy },
    { id: "smote", title: "Rebalancing: what the evidence says", Component: Smote },
    {
      id: "check",
      title: "Good idea or mistake?",
      checkpoint: "good-or-mistake",
      Component: GoodOrMistake,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
