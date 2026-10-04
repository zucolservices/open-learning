"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ShuffleState } from "./state";
import { MailRoom, ShuffleSim, WhichOps, ShuffleFiles, DoesItShuffle, Wrap } from "./steps";

export default defineModule<ShuffleState>({
  initialState,
  steps: [
    { id: "story", title: "The sorting office", Component: MailRoom },
    { id: "sim", title: "Watch a shuffle", Component: ShuffleSim },
    { id: "ops", title: "What causes a shuffle", Component: WhichOps },
    { id: "files", title: "Where shuffle files live", Component: ShuffleFiles },
    {
      id: "check",
      title: "Does it shuffle?",
      checkpoint: "does-it-shuffle",
      Component: DoesItShuffle,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
