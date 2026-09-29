"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type JudgeState } from "./state";
import {
  Biases,
  JudgeYourself,
  ModelJudge,
  Referee,
  Trustworthy,
  WhenToTrust,
  Wrap,
} from "./steps";

export default defineModule<JudgeState>({
  initialState,
  steps: [
    { id: "referee", title: "Marking an essay", Component: Referee },
    { id: "yourself", title: "Judge them yourself", Component: JudgeYourself },
    { id: "model", title: "Let a model judge", Component: ModelJudge },
    { id: "biases", title: "The judge's habits", Component: Biases },
    { id: "trust", title: "Making a judge trustworthy", Component: Trustworthy },
    {
      id: "when",
      title: "A judge that always passes",
      checkpoint: "judge-passes",
      Component: WhenToTrust,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
