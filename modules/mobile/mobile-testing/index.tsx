"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TestState } from "./state";
import { Tasting, Lab, Layers, Devices, TestCheck, Wrap } from "./steps";

export default defineModule<TestState>({
  initialState,
  steps: [
    { id: "story", title: "The test kitchen", Component: Tasting },
    { id: "lab", title: "Build a device lab", Component: Lab },
    { id: "layers", title: "Layers of tests", Component: Layers },
    { id: "devices", title: "Simulators, emulators and farms", Component: Devices },
    {
      id: "check",
      title: "Which kind of test?",
      checkpoint: "mobile-testing",
      Component: TestCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
