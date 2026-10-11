"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PbtState } from "./state";
import { Inspector, Sandbox, Patterns, Fuzzing, PbtCheck, Wrap } from "./steps";

export default defineModule<PbtState>({
  initialState,
  steps: [
    { id: "story", title: "Rules, not examples", Component: Inspector },
    { id: "sandbox", title: "Let random inputs break a sort", Component: Sandbox },
    { id: "patterns", title: "Finding a property", Component: Patterns },
    { id: "fuzzing", title: "Fuzzing: random inputs, hunting crashes", Component: Fuzzing },
    { id: "check", title: "Pick the property", checkpoint: "testing-pbt", Component: PbtCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
