"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SqlState } from "./state";
import { InsideFile, MeetData } from "./steps-data";
import { OnlyColumns, PlanCheck, Playground, ProveSkipping, SkipCheck, Wrap } from "./steps-tasks";

export default defineModule<SqlState>({
  initialState,
  steps: [
    { id: "meet", title: "A real engine, inside this page", Component: MeetData },
    { id: "inside", title: "Look inside a Parquet file", Component: InsideFile },
    { id: "prove", title: "Prove the skipping", Component: ProveSkipping },
    {
      id: "skip-check",
      title: "What can the engine skip?",
      checkpoint: "skip-random",
      Component: SkipCheck,
    },
    { id: "columns", title: "Only the columns you need", Component: OnlyColumns },
    { id: "read-scan", title: "Read the scan", checkpoint: "read-scan", Component: PlanCheck },
    { id: "play", title: "Your turn", Component: Playground },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
