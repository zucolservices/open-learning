"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StorageState } from "./state";
import { FoldersThatArent, ListByPrefix } from "./steps-keys";
import { PredictBytes, RenameFolder, WhyTablesCare } from "./steps-rename";
import { CommitCheck, TwoWriters } from "./steps-writes";
import { CompareStores, Lifecycle, SmallObjects, Wrap } from "./steps-cost";

export default defineModule<StorageState>({
  initialState,
  steps: [
    { id: "folders", title: "The folders that aren't", Component: FoldersThatArent },
    { id: "list", title: "Listing by prefix", Component: ListByPrefix },
    { id: "rename", title: "Rename a folder", Component: RenameFolder },
    {
      id: "predict",
      title: "How much does a rename move?",
      checkpoint: "rename-bytes",
      Component: PredictBytes,
    },
    { id: "tables", title: "Why tables care", Component: WhyTablesCare },
    { id: "writers", title: "Two writers, one key", Component: TwoWriters },
    {
      id: "commit",
      title: "Connect the dots",
      checkpoint: "commit-one-file",
      Component: CommitCheck,
    },
    { id: "small", title: "Many small objects", Component: SmallObjects },
    { id: "lifecycle", title: "Storage classes & lifecycle", Component: Lifecycle },
    { id: "compare", title: "S3 vs GCS vs ADLS", Component: CompareStores },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
