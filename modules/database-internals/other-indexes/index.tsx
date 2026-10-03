"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OiState } from "./state";
import { Catalogues, FiveIndexes, Approximate, InPostgres, MatchIndex, Wrap } from "./steps";

export default defineModule<OiState>({
  initialState,
  steps: [
    { id: "catalogues", title: "Five catalogues", Component: Catalogues },
    { id: "five", title: "Same reviews, five indexes", Component: FiveIndexes },
    { id: "approx", title: "Close enough, much faster", Component: Approximate },
    { id: "pg", title: "In real databases", Component: InPostgres },
    { id: "check", title: "Match the index", checkpoint: "match-index", Component: MatchIndex },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
