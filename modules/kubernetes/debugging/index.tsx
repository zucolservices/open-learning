"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DebugState } from "./state";
import { DoctorQuestions, FirstCommand, Incidents, Toolbox, Wrap } from "./steps";

export default defineModule<DebugState>({
  initialState,
  steps: [
    { id: "doctor", title: "A doctor's questions", Component: DoctorQuestions },
    { id: "incidents", title: "Five incidents", Component: Incidents },
    { id: "toolbox", title: "The toolbox", Component: Toolbox },
    { id: "check", title: "First command?", checkpoint: "first-command", Component: FirstCommand },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
