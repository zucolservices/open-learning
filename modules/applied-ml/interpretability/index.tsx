"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ExplainState } from "./state";
import { WhyRefused, Pushes, Importance, Rules, LocalOrGlobal, Wrap } from "./steps";

export default defineModule<ExplainState>({
  initialState,
  steps: [
    { id: "story", title: "“Why was I refused?”", Component: WhyRefused },
    { id: "pushes", title: "Split one prediction into pushes", Component: Pushes },
    { id: "importance", title: "What does the model rely on?", Component: Importance },
    { id: "rules", title: "When explanations are the law", Component: Rules },
    {
      id: "check",
      title: "One prediction or the whole model?",
      checkpoint: "local-or-global",
      Component: LocalOrGlobal,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
