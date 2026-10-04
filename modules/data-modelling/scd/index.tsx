"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ScdState } from "./state";
import { Address, Move, TypeTwo, Hybrids, WhichScd, Wrap } from "./steps";

export default defineModule<ScdState>({
  initialState,
  steps: [
    { id: "story", title: "The old address", Component: Address },
    { id: "move", title: "Asha moves to Mumbai", Component: Move },
    { id: "type2", title: "How type 2 works", Component: TypeTwo },
    { id: "hybrids", title: "Types 4 to 7", Component: Hybrids },
    { id: "check", title: "Which type?", checkpoint: "which-scd", Component: WhichScd },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
