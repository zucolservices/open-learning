"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FreshState } from "./state";
import { BuildPipeline, MetadataCard, NoticeBoard, WhichMechanism, Wrap } from "./steps";

export default defineModule<FreshState>({
  initialState,
  steps: [
    { id: "board", title: "The notice board", Component: NoticeBoard },
    { id: "build", title: "Keep the index honest", Component: BuildPipeline },
    { id: "metadata", title: "What to store with each chunk", Component: MetadataCard },
    {
      id: "which",
      title: "Which mechanism?",
      checkpoint: "fresh-which",
      Component: WhichMechanism,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
