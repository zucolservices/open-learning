"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BuyState } from "./state";
import { Pocket, Purchase, Rules, Abroad, BuyCheck, Wrap } from "./steps";

export default defineModule<BuyState>({
  initialState,
  steps: [
    { id: "story", title: "Spending other people's money", Component: Pocket },
    { id: "purchase", title: "Buy a case-management system", Component: Purchase },
    { id: "rules", title: "The rules in brief", Component: Rules },
    { id: "abroad", title: "How other countries buy", Component: Abroad },
    { id: "check", title: "GeM or a tender?", checkpoint: "gov-procurement", Component: BuyCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
