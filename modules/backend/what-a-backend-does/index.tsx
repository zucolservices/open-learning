"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BeState } from "./state";
import { OneRequest } from "./steps-story";
import { Budget, Jobs, Runtimes, LifeCheck, Wrap } from "./steps";

export default defineModule<BeState>({
  initialState,
  steps: [
    { id: "story", title: "The life of one request", Component: OneRequest },
    { id: "budget", title: "Where does the time go?", Component: Budget },
    { id: "jobs", title: "What a backend is responsible for", Component: Jobs },
    { id: "runtimes", title: "Where backend code runs, and in what", Component: Runtimes },
    {
      id: "check",
      title: "Trace the request",
      checkpoint: "backend-lifecycle",
      Component: LifeCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
