"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TestState } from "./state";
import { BenchRigRoad, ShapeSuite, WhenTestsLie, WhichTest, Wrap } from "./steps";

export default defineModule<TestState>({
  initialState,
  steps: [
    { id: "kinds", title: "On the bench, on the rig, on the road", Component: BenchRigRoad },
    { id: "shape", title: "Shape the suite", Component: ShapeSuite },
    { id: "flaky", title: "When tests lie", Component: WhenTestsLie },
    {
      id: "check",
      title: "Which test catches it?",
      checkpoint: "which-test",
      Component: WhichTest,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
