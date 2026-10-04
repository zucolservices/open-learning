"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PlatState } from "./state";
import { CarTaxi, WhereToRun, ClusterManagers, Connect, WhichModel, Wrap } from "./steps";

export default defineModule<PlatState>({
  initialState,
  steps: [
    { id: "story", title: "Own, lease or taxi", Component: CarTaxi },
    { id: "where", title: "Who manages what", Component: WhereToRun },
    { id: "managers", title: "Cluster managers", Component: ClusterManagers },
    { id: "connect", title: "Spark Connect", Component: Connect },
    { id: "check", title: "Which model?", checkpoint: "which-model", Component: WhichModel },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
