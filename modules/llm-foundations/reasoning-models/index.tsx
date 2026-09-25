"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReasonState } from "./state";
import { Budget, Controls, Puzzle, ThinkingOutLoud, Training, WorthIt, Wrap } from "./steps";

export default defineModule<ReasonState>({
  initialState,
  steps: [
    { id: "puzzle", title: "Answer fast", checkpoint: "bat-ball", Component: Puzzle },
    { id: "trace", title: "Thinking out loud", Component: ThinkingOutLoud },
    { id: "budget", title: "How long should it think?", Component: Budget },
    { id: "training", title: "How reasoning is trained", Component: Training },
    {
      id: "worth",
      title: "Worth thinking hard?",
      checkpoint: "worth-thinking",
      Component: WorthIt,
    },
    { id: "controls", title: "Thinking dials you'll meet", Component: Controls },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
