"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TuneState } from "./state";
import { Oven, SearchBudget, Halving, Fooling, ParamOrHyper, Wrap } from "./steps";

export default defineModule<TuneState>({
  initialState,
  steps: [
    { id: "story", title: "Learning a new oven", Component: Oven },
    { id: "search", title: "Search the knobs on a budget", Component: SearchBudget },
    { id: "halving", title: "Stop the losers early", Component: Halving },
    { id: "fooling", title: "Tuning without fooling yourself", Component: Fooling },
    {
      id: "check",
      title: "Learned or chosen?",
      checkpoint: "param-or-hyper",
      Component: ParamOrHyper,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
