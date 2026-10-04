"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GraphState } from "./state";
import { Whiteboard, FraudRing, TwoGraphModels, WhenGraph, GraphOrTable, Wrap } from "./steps";

export default defineModule<GraphState>({
  initialState,
  steps: [
    { id: "story", title: "Circles and arrows", Component: Whiteboard },
    { id: "sim", title: "Follow the ring", Component: FraudRing },
    { id: "models", title: "Property graphs and RDF", Component: TwoGraphModels },
    { id: "when", title: "When a graph fits", Component: WhenGraph },
    {
      id: "check",
      title: "Graph or table?",
      checkpoint: "graph-or-table",
      Component: GraphOrTable,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
