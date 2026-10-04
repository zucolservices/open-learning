"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CodeChecksState } from "./state";
import { AnswerKey, Graders, ShapeNotTruth, RunTheCode, CodeOrJudgment, Wrap } from "./steps";

export default defineModule<CodeChecksState>({
  initialState,
  steps: [
    { id: "story", title: "The answer key", Component: AnswerKey },
    { id: "graders", title: "Graders a program can run", Component: Graders },
    { id: "shape", title: "Shape isn't truth", Component: ShapeNotTruth },
    { id: "run", title: "Running the code: pass@k", Component: RunTheCode },
    {
      id: "check",
      title: "Can code grade it?",
      checkpoint: "code-or-judgment",
      Component: CodeOrJudgment,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
