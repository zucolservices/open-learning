"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MedallionState } from "./state";
import { MessyRecord } from "./steps-story";
import { LayerSort, QualityGates } from "./steps-layers";
import { WirePipeline } from "./steps-build";
import { BadDay, RetryCheck } from "./steps-backfill";
import { Tools, Wrap } from "./steps-more";

export default defineModule<MedallionState>({
  initialState,
  steps: [
    { id: "messy-record", title: "One messy record, bronze to gold", Component: MessyRecord },
    { id: "layer-sort", title: "Which layer?", checkpoint: "layer-sort", Component: LayerSort },
    { id: "quality", title: "What happens to a bad record?", Component: QualityGates },
    { id: "wire", title: "Wire the pipeline", Component: WirePipeline },
    { id: "bad-day", title: "Replay a bad day", Component: BadDay },
    { id: "retry", title: "The retry", checkpoint: "retry", Component: RetryCheck },
    { id: "tools", title: "The toolbox", Component: Tools },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
