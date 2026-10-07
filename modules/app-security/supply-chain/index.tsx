"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ChainState } from "./state";
import { Potluck, DepTree, FourAttacks, Publishing, ChainDefence, Wrap } from "./steps";

export default defineModule<ChainState>({
  initialState,
  steps: [
    { id: "story", title: "Trusting the whole kitchen", Component: Potluck },
    { id: "tree", title: "The flaw three levels down", Component: DepTree },
    { id: "attacks", title: "Four ways in", Component: FourAttacks },
    { id: "publishing", title: "If you publish, too", Component: Publishing },
    {
      id: "check",
      title: "Which defence fits?",
      checkpoint: "chain-defence",
      Component: ChainDefence,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
