"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FlakyState } from "./state";
import { CryWolf, Diagnose, Causes, Policy, FlakyCheck, Wrap } from "./steps";

export default defineModule<FlakyState>({
  initialState,
  steps: [
    { id: "story", title: "The car alarm nobody hears", Component: CryWolf },
    { id: "diagnose", title: "Run the suite 100 times and trace each flake", Component: Diagnose },
    { id: "causes", title: "Where flakiness comes from", Component: Causes },
    { id: "policy", title: "What a team should do", Component: Policy },
    { id: "check", title: "Name the cause", checkpoint: "testing-flaky", Component: FlakyCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
