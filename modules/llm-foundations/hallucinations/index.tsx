"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HalState } from "./state";
import {
  AskFiveTimes,
  DiagnoseAndFix,
  FluentIsntTrue,
  MatchTheFix,
  WhyModelsGuess,
  Wrap,
} from "./steps";

export default defineModule<HalState>({
  initialState,
  steps: [
    { id: "fluent", title: "Fluent isn't the same as true", Component: FluentIsntTrue },
    { id: "five", title: "Ask it five times", Component: AskFiveTimes },
    { id: "fix", title: "Diagnose and fix", Component: DiagnoseAndFix },
    { id: "guess", title: "Why models guess", Component: WhyModelsGuess },
    {
      id: "match",
      title: "Match the fix to the cause",
      checkpoint: "fixes",
      Component: MatchTheFix,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
