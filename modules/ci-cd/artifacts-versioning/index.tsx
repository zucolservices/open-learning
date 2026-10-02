"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ArtifactState } from "./state";
import { Overwritten, RebuildOrPromote, Versions, WhereTheyLive, Wrap } from "./steps";

export default defineModule<ArtifactState>({
  initialState,
  steps: [
    { id: "promote", title: "Rebuild or promote?", Component: RebuildOrPromote },
    { id: "versions", title: "Versions that mean something", Component: Versions },
    { id: "registries", title: "Where artifacts live", Component: WhereTheyLive },
    {
      id: "check",
      title: "The overwritten version",
      checkpoint: "overwritten-version",
      Component: Overwritten,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
