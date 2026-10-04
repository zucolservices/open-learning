"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BenchState } from "./state";
import { SchoolReport, ReadTable, WearOut, WhoRanIt, CanCant, Wrap } from "./steps";

export default defineModule<BenchState>({
  initialState,
  steps: [
    { id: "story", title: "A school report", Component: SchoolReport },
    { id: "table", title: "Read a benchmark table", Component: ReadTable },
    { id: "wear-out", title: "Benchmarks wear out", Component: WearOut },
    { id: "who", title: "Who made it, who ran it?", Component: WhoRanIt },
    {
      id: "check",
      title: "What can a benchmark tell you?",
      checkpoint: "can-cant",
      Component: CanCant,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
