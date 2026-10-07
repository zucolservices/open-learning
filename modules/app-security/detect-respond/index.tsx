"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DetectState } from "./state";
import { SmokeAlarm, LogTriage, ResponseLoop, Duties, WorthAlerting, Wrap } from "./steps";

export default defineModule<DetectState>({
  initialState,
  steps: [
    { id: "story", title: "The smoke alarm nobody wired up", Component: SmokeAlarm },
    { id: "triage", title: "Read the logs during an attack", Component: LogTriage },
    { id: "loop", title: "Before, during, after", Component: ResponseLoop },
    { id: "duties", title: "Who you have to tell", Component: Duties },
    {
      id: "check",
      title: "Log, alert, or never?",
      checkpoint: "log-alert",
      Component: WorthAlerting,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
