"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IntegrationState } from "./state";
import { Plug, ThreeBackends, FastIsolated, Tools, IntegrationCheck, Wrap } from "./steps";

export default defineModule<IntegrationState>({
  initialState,
  steps: [
    { id: "story", title: "Every part passed, the kettle didn't", Component: Plug },
    {
      id: "backends",
      title: "Run the same tests against three databases",
      Component: ThreeBackends,
    },
    {
      id: "fast",
      title: "Keeping integration tests fast and independent",
      Component: FastIsolated,
    },
    { id: "tools", title: "Tools for throwaway infrastructure", Component: Tools },
    {
      id: "check",
      title: "Which test would catch it?",
      checkpoint: "testing-integration",
      Component: IntegrationCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
