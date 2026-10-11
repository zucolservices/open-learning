"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DebtState } from "./state";
import { CreditCard, SixMonths, Quadrant, PayDown, DebtCheck, Wrap } from "./steps";

export default defineModule<DebtState>({
  initialState,
  steps: [
    { id: "story", title: "Buying the oven on a credit card", Component: CreditCard },
    { id: "months", title: "Six months of choices", Component: SixMonths },
    { id: "quadrant", title: "Not all debt is the same", Component: Quadrant },
    { id: "paydown", title: "How big is it, and how to pay it down", Component: PayDown },
    { id: "check", title: "Which kind of debt?", checkpoint: "clean-debt", Component: DebtCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
