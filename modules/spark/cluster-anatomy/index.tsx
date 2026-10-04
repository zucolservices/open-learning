"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ClusterState } from "./state";
import { Kitchen, RunStage, WhereRuns, Glossary, WhoDoes, Wrap } from "./steps";

export default defineModule<ClusterState>({
  initialState,
  steps: [
    { id: "story", title: "The head chef and the cooks", Component: Kitchen },
    { id: "run", title: "Run a stage", Component: RunStage },
    { id: "where", title: "Where the cluster comes from", Component: WhereRuns },
    { id: "words", title: "The words Spark uses", Component: Glossary },
    {
      id: "check",
      title: "Driver or executor?",
      checkpoint: "driver-or-executor",
      Component: WhoDoes,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
