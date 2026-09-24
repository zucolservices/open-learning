"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EnginesState } from "./state";
import { LifeOfQuery } from "./steps-story";
import { BytesCalculator, PredictScan } from "./steps-cost";
import { PlanReader, SlowQueryCheck, Vectorised } from "./steps-exec";
import { EngineExplorer, Wrap } from "./steps-engines";

export default defineModule<EnginesState>({
  initialState,
  steps: [
    { id: "life", title: "The life of a query", Component: LifeOfQuery },
    {
      id: "predict",
      title: "How much does it read?",
      checkpoint: "predict-scan",
      Component: PredictScan,
    },
    { id: "bytes", title: "What makes a query cheap?", Component: BytesCalculator },
    { id: "vectorised", title: "Row or batch at a time?", Component: Vectorised },
    { id: "plan", title: "Reading a query plan", Component: PlanReader },
    {
      id: "slow",
      title: "The slow dashboard",
      checkpoint: "slow-query",
      Component: SlowQueryCheck,
    },
    { id: "engines", title: "Same tables, many engines", Component: EngineExplorer },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
