"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SecState } from "./state";
import { KeyCard, AttackFix, TopTen, RealBreaches, RealFix, Wrap } from "./steps";

export default defineModule<SecState>({
  initialState,
  steps: [
    { id: "card", title: "The hotel key card", Component: KeyCard },
    { id: "attack", title: "Attack, then fix", Component: AttackFix },
    { id: "top10", title: "The OWASP API Top 10", Component: TopTen },
    { id: "breaches", title: "It really happens", Component: RealBreaches },
    { id: "check", title: "Real fix or not enough?", checkpoint: "real-fix", Component: RealFix },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
