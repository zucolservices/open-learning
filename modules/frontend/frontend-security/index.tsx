"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SecState } from "./state";
import { Noticeboard, Defend, Defences, SupplyChain, SecCheck, Wrap } from "./steps";

export default defineModule<SecState>({
  initialState,
  steps: [
    { id: "story", title: "The café noticeboard", Component: Noticeboard },
    { id: "defend", title: "Defend a comment widget and sign-in", Component: Defend },
    { id: "defences", title: "The browser's own defences", Component: Defences },
    {
      id: "supply",
      title: "When the attack comes through your dependencies",
      Component: SupplyChain,
    },
    {
      id: "check",
      title: "Real protection or false comfort?",
      checkpoint: "frontend-security",
      Component: SecCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
