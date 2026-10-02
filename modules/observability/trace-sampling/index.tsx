"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SamplingState } from "./state";
import { CountFirst, HeadOrTail, HowTail, KeepIt, Wrap } from "./steps";

export default defineModule<SamplingState>({
  initialState,
  steps: [
    { id: "keep", title: "Keep the trace that mattered", Component: KeepIt },
    { id: "tail", title: "How tail sampling works", Component: HowTail },
    { id: "count", title: "Count first, then sample", Component: CountFirst },
    { id: "check", title: "Head or tail?", checkpoint: "head-or-tail", Component: HeadOrTail },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
