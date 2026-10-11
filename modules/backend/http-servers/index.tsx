"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HttpState } from "./state";
import { Counter, Respond, Methods, Routing, HttpCheck, Wrap } from "./steps";

export default defineModule<HttpState>({
  initialState,
  steps: [
    { id: "story", title: "The post office counter", Component: Counter },
    { id: "respond", title: "Answer each request with the right status", Component: Respond },
    { id: "methods", title: "Methods: safe, idempotent, or neither", Component: Methods },
    { id: "routing", title: "Routes and handlers in five frameworks", Component: Routing },
    { id: "check", title: "Safe to retry?", checkpoint: "backend-http", Component: HttpCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
