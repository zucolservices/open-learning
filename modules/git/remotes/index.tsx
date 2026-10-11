"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RemoteState } from "./state";
import { Photocopies, SyncCopies, TrackingBranch, PullSettings, RemoteCheck, Wrap } from "./steps";

export default defineModule<RemoteState>({
  initialState,
  steps: [
    { id: "story", title: "Everyone's copy of the recipe book", Component: Photocopies },
    { id: "sync", title: "Keep three copies in sync", Component: SyncCopies },
    { id: "tracking", title: "origin/main is a note, not a live view", Component: TrackingBranch },
    { id: "settings", title: "Telling pull what to do", Component: PullSettings },
    {
      id: "check",
      title: "Fetch, pull or push?",
      checkpoint: "git-remotes",
      Component: RemoteCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
