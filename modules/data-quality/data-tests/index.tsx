"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TestState } from "./state";
import { SmokeAlarm, TestBench, UnitVsData, WhenTestsFail, WhichTest, Wrap } from "./steps";

export default defineModule<TestState>({
  initialState,
  steps: [
    { id: "story", title: "Smoke alarms for data", Component: SmokeAlarm },
    { id: "bench", title: "A bad load meets its tests", Component: TestBench },
    { id: "unit", title: "Data tests and unit tests", Component: UnitVsData },
    { id: "fail", title: "When a test fails", Component: WhenTestsFail },
    {
      id: "check",
      title: "Which test catches it?",
      checkpoint: "which-test",
      Component: WhichTest,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
