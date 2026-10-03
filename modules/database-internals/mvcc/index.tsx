"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MvccState } from "./state";
import { ManyVersions } from "./steps-story";
import { StepThrough, Cleanup, Hot, Undo, GrowingTable, Wrap } from "./steps";

export default defineModule<MvccState>({
  initialState,
  steps: [
    { id: "story", title: "Many versions", Component: ManyVersions },
    { id: "step", title: "Read while someone writes", Component: StepThrough },
    { id: "cleanup", title: "Cleaning up", Component: Cleanup },
    { id: "hot", title: "HOT updates", Component: Hot },
    { id: "undo", title: "Old versions elsewhere", Component: Undo },
    {
      id: "check",
      title: "The growing table",
      checkpoint: "growing-table",
      Component: GrowingTable,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
