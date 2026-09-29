"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EndToEndState } from "./state";
import { Ingestion, OrderStages, QueryPath, TwoHalves, Wrap } from "./steps";

export default defineModule<EndToEndState>({
  initialState,
  steps: [
    { id: "halves", title: "Two halves", Component: TwoHalves },
    { id: "ingest", title: "Before any question", Component: Ingestion },
    { id: "query", title: "Every question", Component: QueryPath },
    { id: "order", title: "Put it in order", checkpoint: "rag-stages", Component: OrderStages },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
