"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LockState } from "./state";
import { Kitchen, Sandbox, TwoPhase, InPostgres, Elsewhere, AvoidIt, Wrap } from "./steps";

export default defineModule<LockState>({
  initialState,
  steps: [
    { id: "story", title: "Two cooks, one knife", Component: Kitchen },
    { id: "sandbox", title: "Lock, wait, deadlock", Component: Sandbox },
    { id: "2pl", title: "Two-phase locking", Component: TwoPhase },
    { id: "postgres", title: "Locks in PostgreSQL", Component: InPostgres },
    { id: "elsewhere", title: "Other engines", Component: Elsewhere },
    { id: "check", title: "Stop the deadlocks", checkpoint: "avoid-deadlock", Component: AvoidIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
