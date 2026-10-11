"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ValState } from "./state";
import { Doorman, FixEndpoint, Problem, Libraries, ValCheck, Wrap } from "./steps";

export default defineModule<ValState>({
  initialState,
  steps: [
    { id: "story", title: "The doorman and the cloakroom ticket", Component: Doorman },
    { id: "fix", title: "Harden POST /orders", Component: FixEndpoint },
    { id: "problem", title: "One error format for every endpoint", Component: Problem },
    { id: "libraries", title: "Parse, don't just check", Component: Libraries },
    { id: "check", title: "Response or logs?", checkpoint: "backend-errors", Component: ValCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
