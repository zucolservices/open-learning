"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PayloadState } from "./state";
import { WhichDate, FixPayment, Conventions, NullsEnums, SafeOrTrap, Wrap } from "./steps";

export default defineModule<PayloadState>({
  initialState,
  steps: [
    { id: "date", title: "Which date?", Component: WhichDate },
    { id: "fix", title: "Fix the payment", Component: FixPayment },
    { id: "conventions", title: "Pick a style, keep it", Component: Conventions },
    { id: "nulls", title: "Missing, null and new", Component: NullsEnums },
    { id: "check", title: "Safe or trap?", checkpoint: "safe-or-trap", Component: SafeOrTrap },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
