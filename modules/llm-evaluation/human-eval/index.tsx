"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HumanEvalState } from "./state";
import { Judges, RatingStudy, Arena, Caveats, WhichStat, Wrap } from "./steps";

export default defineModule<HumanEvalState>({
  initialState,
  steps: [
    { id: "story", title: "Talent-show judges", Component: Judges },
    { id: "study", title: "Run a rating study", Component: RatingStudy },
    { id: "arena", title: "Side-by-side votes", Component: Arena },
    { id: "caveats", title: "Reading a leaderboard carefully", Component: Caveats },
    { id: "check", title: "Which statistic?", checkpoint: "which-stat", Component: WhichStat },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
