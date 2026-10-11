"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HistState } from "./state";
import { Letters, GrowGraph, InsideCommit, MoveHead, HistCheck, Wrap } from "./steps";

export default defineModule<HistState>({
  initialState,
  steps: [
    { id: "story", title: "“Further to my last letter…”", Component: Letters },
    { id: "grow", title: "Grow a history", Component: GrowGraph },
    { id: "inside", title: "Inside a commit", Component: InsideCommit },
    { id: "head", title: "Where is HEAD?", Component: MoveHead },
    { id: "check", title: "True or false?", checkpoint: "git-history", Component: HistCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
