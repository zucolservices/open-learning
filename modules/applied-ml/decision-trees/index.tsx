"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TreeState } from "./state";
import { TwentyQuestions, GrowTree, Impurity, Unstable, TreeFacts, Wrap } from "./steps";

export default defineModule<TreeState>({
  initialState,
  steps: [
    { id: "story", title: "Twenty questions", Component: TwentyQuestions },
    { id: "grow", title: "Grow a loan-approval tree", Component: GrowTree },
    { id: "impurity", title: "Choosing the best question", Component: Impurity },
    { id: "unstable", title: "Easy to read, easy to upset", Component: Unstable },
    { id: "check", title: "True of trees?", checkpoint: "tree-facts", Component: TreeFacts },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
