"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StoreReviewState } from "./state";
import { Market, Review, Fees, NewRules, StoreCheck, Wrap } from "./steps";

export default defineModule<StoreReviewState>({
  initialState,
  steps: [
    { id: "story", title: "The market inspector", Component: Market },
    { id: "review", title: "Submit, get rejected, fix", Component: Review },
    { id: "fees", title: "Fees and payments", Component: Fees },
    { id: "rules", title: "New rules and other stores", Component: NewRules },
    { id: "check", title: "Whose checkout?", checkpoint: "mobile-billing", Component: StoreCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
