"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EvalState } from "./state";
import { AnswerKey, CompareSetups, Exam, Pitfalls, ScoreOne, ShipIt, Wrap } from "./steps";

export default defineModule<EvalState>({
  initialState,
  steps: [
    { id: "exam", title: "Write the exam first", Component: Exam },
    { id: "key", title: "Build the answer key", Component: AnswerKey },
    { id: "score", title: "Score one question", Component: ScoreOne },
    { id: "compare", title: "Compare four setups", Component: CompareSetups },
    { id: "pitfalls", title: "Ways to fool yourself", Component: Pitfalls },
    { id: "ship", title: "Ship it?", checkpoint: "ship-hybrid", Component: ShipIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
