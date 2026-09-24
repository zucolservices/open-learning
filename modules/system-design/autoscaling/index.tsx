"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AutoscaleState } from "./state";
import {
  BottleneckMoves,
  KnownSpikeCheck,
  LunchRush,
  PredictHpa,
  Stateless,
  Tools,
  Wrap,
} from "./steps";

export default defineModule<AutoscaleState>({
  initialState,
  steps: [
    { id: "stateless", title: "Any server, any request", Component: Stateless },
    { id: "lunch", title: "Survive the lunch rush", Component: LunchRush },
    { id: "hpa", title: "What will Kubernetes do?", checkpoint: "hpa", Component: PredictHpa },
    { id: "bottleneck", title: "The bottleneck moves", Component: BottleneckMoves },
    {
      id: "known-spike",
      title: "A spike you can see coming",
      checkpoint: "known-spike",
      Component: KnownSpikeCheck,
    },
    { id: "tools", title: "Autoscalers you'll meet", Component: Tools },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
