"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UiState } from "./state";
import { BuildHouse, SparkUi, StagePage, AfterApp, JobStageTask, Wrap } from "./steps";

export default defineModule<UiState>({
  initialState,
  steps: [
    { id: "story", title: "Building a house", Component: BuildHouse },
    { id: "ui", title: "A tour of the Spark UI", Component: SparkUi },
    { id: "stage", title: "Reading a stage", Component: StagePage },
    { id: "after", title: "When the job is over", Component: AfterApp },
    {
      id: "check",
      title: "Job, stage or task?",
      checkpoint: "job-stage-task",
      Component: JobStageTask,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
