"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReadableState } from "./state";
import { TwoLineFix } from "./steps-story";
import { FindBug, TimeGoes, Schools, ReadableCheck, Wrap } from "./steps";

export default defineModule<ReadableState>({
  initialState,
  steps: [
    { id: "story", title: "A two-hour, one-minute fix", Component: TwoLineFix },
    { id: "find", title: "Find the bug, three times", Component: FindBug },
    { id: "time", title: "Where developers' time goes", Component: TimeGoes },
    { id: "schools", title: "Not one rulebook", Component: Schools },
    {
      id: "check",
      title: "Easier or harder to read?",
      checkpoint: "clean-why",
      Component: ReadableCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
