"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HttpState } from "./state";
import { Envelope, BuildRequest, Methods, Versions, WhichClass, Wrap } from "./steps";

export default defineModule<HttpState>({
  initialState,
  steps: [
    { id: "envelope", title: "A letter and a reply", Component: Envelope },
    { id: "build", title: "Build a request", Component: BuildRequest },
    { id: "methods", title: "Safe and idempotent", Component: Methods },
    { id: "versions", title: "From 0.9 to 3", Component: Versions },
    { id: "check", title: "Whose fault?", checkpoint: "status-class", Component: WhichClass },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
