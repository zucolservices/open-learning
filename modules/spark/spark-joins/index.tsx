"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type JoinState } from "./state";
import { Wedding, JoinPicker, MergeWalk, Hints, SlowJoin, Wrap } from "./steps";

export default defineModule<JoinState>({
  initialState,
  steps: [
    { id: "story", title: "Seating the guests", Component: Wedding },
    { id: "picker", title: "Pick a join strategy", Component: JoinPicker },
    { id: "merge", title: "Sort-merge, step by step", Component: MergeWalk },
    { id: "hints", title: "Hints and estimates", Component: Hints },
    { id: "check", title: "The slow join", checkpoint: "slow-join", Component: SlowJoin },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
