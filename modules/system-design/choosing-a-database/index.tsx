"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DbState } from "./state";
import { EightShapes } from "./steps-shapes";
import { FinePrint, MatchWorkload, StartCheck } from "./steps-choose";
import { Landscape, Wrap } from "./steps-landscape";

export default defineModule<DbState>({
  initialState,
  steps: [
    { id: "shapes", title: "One business, eight shapes of data", Component: EightShapes },
    { id: "match", title: "Match the workload", Component: MatchWorkload },
    {
      id: "start",
      title: "Where would you start?",
      checkpoint: "where-to-start",
      Component: StartCheck,
    },
    { id: "fine-print", title: "Read the fine print", Component: FinePrint },
    { id: "landscape", title: "Databases you'll meet", Component: Landscape },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
