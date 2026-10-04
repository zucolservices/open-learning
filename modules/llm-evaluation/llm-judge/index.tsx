"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type JudgeState } from "./state";
import { TheCritic, BiasedJudge, ThreeStyles, JudgePrompt, NameTheBias, Wrap } from "./steps";

export default defineModule<JudgeState>({
  initialState,
  steps: [
    { id: "story", title: "A food critic with habits", Component: TheCritic },
    { id: "biased", title: "Catch the biased judge", Component: BiasedJudge },
    { id: "styles", title: "Three ways to judge", Component: ThreeStyles },
    { id: "prompt", title: "Writing a judge prompt", Component: JudgePrompt },
    { id: "check", title: "Name the bias", checkpoint: "name-the-bias", Component: NameTheBias },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
