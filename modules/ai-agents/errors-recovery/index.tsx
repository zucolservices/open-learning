"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ErrState } from "./state";
import { Satnav, Recover, Backoff, Failures, WhatToDo, Wrap } from "./steps";

export default defineModule<ErrState>({
  initialState,
  steps: [
    { id: "story", title: "The road is closed", Component: Satnav },
    { id: "recover", title: "Four failures, your choices", Component: Recover },
    { id: "backoff", title: "Retrying politely", Component: Backoff },
    { id: "failures", title: "How agents fail", Component: Failures },
    {
      id: "check",
      title: "Retry, fix or stop?",
      checkpoint: "retry-fix-stop",
      Component: WhatToDo,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
