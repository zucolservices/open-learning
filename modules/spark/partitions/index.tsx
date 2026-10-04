"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PartState } from "./state";
import { Markers, Waves, WhereCounts, Reshape, FixIt, Wrap } from "./steps";

export default defineModule<PartState>({
  initialState,
  steps: [
    { id: "story", title: "Marking exam papers", Component: Markers },
    { id: "waves", title: "Tasks in waves", Component: Waves },
    { id: "where", title: "Where partition counts come from", Component: WhereCounts },
    { id: "reshape", title: "repartition or coalesce?", Component: Reshape },
    { id: "check", title: "The idle cluster", checkpoint: "idle-cluster", Component: FixIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
