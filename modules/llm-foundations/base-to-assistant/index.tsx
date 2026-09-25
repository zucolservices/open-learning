"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AssistState } from "./state";
import { BehaviourNotKnowledge, HowSft, Lora, TwoModels, WhichTool, Wrap } from "./steps";

export default defineModule<AssistState>({
  initialState,
  steps: [
    { id: "two", title: "Same prompt, two models", Component: TwoModels },
    { id: "sft", title: "From mimic to assistant", Component: HowSft },
    {
      id: "behaviour",
      title: "What did tuning change?",
      checkpoint: "behaviour",
      Component: BehaviourNotKnowledge,
    },
    { id: "lora", title: "Fine-tuning on a budget", Component: Lora },
    {
      id: "which",
      title: "Prompt, fine-tune or pretrain?",
      checkpoint: "which-tool",
      Component: WhichTool,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
