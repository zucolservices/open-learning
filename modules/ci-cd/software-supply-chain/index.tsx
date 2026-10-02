"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ChainState } from "./state";
import { FourLinks, ProveIt, WhatsInside, WhichLink, Wrap } from "./steps";

export default defineModule<ChainState>({
  initialState,
  steps: [
    { id: "links", title: "Four attacks, four links", Component: FourLinks },
    { id: "sbom", title: "Know what's inside", Component: WhatsInside },
    { id: "provenance", title: "Prove where it came from", Component: ProveIt },
    {
      id: "check",
      title: "Which link does it guard?",
      checkpoint: "which-link",
      Component: WhichLink,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
