"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ExpState } from "./state";
import { Recipes, FiveTools, GxVocabulary, Choosing, PickTool, Wrap } from "./steps";

export default defineModule<ExpState>({
  initialState,
  steps: [
    { id: "story", title: "Write the rule, not the check", Component: Recipes },
    { id: "tools", title: "One rule set, five tools", Component: FiveTools },
    { id: "gx", title: "Inside a framework", Component: GxVocabulary },
    { id: "choose", title: "Choosing a framework", Component: Choosing },
    { id: "check", title: "Which tool fits?", checkpoint: "pick-framework", Component: PickTool },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
