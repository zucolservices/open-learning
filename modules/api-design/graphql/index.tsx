"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GqlState } from "./state";
import { Thali, BuildQuery, Protect, ErrorsEvolve, BigQuery, Wrap } from "./steps";

export default defineModule<GqlState>({
  initialState,
  steps: [
    { id: "thali", title: "Pick your own plate", Component: Thali },
    { id: "build", title: "One query, many calls", Component: BuildQuery },
    { id: "protect", title: "Protecting the kitchen", Component: Protect },
    { id: "errors", title: "Errors and evolution", Component: ErrorsEvolve },
    { id: "check", title: "The enormous query", checkpoint: "big-query", Component: BigQuery },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
