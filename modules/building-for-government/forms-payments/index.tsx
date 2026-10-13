"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FormState } from "./state";
import { Queue, Funnel, Money, Receipts, FormCheck, Wrap } from "./steps";

export default defineModule<FormState>({
  initialState,
  steps: [
    { id: "story", title: "The counter that sends you away", Component: Queue },
    { id: "funnel", title: "Fix the leaking application", Component: Funnel },
    { id: "money", title: "Paying fees, receiving benefits", Component: Money },
    { id: "receipts", title: "Receipts, status and reconciliation", Component: Receipts },
    {
      id: "check",
      title: "How a scholarship reaches a student",
      checkpoint: "gov-payments",
      Component: FormCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
