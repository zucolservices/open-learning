"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IdemState } from "./state";
import { LiftButton, PayTwice, KeyStore, RetryWell, SafeToRetry, Wrap } from "./steps";

export default defineModule<IdemState>({
  initialState,
  steps: [
    { id: "lift", title: "The lift button", Component: LiftButton },
    { id: "pay", title: "Pay ₹500, once", Component: PayTwice },
    { id: "store", title: "How the server remembers", Component: KeyStore },
    { id: "retry", title: "Retrying politely", Component: RetryWell },
    { id: "check", title: "Safe to retry?", checkpoint: "safe-to-retry", Component: SafeToRetry },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
