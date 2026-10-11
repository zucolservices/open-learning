"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TddState } from "./state";
import { ExamFirst, Loop, Canon, Evidence, TddCheck, Wrap } from "./steps";

export default defineModule<TddState>({
  initialState,
  steps: [
    { id: "story", title: "Write the exam before the lesson", Component: ExamFirst },
    { id: "loop", title: "Build a password checker test-first", Component: Loop },
    { id: "canon", title: "Kent Beck's own description", Component: Canon },
    { id: "evidence", title: "Does it work?", Component: Evidence },
    { id: "check", title: "Put the loop in order", checkpoint: "testing-tdd", Component: TddCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
