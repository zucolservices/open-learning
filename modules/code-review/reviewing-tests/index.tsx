"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TestsState } from "./state";
import { SmokeAlarm, FixTests, Checklist, TestsFirst, TestsCheck, Wrap } from "./steps";

export default defineModule<TestsState>({
  initialState,
  steps: [
    { id: "story", title: "The smoke alarm with no battery", Component: SmokeAlarm },
    { id: "fix", title: "Break the code: do the tests notice?", Component: FixTests },
    { id: "checklist", title: "Five questions for every test file", Component: Checklist },
    { id: "first", title: "Should you read the tests first?", Component: TestsFirst },
    { id: "check", title: "Useful or weak?", checkpoint: "review-tests", Component: TestsCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
