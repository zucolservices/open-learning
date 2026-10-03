"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BpState } from "./state";
import { LibrarianDesk, CacheSim, DirtyPages, RealPools, WhySlow, Wrap } from "./steps";

export default defineModule<BpState>({
  initialState,
  steps: [
    { id: "desk", title: "The librarian's desk", Component: LibrarianDesk },
    { id: "sim", title: "One big scan", Component: CacheSim },
    { id: "dirty", title: "Dirty pages", Component: DirtyPages },
    { id: "real", title: "How real engines do it", Component: RealPools },
    { id: "check", title: "The slow morning", checkpoint: "why-slow", Component: WhySlow },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
