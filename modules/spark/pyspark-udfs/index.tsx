"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PyState } from "./state";
import { Interpreter, UdfLadder, TwoProcesses, WritingUdfs, WorkerOrNot, Wrap } from "./steps";

export default defineModule<PyState>({
  initialState,
  steps: [
    { id: "story", title: "Through an interpreter", Component: Interpreter },
    { id: "ladder", title: "The UDF ladder", Component: UdfLadder },
    { id: "processes", title: "Two processes, one bridge", Component: TwoProcesses },
    { id: "writing", title: "Writing faster Python", Component: WritingUdfs },
    { id: "check", title: "Does Python run?", checkpoint: "python-worker", Component: WorkerOrNot },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
