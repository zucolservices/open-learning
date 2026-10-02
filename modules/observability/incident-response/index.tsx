"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IncState } from "./state";
import { Firefighters, FridayNight, Severity, WhoseJob, Wrap } from "./steps";

export default defineModule<IncState>({
  initialState,
  steps: [
    { id: "fire", title: "Borrowed from firefighters", Component: Firefighters },
    { id: "friday", title: "Friday, 19:30", Component: FridayNight },
    { id: "sev", title: "How bad is it?", Component: Severity },
    { id: "check", title: "Whose job is it?", checkpoint: "whose-job", Component: WhoseJob },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
