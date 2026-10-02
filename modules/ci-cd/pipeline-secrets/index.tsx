"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SecretsState } from "./state";
import { KeepsHappening, NoKey, SafeOrRisky, StrangersPR, Wrap } from "./steps";

export default defineModule<SecretsState>({
  initialState,
  steps: [
    { id: "pr", title: "A stranger's pull request", Component: StrangersPR },
    { id: "oidc", title: "No key to steal", Component: NoKey },
    { id: "incidents", title: "It keeps happening", Component: KeepsHappening },
    {
      id: "check",
      title: "Safe or risky?",
      checkpoint: "pipeline-safe-or-risky",
      Component: SafeOrRisky,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
