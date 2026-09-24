"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ConsistencyState } from "./state";
import { CapCarefully, LineGoesDead } from "./steps-cap";
import { Conflicts, CpApCheck, PredictQuorum, Quorums, Systems, Wrap } from "./steps-quorum";

export default defineModule<ConsistencyState>({
  initialState,
  steps: [
    { id: "partition", title: "The line goes dead", Component: LineGoesDead },
    { id: "models", title: "What can a reader see?", Component: CapCarefully },
    { id: "quorums", title: "Quorums: N, W and R", Component: Quorums },
    {
      id: "predict",
      title: "The smallest safe read",
      checkpoint: "quorum-r",
      Component: PredictQuorum,
    },
    { id: "conflicts", title: "When copies disagree", Component: Conflicts },
    { id: "cp-ap", title: "Is it CP or AP?", checkpoint: "cp-ap", Component: CpApCheck },
    { id: "systems", title: "Consistency you'll meet", Component: Systems },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
