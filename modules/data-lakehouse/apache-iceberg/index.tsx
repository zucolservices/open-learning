"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IcebergState } from "./state";
import { DiaryOrTree, FollowQuery, ReadPathCheck, TreeStory } from "./steps-intro";
import { CommitCheck, CommitSteps, Snapshots } from "./steps-commit";
import { EvolutionSort, FieldIds, HiddenPartitioning, PartitionEvolution } from "./steps-evolution";
import { DeleteCheck, Healthy, RowDeletes, Wrap } from "./steps-deletes";

export default defineModule<IcebergState>({
  initialState,
  steps: [
    { id: "diary-or-tree", title: "A diary or a tree?", Component: DiaryOrTree },
    { id: "tree", title: "The tree in 3D", Component: TreeStory },
    { id: "query", title: "Follow a query", Component: FollowQuery },
    { id: "read-path", title: "The read path", checkpoint: "read-path", Component: ReadPathCheck },
    { id: "commit", title: "A commit = a new top", Component: CommitSteps },
    {
      id: "commit-check",
      title: "What a commit writes",
      checkpoint: "commit-writes",
      Component: CommitCheck,
    },
    { id: "snapshots", title: "Snapshots, branches & tags", Component: Snapshots },
    { id: "hidden", title: "Hidden partitioning", Component: HiddenPartitioning },
    { id: "evolution", title: "Partition evolution", Component: PartitionEvolution },
    { id: "field-ids", title: "Field IDs", Component: FieldIds },
    {
      id: "metadata-or-rewrite",
      title: "Metadata or rewrite?",
      checkpoint: "metadata-or-rewrite",
      Component: EvolutionSort,
    },
    { id: "deletes", title: "Row-level deletes", Component: RowDeletes },
    {
      id: "which-delete",
      title: "Pick the delete",
      checkpoint: "which-delete",
      Component: DeleteCheck,
    },
    { id: "healthy", title: "Keeping it healthy", Component: Healthy },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
