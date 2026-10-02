"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type NpState } from "./state";
import { LockDown, NoLocks, WillConnect, WritingPolicy, Wrap } from "./steps";

export default defineModule<NpState>({
  initialState,
  steps: [
    { id: "locks", title: "An office with no locks", Component: NoLocks },
    { id: "lock", title: "Lock it down", Component: LockDown },
    { id: "write", title: "Writing a policy", Component: WritingPolicy },
    { id: "check", title: "Will it connect?", checkpoint: "will-connect", Component: WillConnect },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
