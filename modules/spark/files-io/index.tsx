"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FilesState } from "./state";
import { Library, WritePlanner, Pruning, SmallFiles, DailyFiles, Wrap } from "./steps";

export default defineModule<FilesState>({
  initialState,
  steps: [
    { id: "story", title: "A well-run library", Component: Library },
    { id: "sim", title: "Plan a write", Component: WritePlanner },
    { id: "pruning", title: "Reading less", Component: Pruning },
    { id: "small", title: "Fixing small files", Component: SmallFiles },
    {
      id: "check",
      title: "Thousands of tiny files",
      checkpoint: "daily-files",
      Component: DailyFiles,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
