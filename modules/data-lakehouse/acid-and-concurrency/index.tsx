"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AcidState } from "./state";
import { FourPromises } from "./steps-intro";
import { WithoutAServer } from "./steps-story";
import { ConflictLab, LabCheck } from "./steps-lab";
import { FewerConflicts, IsolationLevels, PromiseSort, Referee, Wrap } from "./steps-more";

export default defineModule<AcidState>({
  initialState,
  steps: [
    { id: "promises", title: "One transfer, four promises", Component: FourPromises },
    { id: "no-server", title: "Without a server", Component: WithoutAServer },
    { id: "lab", title: "The conflict lab", Component: ConflictLab },
    { id: "predict", title: "Predict the race", checkpoint: "predict-race", Component: LabCheck },
    { id: "isolation", title: "Isolation levels", Component: IsolationLevels },
    { id: "fewer-conflicts", title: "Fewer conflicts", Component: FewerConflicts },
    { id: "referee", title: "Who referees the commit?", Component: Referee },
    {
      id: "which-promise",
      title: "Which promise?",
      checkpoint: "which-promise",
      Component: PromiseSort,
    },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
