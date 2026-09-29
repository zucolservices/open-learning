"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EmbState } from "./state";
import {
  ChooseModel,
  LanguageLab,
  MeaningNotWords,
  ScoresAreRelative,
  TestFirst,
  Wrap,
} from "./steps";

export default defineModule<EmbState>({
  initialState,
  steps: [
    { id: "meaning", title: "Meaning, not words", Component: MeaningNotWords },
    { id: "lab", title: "Three ways to ask", Component: LanguageLab },
    { id: "scores", title: "Scores are relative", Component: ScoresAreRelative },
    { id: "choose", title: "Choosing a model", Component: ChooseModel },
    { id: "test", title: "What would you do?", checkpoint: "emb-test", Component: TestFirst },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
