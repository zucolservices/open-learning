"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StoriesState } from "./state";
import { AcOrDod, Criteria, FixStories, ThreeCs, Wrap } from "./steps";

export default defineModule<StoriesState>({
  initialState,
  steps: [
    { id: "three-cs", title: "Card, conversation, confirmation", Component: ThreeCs },
    { id: "fix", title: "Fix the stories", Component: FixStories },
    { id: "criteria", title: "Write the acceptance criteria", Component: Criteria },
    {
      id: "ac-dod",
      title: "This story, or every story?",
      checkpoint: "ac-dod",
      Component: AcOrDod,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
