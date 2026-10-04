"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DedupState } from "./state";
import { Reunion, Match, Fuzzy, Golden, Evidence, Wrap } from "./steps";

export default defineModule<DedupState>({
  initialState,
  steps: [
    { id: "story", title: "The school reunion", Component: Reunion },
    { id: "match", title: "Match two customer lists", Component: Match },
    { id: "fuzzy", title: "Close enough", Component: Fuzzy },
    { id: "golden", title: "The golden record", Component: Golden },
    {
      id: "check",
      title: "Strong or weak evidence?",
      checkpoint: "match-evidence",
      Component: Evidence,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
