"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FairnessState } from "./state";
import { BlindAudition, SwapTest, Ambiguity, Studies, WhichTest, Wrap } from "./steps";

export default defineModule<FairnessState>({
  initialState,
  steps: [
    { id: "story", title: "Blind auditions", Component: BlindAudition },
    { id: "swap", title: "Swap the name, change the answer?", Component: SwapTest },
    { id: "ambiguity", title: "When the answer is “can't tell”", Component: Ambiguity },
    { id: "studies", title: "What studies have found", Component: Studies },
    { id: "check", title: "Which test?", checkpoint: "which-test", Component: WhichTest },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
