"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SecretsState } from "./state";
import { SpareKey, KeyHunt, SafeHomes, BreachStories, HandleLeak, Wrap } from "./steps";

export default defineModule<SecretsState>({
  initialState,
  steps: [
    { id: "story", title: "A key under the mat", Component: SpareKey },
    { id: "hunt", title: "Find the leaked key", Component: KeyHunt },
    { id: "homes", title: "Where should secrets live?", Component: SafeHomes },
    { id: "stories", title: "Keys that cost millions", Component: BreachStories },
    {
      id: "check",
      title: "What do you do first?",
      checkpoint: "handle-leak",
      Component: HandleLeak,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
