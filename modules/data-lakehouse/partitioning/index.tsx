"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PartitioningState } from "./state";
import { FilingCabinet } from "./steps-intro";
import { CardinalityCheck, Simulator } from "./steps-sim";
import { BeyondFolders, KeySort, RulesOfThumb, SmallFilesFix, Wrap } from "./steps-more";

export default defineModule<PartitioningState>({
  initialState,
  steps: [
    { id: "cabinet", title: "A filing cabinet", Component: FilingCabinet },
    { id: "simulator", title: "Choose a scheme", Component: Simulator },
    {
      id: "cardinality",
      title: "High cardinality",
      checkpoint: "cardinality",
      Component: CardinalityCheck,
    },
    {
      id: "fix",
      title: "The five-million-file table",
      checkpoint: "small-files-fix",
      Component: SmallFilesFix,
    },
    { id: "rules", title: "Rules of thumb", Component: RulesOfThumb },
    { id: "beyond", title: "Beyond folders", Component: BeyondFolders },
    { id: "keys", title: "Good key or poor?", checkpoint: "partition-keys", Component: KeySort },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
