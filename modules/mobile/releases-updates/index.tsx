"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RelState } from "./state";
import { Recall, Rollout, Stages, OldVersions, RelCheck, Wrap } from "./steps";

export default defineModule<RelState>({
  initialState,
  steps: [
    { id: "story", title: "Printed menus", Component: Recall },
    { id: "rollout", title: "A bad release, day by day", Component: Rollout },
    { id: "stages", title: "How each store rolls out", Component: Stages },
    { id: "old", title: "Old versions and remote switches", Component: OldVersions },
    {
      id: "check",
      title: "Does it need a release?",
      checkpoint: "mobile-release",
      Component: RelCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
