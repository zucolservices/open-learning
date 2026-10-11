"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MigState } from "./state";
import { Bridge, Rename, Tools, Locks, MigCheck, Wrap } from "./steps";

export default defineModule<MigState>({
  initialState,
  steps: [
    { id: "story", title: "Replacing a bridge without closing the road", Component: Bridge },
    { id: "rename", title: "Rename a column on a live system", Component: Rename },
    { id: "tools", title: "Versioned migrations", Component: Tools },
    { id: "locks", title: "Locks: the hidden danger", Component: Locks },
    {
      id: "check",
      title: "Expand and contract, in order",
      checkpoint: "backend-migrations",
      Component: MigCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
