"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PromptState } from "./state";
import { Anatomy, Brief, Diagnose, FixThePrompt, Guides, TestDontGuess, Wrap } from "./steps";

export default defineModule<PromptState>({
  initialState,
  steps: [
    { id: "brief", title: "Brief a new colleague", Component: Brief },
    { id: "fix", title: "Fix the prompt", Component: FixThePrompt },
    { id: "anatomy", title: "Where each part goes", Component: Anatomy },
    {
      id: "diagnose",
      title: "Which ingredient fixes it?",
      checkpoint: "diagnose",
      Component: Diagnose,
    },
    { id: "test", title: "Test, don't guess", checkpoint: "ship-it", Component: TestDontGuess },
    { id: "guides", title: "What the guides agree on", Component: Guides },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
