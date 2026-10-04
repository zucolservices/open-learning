"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PipeState } from "./state";
import { RelayRace, Trace, Architectures, Models, WhichWins, Wrap } from "./steps";

export default defineModule<PipeState>({
  initialState,
  steps: [
    { id: "story", title: "A relay race", Component: RelayRace },
    { id: "trace", title: "One question, five stages", Component: Trace },
    { id: "architectures", title: "Three ways to build it", Component: Architectures },
    { id: "models", title: "Models that listen and speak", Component: Models },
    {
      id: "check",
      title: "Pipeline or speech-to-speech?",
      checkpoint: "which-arch",
      Component: WhichWins,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
